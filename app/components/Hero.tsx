"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink, Button, Mark, Tag } from "@/app/components/primitives";

/**
 * Accent squares scattered across the field, positioned as percentages so they
 * stay on the pattern's rhythm at any width.
 */
const accents = [
  { top: "6%", right: "14%", size: "size-6", tone: "bg-gold", delay: "0s" },
  { top: "26%", right: "38%", size: "size-6", tone: "bg-gold", delay: "0.9s" },
  { top: "24%", right: "16%", size: "size-6", tone: "bg-azure", delay: "1.8s" },
  { top: "50%", right: "5%", size: "size-5", tone: "bg-gold", delay: "2.7s" },
  { top: "66%", right: "0%", size: "size-5", tone: "bg-azure", delay: "3.6s" },
];

export function Hero() {
  const { t } = useI18n();
  const { headline, feature } = t.hero;

  return (
    <section id="top" className="relative bg-white">
      {/* Square field: bleeds off the right edge and fades in toward the copy. */}
      <div
        className="square-field pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] md:block"
        aria-hidden="true"
      >
        {accents.map((accent) => (
          <span
            key={`${accent.top}-${accent.right}`}
            className={`absolute animate-float-y ${accent.size} ${accent.tone}`}
            style={{
              top: accent.top,
              right: accent.right,
              animationDelay: accent.delay,
            }}
          />
        ))}
      </div>

      {/* Copy sits in the first four of seven tracks, clear of the field. */}
      <div className="container-site relative lg:grid lg:grid-cols-7 lg:gap-8">
        <div className="pt-14 pb-10 lg:col-span-4 lg:pt-20 lg:pb-40">
          <h1 className="display-xl text-[2.25rem] text-navy-ink sm:text-[2.75rem] lg:text-[3.25rem]">
            {headline.pre}
            <Mark tone="azure">{headline.highlight}</Mark>
            {headline.post}
          </h1>

          <p className="mt-8 max-w-lg text-base leading-relaxed text-ink/70">
            {t.hero.subcopy}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="#donate">{t.hero.ctaPrimary}</Button>
            <Button href="#programs" variant="outline">
              {t.hero.ctaSecondary}
            </Button>
          </div>

          <ul className="mt-8 max-w-lg flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 text-sm font-semibold text-navy-ink/75">
            {t.hero.chips.map((chip, index) => (
              <li key={chip} className="flex items-center gap-4">
                {index > 0 && (
                  <span className="h-3 w-px bg-navy-ink/20" aria-hidden="true" />
                )}
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*
        The feature card occupies tracks 5-7 and straddles the boundary into the
        mosaic band below, exactly like QF's video card. On mobile it stacks.
      */}
      <div className="container-site relative lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-1/2">
        <div className="pb-14 lg:grid lg:grid-cols-7 lg:gap-8 lg:pb-0">
          <article className="flex flex-col bg-white lg:col-span-3 lg:col-start-5 lg:border lg:border-line">
            <div className="relative">
              <img
                src="/images/generated/ihba-hero.webp"
                alt="Community volunteers crossing a bridge with notebooks and essential supplies"
                className="aspect-[16/9] w-full object-cover"
              />
              <span className="absolute left-0 top-0">
                <Tag tone="gold">{feature.tag}</Tag>
              </span>
            </div>
            <div className="pt-5 lg:p-6">
              <h2 className="font-display text-lg font-medium leading-snug text-navy-ink">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {feature.copy}
              </p>
              <ArrowLink href="#projects" className="mt-5">
                {feature.cta}
              </ArrowLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
