"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Disclosure } from "@/app/components/Disclosure";

/**
 * Mission, vision and core values, as three expandable rows.
 *
 * The previous About section laid all three open at once — three prose blocks
 * and a seven-item list stacked under one heading. On a homepage that already
 * carries a hero, news, projects, areas and a campaign, keeping the
 * institutional section scannable means letting the visitor read the heading
 * and open only the part they want. The first row opens by default so the
 * section is not empty on first paint.
 */
export function MissionAccordion() {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="mission-title"
      className="bg-white py-20 lg:py-28"
    >
      <div className="container-site">
        <h2
          id="mission-title"
          className="display-xl max-w-[24ch] text-3xl text-navy-ink sm:text-4xl"
        >
          {t.about.title}
        </h2>

        <div className="mt-12 border-t border-navy-ink/15">
          <Disclosure
            defaultOpen
            summary={
              <span className="text-base font-semibold text-navy-ink">
                {t.about.missionLabel}
              </span>
            }
          >
            <p className="max-w-2xl text-base leading-relaxed text-ink/70">
              {t.about.missionText}
            </p>
          </Disclosure>

          <Disclosure
            summary={
              <span className="text-base font-semibold text-navy-ink">
                {t.about.visionLabel}
              </span>
            }
          >
            <p className="max-w-2xl text-base leading-relaxed text-ink/70">
              {t.about.visionText}
            </p>
          </Disclosure>

          <Disclosure
            summary={
              <span className="text-base font-semibold text-navy-ink">
                {t.about.valuesLabel}
              </span>
            }
          >
            <ol className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
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
          </Disclosure>
        </div>
      </div>
    </section>
  );
}