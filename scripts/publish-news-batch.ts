/**
 * Seeds the long-form informational articles held in scripts/data/news-batch.json.
 *
 * Articles are inserted as drafts so that each one can be read in the admin and
 * flipped to Published from the news form. Re-running updates the translations of
 * an article that already exists without changing a state that has been set by
 * hand, so it is safe to run after editing the JSON.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { newsArticles, newsTranslations } from "../lib/db/schema";

type Translation = {
  title: string;
  excerpt: string;
  imageAlt: string;
  body: string[];
};

type Article = { slug: string; en: Translation; tr: Translation };

// Run from the repository root, as the npm script does.
const articles: Article[] = JSON.parse(
  readFileSync(path.join(process.cwd(), "scripts", "data", "news-batch.json"), "utf8")
);

function assertShape(article: Article) {
  for (const locale of ["en", "tr"] as const) {
    const translation = article[locale];
    if (!translation?.title || !translation.excerpt || !translation.body?.length) {
      throw new Error(`${article.slug} [${locale}]: incomplete translation`);
    }
  }
  if (article.en.body.length !== article.tr.body.length) {
    throw new Error(
      `${article.slug}: body lengths differ (en=${article.en.body.length}, tr=${article.tr.body.length})`
    );
  }
  article.en.body.forEach((paragraph, index) => {
    const enHeading = paragraph.startsWith("## ");
    const trHeading = article.tr.body[index].startsWith("## ");
    if (enHeading !== trHeading) {
      throw new Error(`${article.slug}: subheading misaligned at index ${index}`);
    }
  });
}

async function main() {
  articles.forEach(assertShape);

  for (const article of articles) {
    const existing = await db.query.newsArticles.findFirst({
      where: eq(newsArticles.slug, article.slug),
    });
    const id = existing?.id ?? `news_${article.slug}`;
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .insert(newsArticles)
        .values({
          id,
          slug: article.slug,
          state: "draft",
          publishedAt: existing?.publishedAt ?? now,
        })
        .onConflictDoUpdate({
          target: newsArticles.id,
          set: {
            slug: article.slug,
            // Never override a state an editor has already chosen.
            state: existing?.state ?? "draft",
            publishedAt: existing?.publishedAt ?? now,
            updatedAt: now,
          },
        });

      for (const locale of ["tr", "en"] as const) {
        const translation = { locale, ...article[locale] };
        await tx
          .insert(newsTranslations)
          .values({ articleId: id, ...translation })
          .onConflictDoUpdate({
            target: [newsTranslations.articleId, newsTranslations.locale],
            set: translation,
          });
      }
    });

    console.log(
      `${existing ? "updated" : "created"} ${article.slug} [${
        existing?.state ?? "draft"
      }] — ${article.en.body.length} entries per language`
    );
  }

  console.log(
    "\nArticles are drafts. Open /admin/news, read one, and set it to Published to make it live."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
