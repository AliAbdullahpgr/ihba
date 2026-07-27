"use client";

import Link from "next/link";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink } from "@/app/components/primitives";
import { PrinciplesTabs } from "@/app/components/PrinciplesTabs";
import {
  DataList,
  NumberedList,
  PageHeader,
  PageSection,
  Prose,
} from "@/app/components/PageShell";

export function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.aboutPage.title} lede={t.aboutPage.lede} />

      {/* Two banks: the narrative on the left, the arch-masked image opposite. */}
      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Prose paragraphs={t.aboutPage.intro} />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <img
              src={t.media.hero.url}
              alt="Community volunteers crossing a bridge with notebooks and essential supplies"
              className="arch aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission and vision, spanned by one deck line. */}
      <PageSection tone="warm">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {[
            { label: t.about.missionLabel, text: t.about.missionText },
            { label: t.about.visionLabel, text: t.about.visionText },
          ].map((block) => (
            <div key={block.label}>
              <p className="eyebrow text-gold-deep">{block.label}</p>
              <p className="mt-4 text-base leading-relaxed text-ink/75">
                {block.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-navy-ink/15">
          <p className="eyebrow pt-8 text-ink/50">{t.about.valuesLabel}</p>
          <div className="mt-4">
            <NumberedList items={t.about.values} />
          </div>
        </div>
      </PageSection>

      {/* Approach, who we serve, where we work. */}
      <PageSection>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          {[
            { label: t.aboutPage.approachLabel, text: t.aboutPage.approachText },
            { label: t.aboutPage.serveLabel, text: t.aboutPage.serveText },
            {
              label: t.aboutPage.geographyLabel,
              text: t.aboutPage.geographyText,
            },
          ].map((block) => (
            <Reveal key={block.label}>
              <p className="eyebrow border-t border-navy-ink/15 pt-5 text-gold-deep">
                {block.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {block.text}
              </p>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* The standards behind the work, one topic at a time. */}
      <PageSection
        id="principles"
        title={t.aboutPage.principlesTitle}
        tone="warm"
      >
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-ink/70">
          {t.aboutPage.principlesLede}
        </p>
        <PrinciplesTabs
          panels={t.aboutPage.panels}
          navLabel={t.aboutPage.principlesNavLabel}
        />
      </PageSection>

      {/* Registry data — the association's official record. */}
      <PageSection title={t.identity.title}>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-ink/70">
          {t.identity.lede}
        </p>
        <DataList rows={t.identity.rows} />
      </PageSection>

      <PageSection>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.nav.president}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
              {t.presidentPage.lede}
            </p>
            <ArrowLink href="/president" className="mt-5">
              {t.presidentPage.title}
            </ArrowLink>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.boardPage.title}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
              {t.boardPage.lede}
            </p>
            <ArrowLink href="/board" className="mt-5">
              {t.boardPage.title}
            </ArrowLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
