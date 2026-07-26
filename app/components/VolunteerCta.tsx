"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Button, Mark } from "@/app/components/primitives";

export function VolunteerCta() {
  const { t } = useI18n();
  const { title } = t.volunteer;

  return (
    <section id="donate" className="bg-navy-deep text-white">
      <div className="container-site grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-28">
        <div className="lg:col-span-6">
          <h2 className="display-xl text-4xl text-white sm:text-5xl">
            {title.pre}
            <Mark tone="gold">{title.highlight}</Mark>
            {title.post}
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-white/70">
            {t.volunteer.copy}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center bg-gold px-6 py-3 text-sm font-bold text-navy-ink transition-colors hover:bg-gold-deep hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {t.volunteer.ctaPrimary}
            </a>
            <Button href="#contact" variant="onDark">
              {t.volunteer.ctaSecondary}
            </Button>
          </div>
          <p className="mt-6 border-t border-white/15 pt-5 text-sm text-white/50">
            {t.volunteer.note}
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <img
            src="/images/generated/volunteer-team.webp"
            alt="A diverse volunteer team assembling school and essential-supply kits"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
