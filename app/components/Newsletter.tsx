"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";

export function Newsletter() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="border-t border-line bg-white py-16 lg:py-24">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-display font-bold text-3xl text-navy-ink">
            {t.newsletter.title}
          </p>
          <p className="mt-2 text-ink/65">{t.newsletter.copy}</p>
        </div>

        <div>
          {submitted ? (
            <p className="text-sm font-semibold text-azure-deep">{t.newsletter.success}</p>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              className="flex items-center gap-0 rounded-xl border border-line pl-5 pr-1.5 py-1.5 transition-colors focus-within:border-gold"
            >
              <input
                type="email"
                required
                aria-label={t.newsletter.placeholder}
                placeholder={t.newsletter.placeholder}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink/40"
              />
              <button
                type="submit"
                aria-label={t.newsletter.subscribeLabel}
                className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold text-white transition-colors hover:bg-gold-deep"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
