"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

export function PresidentQuote() {
  const { t } = useI18n();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-site">
        <Reveal className="grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8">
          <p className="eyebrow text-ink/50 lg:col-span-3">
            {t.presidentQuote.role}
          </p>

          <div className="lg:col-span-9">
            <blockquote className="display-xl text-balance text-2xl text-navy-ink sm:text-3xl lg:text-[2.25rem]">
              “{t.presidentQuote.quote}”
            </blockquote>
            {/* The role already labels the rail, so the byline carries the name. */}
            <p className="mt-8 text-sm font-bold text-navy-ink">
              {t.presidentQuote.name}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
