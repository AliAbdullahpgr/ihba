"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink } from "@/app/components/primitives";
import { PageHeader } from "@/app/components/PageShell";

export function NewsPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.newsPage.title} lede={t.newsPage.lede} />

      {/*
        Honest empty state: the content draft has no news items yet, so the page
        says so and routes readers to the work that is documented.
      */}
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
    </>
  );
}
