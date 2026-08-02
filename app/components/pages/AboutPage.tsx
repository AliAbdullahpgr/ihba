"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink } from "@/app/components/primitives";
import { BridgeModel } from "@/app/components/BridgeModel";
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

      {/* Two banks: the narrative on the left, the photograph opposite. */}
      <section
        aria-labelledby="about-intro-title"
        className="bg-white pb-16 lg:pb-20"
      >
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            {/* Visually hidden: the section carries no visible heading of its
                own, so it borrows the page title to stay addressable. */}
            <h2 id="about-intro-title" className="sr-only">
              {t.aboutPage.title}
            </h2>
            <Prose paragraphs={t.aboutPage.intro} />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            {/* Square, the crop every image on the site now shares — the arch
                mask and the taller 4/5 ratio both belonged to the old system. */}
            <div className="relative aspect-square w-full">
              <Image
                src={t.media.hero.url}
                alt="Community volunteers crossing a bridge with notebooks and essential supplies"
                fill
                sizes="(min-width: 1024px) 360px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/*
        "How we work", drawn as a bridge — the navy band that used to close the
        homepage. It names the organisation, so it carries the device at full
        strength; relocated here so the homepage stays lean and the About page
        carries the institutional story in full.
      */}
      <BridgeModel />

      {/* Mission and vision, spanned by one deck line. The section's only
          warm band on the page — it does not alternate with white further
          down, so the ground never reads as busier than it is. */}
      <PageSection tone="warm">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {[
            { label: t.about.missionLabel, text: t.about.missionText },
            { label: t.about.visionLabel, text: t.about.visionText },
          ].map((block) => (
            <div key={block.label}>
              {/* A real heading, not a tracked-capital kicker: "Our Mission"
                  titles the paragraph beneath it. */}
              <h3 className="font-display text-base font-medium text-navy-ink">
                {block.label}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                {block.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h3 className="border-t border-navy-ink/15 pt-8 font-display text-base font-medium text-navy-ink">
            {t.about.valuesLabel}
          </h3>
          <div className="mt-4">
            <NumberedList items={t.about.values} />
          </div>
        </div>
      </PageSection>

      {/* Approach, who we serve, where we work — a three-item cascade. */}
      <PageSection>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          {[
            { label: t.aboutPage.approachLabel, text: t.aboutPage.approachText },
            { label: t.aboutPage.serveLabel, text: t.aboutPage.serveText },
            {
              label: t.aboutPage.geographyLabel,
              text: t.aboutPage.geographyText,
            },
          ].map((block, index) => (
            <Reveal key={block.label} delay={index * 90}>
              <h3 className="border-t border-navy-ink/15 pt-5 font-display text-base font-medium text-navy-ink">
                {block.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {block.text}
              </p>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* The standards behind the work, one topic at a time. */}
      <PageSection id="principles" title={t.aboutPage.principlesTitle}>
        <PrinciplesTabs
          panels={t.aboutPage.panels}
          navLabel={t.aboutPage.principlesNavLabel}
        />
      </PageSection>

      {/* Registry data — the association's official record. */}
      <PageSection title={t.identity.title}>
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
