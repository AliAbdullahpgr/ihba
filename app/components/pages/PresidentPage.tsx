"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink } from "@/app/components/primitives";
import { PageHeader, PageSection } from "@/app/components/PageShell";

export function PresidentPage() {
  const { t } = useI18n();
  const { presidentPage } = t;
  const portrait = t.media.presidentPortrait?.url;

  return (
    <>
      <PageHeader
        title={presidentPage.title}
        eyebrow={t.nav.about}
        backHref="/about"
        backLabel={t.nav.about}
      />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Attribution rail: portrait (once uploaded) plus name and role. */}
          <aside className="lg:col-span-4">
            {portrait ? (
              <img
                src={portrait}
                alt={`${presidentPage.name}, ${presidentPage.role}`}
                className="arch aspect-[4/5] w-full object-cover"
              />
            ) : null}
            <div
              className={`border-t border-navy-ink/15 pt-4 ${portrait ? "mt-5" : ""}`}
            >
              <p className="font-display text-lg font-medium text-navy-ink">
                {presidentPage.name}
              </p>
              <p className="mt-1 text-sm text-ink/60">{presidentPage.role}</p>
            </div>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            {/* The opening line carries the display setting, then body copy. */}
            <p className="display-xl text-xl text-navy-ink sm:text-2xl">
              {presidentPage.lede}
            </p>

            <div className="mt-8 space-y-5">
              {presidentPage.message.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-ink/75"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 border-t border-navy-ink/15 pt-4">
              <p className="text-sm font-bold text-navy-ink">
                {presidentPage.name}
              </p>
              <p className="text-sm text-ink/60">{presidentPage.role}</p>
            </div>
          </div>
        </div>
      </section>

      <PageSection tone="warm">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.projectsPage.title}
            </h2>
            <ArrowLink href="/projects" className="mt-5">
              {t.common.allProjects}
            </ArrowLink>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.boardPage.title}
            </h2>
            <ArrowLink href="/board" className="mt-5">
              {t.boardPage.title}
            </ArrowLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
