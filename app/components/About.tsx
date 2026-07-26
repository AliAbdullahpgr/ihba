"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="bg-paper-warm/50 py-20 lg:py-28">
      <div className="container-site">
        <h2 className="display-xl max-w-[24ch] text-3xl text-navy-ink sm:text-4xl">
          {t.about.title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/65">
          {t.about.lede}
        </p>

        {/* Two banks: mission and vision, spanned by a single deck line. */}
        <div className="mt-14">
          <div className="grid gap-12 border-t border-navy-ink/15 pt-10 lg:grid-cols-2 lg:gap-16">
            {[
              { label: t.about.missionLabel, text: t.about.missionText },
              { label: t.about.visionLabel, text: t.about.visionText },
            ].map((block) => (
              <Reveal key={block.label}>
                <p className="eyebrow text-gold-deep">{block.label}</p>
                <p className="mt-4 text-base leading-relaxed text-ink/70">
                  {block.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Values as a numbered ledger. */}
        <Reveal className="mt-16">
          <p className="eyebrow border-t border-navy-ink/15 pt-8 text-ink/50">
            {t.about.valuesLabel}
          </p>
          <ol className="mt-4 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {t.about.values.map((value, index) => (
              <li
                key={value}
                className="flex items-baseline gap-4 border-b border-navy-ink/12 py-3.5"
              >
                <span className="font-display text-sm font-medium text-navy-ink/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold text-navy-ink">
                  {value}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
