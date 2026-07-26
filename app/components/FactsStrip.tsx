"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

export function FactsStrip() {
  const { t } = useI18n();

  return (
    <section id="impact" className="bg-white pb-20 lg:pb-24">
      <div className="container-site grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
        {t.facts.stats.map((stat) => (
          <Reveal key={stat.label}>
            {/* A plain hairline per figure — structure without the pier marks. */}
            <div className="border-t border-navy-ink/15 pt-5">
              <p className="font-display text-5xl font-medium tracking-[-0.03em] text-navy-ink lg:text-6xl">
                {stat.value}
              </p>
              <p className="eyebrow mt-3 text-ink/55">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
