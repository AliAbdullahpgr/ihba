"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

export function FactsStrip() {
  const { t } = useI18n();

  return (
    <section id="impact" className="bg-paper-warm py-16">
      <div className="container-site grid grid-cols-2 gap-8 lg:grid-cols-4">
        {t.facts.stats.map((stat) => (
          <Reveal key={stat.label} className="text-center lg:text-left">
            <p className="font-display font-bold text-6xl text-navy lg:text-7xl">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-ink/55">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
