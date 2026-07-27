"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink } from "@/app/components/primitives";
import { PageHeader, PageSection } from "@/app/components/PageShell";

export function BoardPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader
        title={t.boardPage.title}
        lede={t.boardPage.lede}
        eyebrow={t.nav.about}
        backHref="/about"
        backLabel={t.nav.about}
      />

      <section
        aria-labelledby="board-list-title"
        className="bg-white pb-16 lg:pb-20"
      >
        <div className="container-site">
          {/* Visually hidden: the ledger below carries the section, so it had
              no heading of its own to point aria-labelledby at. */}
          <h2 id="board-list-title" className="sr-only">
            {t.boardPage.title}
          </h2>

          {/* Column labels in sentence case — the tracked-capital kicker was
              appearing as wallpaper across every page of the site. */}
          <div className="hidden grid-cols-12 gap-8 pb-3 sm:grid">
            <p className="col-span-5 text-sm font-semibold text-ink/70">
              {t.boardPage.nameHeader}
            </p>
            <p className="col-span-7 text-sm font-semibold text-ink/70">
              {t.boardPage.roleHeader}
            </p>
          </div>
          <div className="border-t border-navy-ink/40" />

          <ul>
            {t.boardPage.members.map((member, index) => (
              <Reveal key={member.name} delay={index * 70}>
                <li className="grid grid-cols-12 items-baseline gap-x-8 gap-y-1 border-b border-navy-ink/12 py-5">
                  <span className="col-span-12 font-display text-sm font-medium text-navy-ink/70 sm:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-12 font-display text-lg font-medium text-navy-ink sm:col-span-4">
                    {member.name}
                  </span>
                  <span className="col-span-12 text-sm text-ink/70 sm:col-span-7">
                    {member.role}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <PageSection tone="warm">
        <h2 className="font-display text-xl font-medium text-navy-ink">
          {t.presidentPage.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
          {t.presidentPage.lede}
        </p>
        <ArrowLink href="/president" className="mt-5">
          {t.presidentPage.title}
        </ArrowLink>
      </PageSection>
    </>
  );
}
