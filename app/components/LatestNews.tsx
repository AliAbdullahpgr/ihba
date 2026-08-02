"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import {
  ArrowLink,
  CardLink,
  CardMedia,
  CardTitle,
} from "@/app/components/primitives";
import { pickSelected } from "@/lib/homepage-sections";

/**
 * Latest news, as a short summary that opens detail pages.
 *
 * Shows the three articles chosen in the homepage layout editor, or the three
 * most recent when nothing has been chosen. When no news has been published at
 * all, the section renders the same empty-state messaging used on the
 * dedicated /news page so the two stay consistent.
 */
export function LatestNews() {
  const { t } = useI18n();
  const items = pickSelected(
    t.newsPage.items ?? [],
    t.homepage.news,
    (item) => item.slug,
  );

  return (
    <section
      id="news"
      aria-labelledby="news-title"
      className="bg-white pb-20 lg:pb-28"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2
            id="news-title"
            className="display-xl max-w-2xl text-3xl text-navy-ink sm:text-4xl"
          >
            {t.latestNews.title}
          </h2>
          <ArrowLink href="/news">{t.latestNews.viewAll}</ArrowLink>
        </div>

        {items.length > 0 ? (
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {items.map((item, index) => (
              <Reveal key={item.slug} delay={(index % 3) * 90}>
                {item.image ? (
                  <CardLink href={`/news/${item.slug}`}>
                    <CardMedia
                      src={item.image.src}
                      alt={item.image.alt}
                      ratio="aspect-[16/9]"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                    <time
                      dateTime={item.publishedAt}
                      className="mt-5 block text-xs font-semibold text-ink/70"
                    >
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </time>
                    <CardTitle className="mt-2 text-lg">{item.title}</CardTitle>
                  </CardLink>
                ) : (
                  <CardLink href={`/news/${item.slug}`} className="block border-t border-navy-ink/15 pt-5">
                    <time
                      dateTime={item.publishedAt}
                      className="block text-xs font-semibold text-ink/70"
                    >
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </time>
                    <CardTitle className="mt-2 text-lg">{item.title}</CardTitle>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">
                      {item.excerpt}
                    </p>
                  </CardLink>
                )}
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-14 max-w-2xl">
            <p className="text-lg font-medium leading-relaxed text-navy-ink">
              {t.newsPage.empty}
            </p>
            <div className="mt-8">
              <ArrowLink href="/projects">
                {t.newsPage.emptyCta}
              </ArrowLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}