import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { Copy } from "@/app/components/LanguageProvider";
import { content } from "@/lib/content";
import { db } from "@/lib/db/client";
import {
  boardMembers,
  galleryItems,
  newsArticles,
  newsTranslations,
  projects,
  projectTranslations,
  siteContent,
  siteMedia,
} from "@/lib/db/schema";
import { bundledGalleryItems, type PublicGalleryItem } from "@/lib/gallery";
import { dict, type Lang } from "@/lib/i18n";
import { mergeContentDefaults } from "@/lib/merge-content";
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
  return {
    en: { ...dict.en, ...content.en, media: structuredClone(bundledMedia) },
    tr: { ...dict.tr, ...content.tr, media: structuredClone(bundledMedia) },
  };
}

async function readSiteCopies(): Promise<Record<Lang, Copy>> {
  const fallback = fallbackCopies();

  try {
    const [documents, mediaRows, projectRows, boardRows, newsRows] =
      await Promise.all([
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
        }));

      if (localizedProjects.length) {
        copies[locale].projectsPage.details = localizedProjects;
        copies[locale].projects.cards = localizedProjects.map((project, index) => ({
          badgeKey:
            copies[locale].projects.cards[index]?.badgeKey ?? "active",
          badge: project.status,
          region: project.region,
          title: project.title,
          summary: project.body[0] ?? "",
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

    copies.en = fallbackBlankStrings(copies.en, copies.tr);
    return copies;
  } catch (error) {
    console.error("Falling back to bundled site content:", error);
    return fallback;
  }
}

// Bump the key whenever the bundled copy/media shape gains fields. Reusing a
// pre-change cached object would leave new routes with an older runtime shape.
export const getSiteCopies = unstable_cache(readSiteCopies, ["site-copies-v4"], {
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
