"use client";

import { ArrowRight, CalendarCheck, Globe2, Heart, MapPin } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";

const chipIcons = [CalendarCheck, MapPin, Globe2];

export function Hero() {
  const { t } = useI18n();
  const { headline } = t.hero;

  return (
    <section id="top" className="relative overflow-hidden bg-white py-16 lg:py-24">
      <div className="container-site grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-balance font-display font-bold tracking-tight text-5xl leading-[1.05] text-navy-ink sm:text-6xl">
            {headline.pre}
            <span className="bg-gold-soft px-2 rounded-md box-decoration-clone">
              {headline.highlight}
            </span>
            {headline.post}
          </h1>

          <p className="mt-6 max-w-lg text-lg text-ink/70">{t.hero.subcopy}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#programs"
              className="inline-flex items-center gap-2 rounded-xl border border-navy/20 px-7 py-3.5 text-sm font-bold text-navy transition-colors hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              {t.hero.ctaSecondary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {t.hero.chips.map((chip, index) => {
              const Icon = chipIcons[index];
              return (
                <span
                  key={chip}
                  className="flex items-center gap-2 text-sm font-semibold text-navy/80"
                >
                  <Icon className="size-4 text-azure-deep" aria-hidden="true" />
                  {chip}
                </span>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <img
            src="/images/generated/ihba-hero.webp"
            alt="Community volunteers crossing a bridge with notebooks and essential supplies"
            className="aspect-[4/3] w-full rounded-t-[10rem] rounded-b-2xl border border-line object-cover"
          />
          <span
            className="absolute -top-4 left-10 size-4 rounded-sm bg-gold animate-float-y"
            style={{ animationDelay: "0s" }}
            aria-hidden="true"
          />
          <span
            className="absolute top-10 -right-3 size-3 rounded-sm bg-azure animate-float-y"
            style={{ animationDelay: "0.8s" }}
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-3 left-1/4 size-3 rounded-sm bg-azure animate-float-y"
            style={{ animationDelay: "1.6s" }}
            aria-hidden="true"
          />
          <span
            className="absolute bottom-8 -left-4 size-4 rounded-sm bg-gold animate-float-y"
            style={{ animationDelay: "2.4s" }}
            aria-hidden="true"
          />
          <span
            className="absolute top-1/3 -right-4 size-3 rounded-sm bg-gold animate-float-y"
            style={{ animationDelay: "3.2s" }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
