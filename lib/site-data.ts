import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { Copy } from "@/app/components/LanguageProvider";
import { content } from "@/lib/content";
import { db } from "@/lib/db/client";
import {
  boardMembers,
  newsArticles,
  newsTranslations,
  projects,
  projectTranslations,
  siteContent,
  siteMedia,
} from "@/lib/db/schema";
import { dict, type Lang } from "@/lib/i18n";
import {
  bundledMedia,
  type SiteMedia,
  type SiteMediaKey,
} from "@/lib/media";

const locales: Lang[] = ["en", "tr"];

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
        copies[row.locale] = row.document as unknown as Copy;
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
        .filter((row) => row.translation.locale === locale)
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
          role: locale === "en" ? member.roleEn : member.roleTr,
        }));
      }

      copies[locale].newsPage.items = newsRows
        .filter((row) => row.translation.locale === locale)
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

    return copies;
  } catch (error) {
    console.error("Falling back to bundled site content:", error);
    return fallback;
  }
}

export const getSiteCopies = unstable_cache(readSiteCopies, ["site-copies"], {
  tags: ["site-content"],
  revalidate: 300,
});

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
