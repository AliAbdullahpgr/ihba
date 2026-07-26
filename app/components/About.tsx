"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { SectionHeader } from "@/app/components/SectionHeader";

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="container-site">
        <SectionHeader
          label={t.nav.about}
          title={t.about.title}
          lede={t.about.lede}
        />

        {/* Mission and vision as two ruled columns rather than boxed cards. */}
        <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-2 lg:gap-16">
          {[
            { label: t.about.missionLabel, text: t.about.missionText },
            { label: t.about.visionLabel, text: t.about.visionText },
          ].map((block) => (
            <Reveal key={block.label}>
              <h3 className="font-display text-2xl font-medium text-navy-ink">
                {block.label}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                {block.text}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Values as a numbered ledger — a list, not chips. */}
        <Reveal className="mt-16 border-t border-line pt-12">
          <p className="eyebrow text-ink/50">{t.about.valuesLabel}</p>
          <ol className="mt-6 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {t.about.values.map((value, index) => (
              <li
                key={value}
                className="flex items-baseline gap-4 border-b border-line py-4"
              >
                <span className="font-display text-sm font-medium text-gold-deep">
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
