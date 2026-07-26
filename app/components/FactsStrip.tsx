"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

export function FactsStrip() {
  const { t } = useI18n();

  return (
    <section id="impact" className="bg-paper-warm/50">
      <div className="container-site grid grid-cols-2 gap-x-8 gap-y-12 pb-24 lg:grid-cols-4 lg:pb-28">
        {t.facts.stats.map((stat) => (
          <Reveal key={stat.label}>
            <p className="font-display text-5xl font-medium tracking-[-0.03em] text-navy-ink lg:text-6xl">
              {stat.value}
            </p>
            <p className="eyebrow mt-3 text-ink/55">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
