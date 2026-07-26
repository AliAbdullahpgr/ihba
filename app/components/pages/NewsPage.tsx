"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import {
  ArrowDisc,
  ArrowLink,
  CardLink,
  CardMedia,
  CardTitle,
} from "@/app/components/primitives";
import { PageHeader } from "@/app/components/PageShell";

export function NewsPage() {
  const { t } = useI18n();
  const items = t.newsPage.items ?? [];

  return (
    <>
      <PageHeader title={t.newsPage.title} lede={t.newsPage.lede} />

      {items.length > 0 ? (
        <section className="bg-white pb-20 lg:pb-28">
          <div className="container-site">
            {items.map((item) => (
              <CardLink
                key={item.slug}
                href={`/news/${item.slug}`}
                className="grid gap-8 border-b border-navy-ink/12 py-10 md:grid-cols-12"
              >
                {item.image && (
                  <div className="md:col-span-4">
                    <CardMedia
                      src={item.image.src}
                      alt={item.image.alt}
                      ratio="aspect-[16/9]"
                    />
                  </div>
                )}
                <div className={item.image ? "md:col-span-7 md:col-start-6" : "md:col-span-8"}>
                  <time className="text-xs font-semibold text-ink/45">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </time>
                  <CardTitle className="mt-3 text-2xl">{item.title}</CardTitle>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/70">
                    {item.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-navy-ink">
                    <ArrowDisc />
                    {t.common.next}
                  </span>
                </div>
              </CardLink>
            ))}
          </div>
        </section>
      ) : (
      <section className="bg-white pb-20 lg:pb-28">
        <div className="container-site">
          <div className="max-w-2xl">
            <p className="display-xl text-xl text-navy-ink sm:text-2xl">
              {t.newsPage.empty}
            </p>
            <ArrowLink href="/projects" className="mt-8">
              {t.newsPage.emptyCta}
            </ArrowLink>
          </div>

          {/* An empty ledger, ruled — the shape the first entries will take. */}
          <div className="mt-16 border-t border-navy-ink/15" aria-hidden="true">
            <div className="grid gap-8 pt-10 md:grid-cols-3">
              {[0, 1, 2].map((slot) => (
                <div key={slot} className="border-t border-navy-ink/12 pt-5">
                  <div className="h-2 w-16 bg-navy-ink/8" />
                  <div className="mt-4 h-2 w-full bg-navy-ink/8" />
                  <div className="mt-2 h-2 w-4/5 bg-navy-ink/8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
