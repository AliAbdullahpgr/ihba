"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Figure } from "@/app/components/Lightbox";
import { PageHeader } from "@/app/components/PageShell";
import { RichText } from "@/app/components/RichText";
import { ShareRow } from "@/app/components/ShareRow";

export function NewsDetailPage({ slug }: { slug: string }) {
  const { t } = useI18n();
  const article = t.newsPage.items?.find((item) => item.slug === slug);
  if (!article) return null;

  return (
    <>
      <PageHeader
        title={article.title}
        lede={article.excerpt}
        backHref="/news"
        backLabel={t.nav.news}
      />
      <article className="bg-white pb-20 lg:pb-28">
        <div className="container-site">
          {article.image && (
            <Figure
              images={[{ src: article.image.src, alt: article.image.alt }]}
              imageClassName="aspect-[16/9] w-full"
            />
          )}
          <div className="mt-12 max-w-2xl">
            <time
              dateTime={article.publishedAt}
              className="text-xs font-semibold text-ink/70"
            >
              {new Date(article.publishedAt).toLocaleDateString()}
            </time>
            <RichText blocks={article.body} className="mt-6" />
            <div className="mt-12 border-t border-navy-ink/15 pt-6">
              <ShareRow title={article.title} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
