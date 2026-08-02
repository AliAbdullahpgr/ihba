import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { Copy } from "@/app/components/LanguageProvider";
import { content, defaultOrgSettings } from "@/lib/content";
import { db } from "@/lib/db/client";
import {
  ORG_SETTINGS_ID,
  bankAccounts,
  boardMembers,
  galleryItems,
  newsArticles,
  newsTranslations,
  orgSettings,
  projectImages,
  projects,
  projectTranslations,
  siteContent,
  siteMedia,
  socialAccounts,
} from "@/lib/db/schema";
import { bundledGalleryItems, type PublicGalleryItem } from "@/lib/gallery";
import { dict, type Lang } from "@/lib/i18n";
import { mergeContentDefaults } from "@/lib/merge-content";
import { stripHtml } from "@/lib/rich-text";
import {
  bundledMedia,
  type SiteMedia,
  type SiteMediaKey,
} from "@/lib/media";

const locales: Lang[] = ["en", "tr"];

function fallbackBlankStrings<T>(primary: T, fallback: unknown): T {
  if (typeof primary === "string") {
    return (primary.trim() || typeof fallback !== "string"
      ? primary
      : fallback) as T;
  }
  if (Array.isArray(primary)) {
    const fallbackItems = Array.isArray(fallback) ? fallback : [];
    return primary.map((item, index) =>
      fallbackBlankStrings(item, fallbackItems[index])
    ) as T;
  }
  if (primary && typeof primary === "object") {
    const fallbackRecord =
      fallback && typeof fallback === "object"
        ? (fallback as Record<string, unknown>)
        : {};
    return Object.fromEntries(
      Object.entries(primary as Record<string, unknown>).map(([key, value]) => [
        key,
        fallbackBlankStrings(value, fallbackRecord[key]),
      ])
    ) as T;
  }
  return primary;
}

export function fallbackCopies(): Record<Lang, Copy> {
  const base = {
    media: structuredClone(bundledMedia),
    org: { ...defaultOrgSettings },
    bankAccounts: [],
  };
  return {
    en: { ...dict.en, ...content.en, ...structuredClone(base) },
    tr: { ...dict.tr, ...content.tr, ...structuredClone(base) },
  };
}

