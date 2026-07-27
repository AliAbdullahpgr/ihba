"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/LanguageProvider";
import { Button, Mark } from "@/app/components/primitives";

export function VolunteerCta() {
  const { t } = useI18n();
  const { title } = t.volunteer;

  return (
    /* Back to white — the band ended at the president's quote. */
    <section id="donate" aria-labelledby="donate-title" className="bg-white">
      {/*
        `items-stretch`, not `items-end`: bottom-aligning a ~320px text block
        against a 4:5 image left the heading floating well below the section's
        top edge. The text now sets the row height and the image fills it.
      */}
      <div className="container-site grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <div className="lg:col-span-7">
          <h2 id="donate-title" className="display-xl text-4xl text-navy-ink sm:text-5xl">
            {title.pre}
            {/* Azure, matching the hero and the mosaic — the highlight is one
                colour throughout, not one per section. */}
            <Mark tone="azure">{title.highlight}</Mark>
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
        </div>

        {/* Square, matching the hero — the shape bookends the page. */}
        <div className="relative aspect-square lg:col-span-4 lg:col-start-9">
          <Image
            src={t.media.fieldTeamPakistan.url}
            alt="IHBA volunteers and local partners together in Pakistan"
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
