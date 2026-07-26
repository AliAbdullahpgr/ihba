"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Figure } from "@/app/components/Lightbox";
import { PageHeader } from "@/app/components/PageShell";
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
              imageClassName="aspect-[16/9] w-full object-cover"
            />
          )}
          <div className="mt-12 max-w-2xl">
            <time className="text-xs font-semibold text-ink/45">
              {new Date(article.publishedAt).toLocaleDateString()}
            </time>
            <div className="mt-6 space-y-5">
              {article.body.map((paragraph) =>
                paragraph.startsWith("## ") ? (
                  <h2
                    key={paragraph}
                    className="border-t border-navy-ink/15 pt-8 font-display text-2xl font-medium leading-tight text-navy-ink"
                  >
                    {paragraph.slice(3)}
                  </h2>
                ) : (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-ink/75"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
            <div className="mt-12 border-t border-navy-ink/15 pt-6">
              <ShareRow title={article.title} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