async function readSiteCopies(): Promise<Record<Lang, Copy>> {
  const fallback = fallbackCopies();

  try {
    const [
      documents,
      mediaRows,
      projectRows,
      boardRows,
      newsRows,
      orgRow,
      bankRows,
      socialRows,
      projectImageRows,
    ] = await Promise.all([
      db.select().from(siteContent),
      db.select().from(siteMedia),
      db
        .select({
          project: projects,
          translation: projectTranslations,
        })
        .from(projects)
        .innerJoin(
          projectTranslations,
          eq(projectTranslations.projectId, projects.id)
        )
        .where(eq(projects.state, "published"))
        .orderBy(asc(projects.sortOrder)),
      db
        .select()
        .from(boardMembers)
        .where(eq(boardMembers.visible, true))
        .orderBy(asc(boardMembers.sortOrder)),
      db
        .select({
          article: newsArticles,
          translation: newsTranslations,
        })
        .from(newsArticles)
        .innerJoin(
          newsTranslations,
          eq(newsTranslations.articleId, newsArticles.id)
        )
        .where(eq(newsArticles.state, "published"))
        .orderBy(desc(newsArticles.publishedAt)),
      db.query.orgSettings.findFirst({ where: eq(orgSettings.id, ORG_SETTINGS_ID) }),
      db
        .select()
        .from(bankAccounts)
        .where(eq(bankAccounts.active, true))
        .orderBy(asc(bankAccounts.sortOrder)),
      db
        .select()
        .from(socialAccounts)
        .where(eq(socialAccounts.active, true))
        .orderBy(asc(socialAccounts.sortOrder)),
      db.select().from(projectImages).orderBy(asc(projectImages.sortOrder)),
      ]);

    const copies = structuredClone(fallback);
    for (const row of documents) {
      if (row.locale === "en" || row.locale === "tr") {
        copies[row.locale] = mergeContentDefaults(
          fallback[row.locale],
          row.document
        );
      }
    }

    for (const locale of locales) {
      copies[locale].media = structuredClone(bundledMedia);
      for (const media of mediaRows) {
        if (media.key in copies[locale].media) {
          copies[locale].media[media.key as SiteMediaKey] = {
            url: media.imageUrl,
            publicId: media.imagePublicId,
          };
        }
      }

      const localizedProjects = projectRows
        .filter(
          (row) =>
            row.translation.locale === locale ||
            (locale === "en" &&
              row.translation.locale === "tr" &&
              !projectRows.some(
                (candidate) =>
                  candidate.project.id === row.project.id &&
                  candidate.translation.locale === "en"
              ))
        )
        .map(({ project, translation }) => ({
          slug: project.slug,
          title: translation.title,
          region: translation.region,
          status: translation.statusLabel,
          lifecycle: project.lifecycle,
          featured: project.featured,
          body: translation.body,
          facts: translation.facts,
          chips: translation.chips,
          image: project.imageUrl
            ? {
                src: project.imageUrl,
                alt: translation.imageAlt,
                publicId: project.imagePublicId ?? undefined,
              }
            : undefined,
          gallery: projectImageRows
            .filter((image) => image.projectId === project.id)
            .map((image) => ({
              src: image.imageUrl,
              alt: (locale === "en" ? image.altEn || image.altTr : image.altTr) || "",
              caption:
                (locale === "en" ? image.captionEn || image.captionTr : image.captionTr) || "",
              publicId: image.imagePublicId ?? undefined,
            })),
        }));

      if (localizedProjects.length) {
        copies[locale].projectsPage.details = localizedProjects;
        copies[locale].projects.cards = localizedProjects.map((project, index) => ({
          badgeKey:
            copies[locale].projects.cards[index]?.badgeKey ?? "active",
          badge: project.status,
          region: project.region,
          title: project.title,
          // Card summaries are plain strings, so the opening block is flattened
          // out of the rich text it may now carry.
          summary: stripHtml(project.body[0] ?? ""),
          chips: project.chips ?? [],
        }));
      }

      if (boardRows.length) {
        copies[locale].boardPage.members = boardRows.map((member) => ({
          name: member.name,
          role:
            locale === "en"
              ? member.roleEn || member.roleTr
              : member.roleTr,
        }));
      }

      copies[locale].newsPage.items = newsRows
        .filter(
          (row) =>
            row.translation.locale === locale ||
            (locale === "en" &&
              row.translation.locale === "tr" &&
              !newsRows.some(
                (candidate) =>
                  candidate.article.id === row.article.id &&
                  candidate.translation.locale === "en"
              ))
        )
        .map(({ article, translation }) => ({
          slug: article.slug,
          title: translation.title,
          excerpt: translation.excerpt,
          body: translation.body,
          publishedAt: (article.publishedAt ?? article.createdAt).toISOString(),
          image: article.imageUrl
            ? {
                src: article.imageUrl,
                alt: translation.imageAlt,
                publicId: article.imagePublicId ?? undefined,
              }
            : undefined,
        }));
    }

    /*
      Organisation facts are language independent and are the single source of
      truth once set, so they are written over both locale documents rather
      than merged — an IBAN edited in one place must not linger in the other.
      Blank fields are skipped so an unfilled setting keeps the bundled copy.
    */
    for (const locale of locales) {
      const copy = copies[locale];

      if (orgRow) {
        if (orgRow.phone) copy.utility.phone = orgRow.phone;
        if (orgRow.email) copy.utility.email = orgRow.email;
        if (orgRow.address) {
          copy.contactPage.address = orgRow.address;
          copy.footer.addressLine = orgRow.address;
        }
        if (Array.isArray(copy.contactPage.rows)) {
          copy.contactPage.rows = copy.contactPage.rows.map((row, index) =>
            index === 0 && orgRow.phone
              ? { ...row, value: orgRow.phone }
              : index === 1 && orgRow.email
                ? { ...row, value: orgRow.email }
                : row
          );
        }
      }

      copy.org = {
        phone: orgRow?.phone ?? copy.utility.phone,
        whatsapp: orgRow?.whatsapp ?? "",
        email: orgRow?.email ?? copy.utility.email,
        address: orgRow?.address ?? "",
        mapsUrl: orgRow?.mapsUrl ?? "",
        workingHours: orgRow?.workingHours ?? "",
        registryNumber: orgRow?.registryNumber ?? "",
        taxNumber: orgRow?.taxNumber ?? "",
        mersisNumber: orgRow?.mersisNumber ?? "",
        establishedOn: orgRow?.establishedOn ?? "",
        orgStatus: orgRow?.orgStatus ?? "",
      };

      copy.bankAccounts = bankRows.map((account) => ({
        currency: account.currency,
        bankName: account.bankName,
        accountHolder: account.accountHolder,
        iban: account.iban,
      }));

      // Only replace the bundled profiles once the admin has entered some;
      // an empty table would otherwise silently strip the footer icons.
      if (socialRows.length) {
        copy.socialLinks = socialRows.map((account) => ({
          key: account.platform,
          label: account.label,
          url: account.url,
          active: account.active,
          openInNewTab: account.openInNewTab,
        }));
      }
    }

    copies.en = fallbackBlankStrings(copies.en, copies.tr);
    return copies;
  } catch (error) {
    console.error("Falling back to bundled site content:", error);
    return fallback;
  }
}

// Bump the key whenever the bundled copy/media shape gains fields. Reusing a
// pre-change cached object would leave new routes with an older runtime shape.
export const getSiteCopies = unstable_cache(readSiteCopies, ["site-copies-v6"], {
  tags: ["site-content"],
  revalidate: 300,
});

async function readPublicGalleryItems(): Promise<PublicGalleryItem[]> {
  try {
    const rows = await db.query.galleryItems.findMany({
      where: eq(galleryItems.state, "published"),
      with: { galleryTranslations: true },
      orderBy: [asc(galleryItems.sortOrder), asc(galleryItems.createdAt)],
    });
    return rows.length ? rows : bundledGalleryItems;
  } catch (error) {
    console.error("Falling back to bundled gallery:", error);
    return bundledGalleryItems;
  }
}

export const getPublicGalleryItems = unstable_cache(
  readPublicGalleryItems,
  ["public-gallery-v1"],
  {
    tags: ["gallery"],
    revalidate: 300,
  }
);

export async function getPublicProject(slug: string) {
  return db.query.projects.findFirst({
    where: and(eq(projects.slug, slug), eq(projects.state, "published")),
    with: { projectTranslations: true },
  });
}

export async function getPublicNewsArticle(slug: string) {
  return db.query.newsArticles.findFirst({
    where: and(
      eq(newsArticles.slug, slug),
      eq(newsArticles.state, "published")
    ),
    with: { newsTranslations: true },
  });
}
