"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Counter } from "@/app/components/Counter";
import { Reveal } from "@/app/components/Reveal";

/**
 * Four facts, set as a ledger.
 *
 * This was the hero-metric block: an oversized figure above a small tracked
 * capital label, four across, directly under the hero. That arrangement is the
 * most-copied section on the internet and it made the page's opening claim in
 * the most generic form available. A ledger reverses the reading order — the
 * label names the thing, the figure answers it — and takes the figures down to
 * a size that sits under the headline rather than competing with it.
 *
 * `<dl>` because that is what this is: four terms and their values. The old
 * markup was eight sibling paragraphs with no stated relationship between them.
 */
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
    <section
      id="impact"
      aria-labelledby="impact-title"
      className="bg-white pb-20 lg:pb-24"
    >
      <div className="container-site">
        <h2 id="impact-title" className="sr-only">
          {t.facts.title}
        </h2>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {t.facts.stats.map((stat, index) => (
            /*
              Staggered so the row reads left to right instead of arriving
              flat. Reveal's own element is the grouping wrapper here — a `dl`
              may contain a `div` holding one term-and-value pair, but not a
              div holding another div.
            */
            <Reveal
              key={stat.label}
              delay={index * 90}
              className="border-t border-navy-ink/15 pt-5"
            >
              <dt className="text-sm font-semibold text-ink/70">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-3xl font-medium tracking-[-0.03em] text-navy-ink lg:text-4xl">
                <Counter value={valueOf(stat)} locale={lang} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
