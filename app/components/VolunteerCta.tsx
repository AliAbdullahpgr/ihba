"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Button, Mark } from "@/app/components/primitives";

export function VolunteerCta() {
  const { t } = useI18n();
  const { title } = t.volunteer;

  return (
    <section id="donate" className="bg-paper-warm/50">
      {/*
        `items-stretch`, not `items-end`: bottom-aligning a ~320px text block
        against a 4:5 image left the heading floating well below the section's
        top edge. The text now sets the row height and the image fills it.
      */}
      <div className="container-site grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <div className="lg:col-span-7">
          <h2 className="display-xl text-4xl text-navy-ink sm:text-5xl">
            {title.pre}
            <Mark tone="gold">{title.highlight}</Mark>
            {title.post}
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-ink/70">
            {t.volunteer.copy}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/donate">{t.volunteer.ctaPrimary}</Button>
            <Button href="/volunteer" variant="outline">
              {t.volunteer.ctaSecondary}
            </Button>
          </div>
          <p className="mt-10 max-w-lg border-t border-navy-ink/15 pt-5 text-sm text-ink/55">
            {t.volunteer.note}
          </p>
        </div>

        {/* Arch-masked, matching the hero — the device bookends the page. */}
        <div className="lg:col-span-4 lg:col-start-9 lg:h-full">
          <img
            src="/images/generated/volunteer-team.webp"
            alt="A diverse volunteer team assembling school and essential-supply kits"
            className="arch aspect-[4/5] w-full object-cover lg:aspect-auto lg:h-full lg:min-h-[22rem]"
          />
        </div>
      </div>
    </section>
  );
}
