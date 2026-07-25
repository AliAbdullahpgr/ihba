"use client";

import { Quote } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

export function PresidentQuote() {
  const { t } = useI18n();

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-site">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto size-12 text-gold" aria-hidden="true" />
          <blockquote className="text-balance mt-6 font-display font-semibold text-2xl leading-snug text-navy-ink sm:text-3xl">
            “{t.presidentQuote.quote}”
          </blockquote>
          <p className="mt-6 text-sm font-bold text-navy-ink">{t.presidentQuote.name}</p>
          <p className="text-sm text-ink/60">{t.presidentQuote.role}</p>
        </Reveal>
      </div>
    </section>
  );
}
