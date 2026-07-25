"use client";

import { HandHeart, Heart } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";

export function VolunteerCta() {
  const { t } = useI18n();
  const { title } = t.volunteer;

  return (
    <section id="donate" className="bg-navy-deep py-16 text-white lg:py-24">
      <div className="container-site grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display font-bold text-5xl text-white sm:text-6xl">
            {title.pre}
            <span className="text-gold">{title.highlight}</span>
            {title.post}
          </h2>
          <p className="mt-6 text-lg text-white/70">{t.volunteer.copy}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              {t.volunteer.ctaPrimary}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              {t.volunteer.ctaSecondary}
            </a>
          </div>
          <p className="mt-4 text-sm text-white/50">{t.volunteer.note}</p>
        </div>

        <div className="relative">
          <img
            src="/images/generated/volunteer-team.webp"
            alt="A diverse volunteer team assembling school and essential-supply kits"
            className="w-full rounded-2xl ring-1 ring-white/10"
          />
          <span
            className="absolute -top-3 right-8 size-4 rounded-sm bg-gold animate-float-y"
            style={{ animationDelay: "0s" }}
            aria-hidden="true"
          />
          <span
            className="absolute top-1/2 -right-3 size-3 rounded-sm bg-gold animate-float-y"
            style={{ animationDelay: "1s" }}
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-3 left-10 size-3 rounded-sm bg-gold animate-float-y"
            style={{ animationDelay: "2s" }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
