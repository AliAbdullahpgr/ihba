"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Disclosure } from "@/app/components/Disclosure";

/**
 * Frequently asked questions, as an expandable summary.
 *
 * Each question sits in its own row so a visitor can scan the set and open
 * only the answer they need. The first question opens by default so the
 * section is not empty on first paint. The content lives in `content.ts`
 * alongside the other deeper page copy.
 */
export function FaqAccordion() {
  const { t } = useI18n();
  const items = t.faq.items ?? [];

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="faq-title"
      className="bg-white pb-20 lg:pb-28"
    >
      <div className="container-site">
        <h2
          id="faq-title"
          className="display-xl max-w-[24ch] text-3xl text-navy-ink sm:text-4xl"
        >
          {t.faq.title}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          {t.faq.lede}
        </p>

        <div className="mt-12 border-t border-navy-ink/15">
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
      </div>
    </section>
  );
}