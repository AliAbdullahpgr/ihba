"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Button, Mark } from "@/app/components/primitives";

/**
 * Headline, one paragraph, two actions, one image.
 *
 * It previously stacked six blocks before a visitor reached the fold — a
 * standfirst above the headline, the headline, subcopy, two buttons, a
 * bordered feature note carrying its own tag and third link, and a register
 * strip over a deck rule. Six things asking to be read first means nothing is
 * first. The headline is the one piece of type on this page that needs no
 * introduction and no companion.
 */
export function Hero() {
  const { t } = useI18n();
  const { headline } = t.hero;

  return (
    <section id="top" className="bg-white">
      <div className="container-site pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-7">
            {/*
              Fluid rather than three fixed steps: the old ladder topped out at
              54px and then held that size however wide the column grew.
            */}
            <h1 className="display-xl text-balance text-[clamp(1.875rem,4vw,3rem)] text-navy-ink">
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
            A true square, with a second square stepped behind it. The arch mask
            is gone here — an arch is not a square, and the curve was the one
            thing keeping this image from sitting flush with the grid the rest
            of the page is built on. The arch survives on the inner pages.
          */}
          <div className="mt-14 lg:col-span-5 lg:mt-0">
            <div className="relative">
              <div
                className="absolute inset-0 hidden translate-x-5 translate-y-5 bg-paper-warm lg:block"
                aria-hidden="true"
              />
              <img
                src={t.media.hero.url}
                alt="Community volunteers crossing a bridge with notebooks and essential supplies"
                className="relative aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
