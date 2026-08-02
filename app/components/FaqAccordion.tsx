"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Disclosure } from "@/app/components/Disclosure";
import { PageSection } from "@/app/components/PageShell";

/**
 * Frequently asked questions, as an expandable summary.
 *
 * Each question sits in its own row so a visitor can scan the set and open
 * only the answer they need. The first question opens by default so the
 * section is not empty on first paint. The content lives in `content.ts`
 * alongside the other deeper page copy.
 *
 * Lives on the About page rather than the homepage: the questions are about
 * the organisation, so they belong with the institutional story, and the
 * homepage no longer has to carry them. Wrapped in `PageSection` so the
 * heading scale, rule and vertical rhythm match the sections either side —
 * the old markup was set to homepage scale and had no top padding, both of
 * which read as a seam on a subpage.
 */
export function FaqAccordion() {
  const { t } = useI18n();
  const items = t.faq.items ?? [];

  if (items.length === 0) return null;

  return (
    <PageSection title={t.faq.title}>
      {/* Sits above the rows rather than under the heading rule, so the rule
          stays attached to the title the way it is elsewhere on the page. */}
      <p className="-mt-2 max-w-2xl text-base leading-relaxed text-ink/70">
        {t.faq.lede}
      </p>

      <div className="mt-10 border-t border-navy-ink/15">
        {items.map((item, index) => (
          <Disclosure
            key={item.question}
            defaultOpen={index === 0}
            summary={
              <span className="text-base font-semibold text-navy-ink">
                {item.question}
              </span>
            }
          >
            <div className="max-w-2xl space-y-4">
              {item.answer.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-ink/70"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Disclosure>
        ))}
      </div>
    </PageSection>
  );
}