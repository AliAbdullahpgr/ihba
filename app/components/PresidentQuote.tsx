"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink } from "@/app/components/primitives";

export function PresidentQuote() {
  const { t } = useI18n();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-site">
        <Reveal>
          <blockquote className="display-xl text-balance max-w-4xl border-t border-navy-ink/15 pt-12 text-2xl text-navy-ink sm:text-3xl lg:text-[2.375rem]">
            “{t.presidentQuote.quote}”
          </blockquote>
          <p className="mt-8 text-sm font-bold text-navy-ink">
            {t.presidentQuote.name}
          </p>
          <p className="mt-1 text-sm text-ink/60">{t.presidentQuote.role}</p>
          <ArrowLink href="/president" className="mt-7">
            {t.presidentPage.title}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
