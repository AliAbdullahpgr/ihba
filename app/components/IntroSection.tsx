"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink } from "@/app/components/primitives";

/**
 * The homepage intro, on the navy ground: title, lede and a second
 * paragraph, nothing else competing for attention. Titled separately from
 * the /about page ("Who we are") so the two don't read as duplicates.
 */
export function IntroSection() {
  const { t } = useI18n();

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mb-10 bg-navy py-20 text-white lg:mb-16 lg:py-28"
    >
      <div className="container-site">
        <div className="max-w-2xl">
          <h2
            id="about-title"
            className="display-xl max-w-[24ch] text-3xl text-white sm:text-4xl"
          >
            {t.about.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            {t.about.lede}
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            {t.about.ledeExtra}
          </p>
          <div className="mt-8">
            <ArrowLink href="/about" tone="white">
              {t.aboutPage.title}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
