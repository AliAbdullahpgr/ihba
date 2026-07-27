"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Counter } from "@/app/components/Counter";
import { Reveal } from "@/app/components/Reveal";

export function FactsStrip() {
  const { lang, t } = useI18n();

  /*
    Counted, not typed. "Areas of work" and "Ongoing programmes" are the two
    figures the page can check for itself — they are the lengths of the two
    lists rendered further down — so they read off those lists instead of
    sitting in the translations as strings that drift the moment someone adds a
    programme in one language. Everything else falls back to its literal.
  */
  const counts = {
    areas: t.programs.cards.length,
    projects: t.projects.cards.length,
  } as const;

  const valueOf = (stat: (typeof t.facts.stats)[number]) =>
    stat.derive ? String(counts[stat.derive]) : stat.value;

  return (
    <section id="impact" className="bg-white pb-20 lg:pb-24">
      <div className="container-site grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
        {t.facts.stats.map((stat, index) => (
          // Staggered so the row reads left to right instead of arriving flat.
          <Reveal key={stat.label} delay={index * 90}>
            {/* A plain hairline per figure — structure without the pier marks. */}
            <div className="border-t border-navy-ink/15 pt-5">
              <p className="font-display text-5xl font-medium tracking-[-0.03em] text-navy-ink lg:text-6xl">
                <Counter value={valueOf(stat)} locale={lang} />
              </p>
              <p className="eyebrow mt-3 text-ink/55">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
