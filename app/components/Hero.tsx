"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink, Button, Mark, SpanRule } from "@/app/components/primitives";

export function Hero() {
  const { t } = useI18n();
  const { headline, feature } = t.hero;

  return (
    <section id="top" className="bg-white">
      <div className="container-site pt-14 lg:pt-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            {/*
              A standfirst, not an eyebrow. The sentence that used to open the
              headline still gets said, at reading size and in normal case — an
              uppercase tracked kicker here would put a label above the one
              piece of type on the page that should need no introduction.
            */}
            <p className="max-w-md text-base leading-snug text-navy-ink/60">
              {t.hero.standfirst}
            </p>

            {/*
              Fluid rather than three fixed steps: the old ladder topped out at
              54px and then held that size however wide the column grew.
            */}
            <h1 className="display-xl text-balance mt-5 text-[clamp(2.25rem,5.5vw,4.25rem)] text-navy-ink">
              {headline.pre}
              {/*
                The mark takes its own line. Flowing inline it began mid-
                sentence, so one box floated in the middle of a line and the
                rest resumed at the margin below — and it landed in a different
                place in each language. Given its own line, every box shares the
                left edge whatever the locale does to the wrap.
              */}
              <span className="block">
                <Mark tone="azure">{headline.highlight}</Mark>
              </span>
              {headline.post}
            </h1>

            <p className="mt-8 max-w-lg text-base leading-relaxed text-ink/70">
              {t.hero.subcopy}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/donate">{t.hero.ctaPrimary}</Button>
              <Button href="/projects" variant="outline">
                {t.hero.ctaSecondary}
              </Button>
            </div>
          </div>

          {/*
            The arch: a masked portrait with a second, empty arch stepped behind
            it. Two spans, offset — the composition is the mark.
          */}
          <div className="mt-14 lg:col-span-5 lg:mt-0">
            <div className="relative">
              {/* A second span, stepped behind the first. */}
              <div
                className="arch absolute inset-0 hidden translate-x-5 translate-y-5 bg-paper-warm lg:block"
                aria-hidden="true"
              />
              <img
                src="/images/generated/ihba-hero.webp"
                alt="Community volunteers crossing a bridge with notebooks and essential supplies"
                className="arch relative aspect-[4/5] w-full object-cover"
              />
              <span
                className="absolute -left-3 top-1/3 size-5 bg-gold"
                aria-hidden="true"
              />
            </div>

            <figcaption className="mt-5 border-t border-navy-ink/15 pt-4">
              <p className="eyebrow text-gold-deep">{feature.tag}</p>
              <p className="mt-2 font-display text-base font-medium leading-snug text-navy-ink">
                {feature.title}
              </p>
              <ArrowLink href="/about" className="mt-4">
                {feature.cta}
              </ArrowLink>
            </figcaption>
          </div>
        </div>
      </div>

      {/* The deck line closes the hero and carries the register marks. */}
      <div className="container-site mt-16">
        <SpanRule />
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-5 pb-14 text-sm font-semibold text-navy-ink/75">
          {t.hero.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
