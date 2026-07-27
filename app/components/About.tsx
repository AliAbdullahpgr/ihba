"use client";

import { useI18n } from "@/app/components/LanguageProvider";

export function About() {
  const { t } = useI18n();

  return (
    /*
      Continues the warm band opened by FocusMosaic — same ground, no top
      padding, so the two read as one region of the page instead of two
      stacked stripes.
    */
    <section id="about" aria-labelledby="about-title" className="bg-paper-warm/50 pb-20 lg:pb-28">
      <div className="container-site">
        {/*
          Smaller than the mosaic's heading above it. "Who we are?" introduces
          two short prose blocks and a list of values — it does not need to be
          set at the same weight as the section that carries the programmes.
        */}
        <h2 id="about-title" className="display-xl max-w-[24ch] text-2xl text-navy-ink sm:text-3xl">
          {t.about.title}
        </h2>

        {/* Two banks: mission and vision, spanned by a single deck line. */}
        <div className="mt-12">
          <div className="grid gap-12 border-t border-navy-ink/15 pt-10 lg:grid-cols-2 lg:gap-16">
            {[
              { label: t.about.missionLabel, text: t.about.missionText },
              { label: t.about.visionLabel, text: t.about.visionText },
            ].map((block) => (
              /*
                Real headings, at reading size. "Our Mission" and "Our Vision"
                are the titles of the paragraphs beneath them, so they belong in
                the outline rather than being paragraphs styled as capitals.
                No Reveal here either — these are two blocks of prose, not a
                list that benefits from a cascade.
              */
              <div key={block.label}>
                <h3 className="font-display text-base font-medium text-navy-ink">
                  {block.label}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values as a numbered ledger. */}
        <div className="mt-16">
          <h3 className="border-t border-navy-ink/15 pt-8 font-display text-base font-medium text-navy-ink">
            {t.about.valuesLabel}
          </h3>
          <ol className="mt-4 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {t.about.values.map((value, index) => (
              <li
                key={value}
                className="flex items-baseline gap-4 border-b border-navy-ink/12 py-3.5"
              >
                <span className="font-display text-sm font-medium text-navy-ink/75">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold text-navy-ink">
                  {value}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
