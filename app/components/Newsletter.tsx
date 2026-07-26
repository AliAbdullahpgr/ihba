"use client";

import { useState } from "react";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowDisc } from "@/app/components/primitives";
import { SocialRow } from "@/app/components/SocialRow";

export function Newsletter() {
  const { t, lang } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="container-site">
        <div className="grid gap-12 border-t border-navy-ink/15 pt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="display-xl text-xl text-navy-ink sm:text-2xl">
              {t.newsletter.socialTitle}
            </p>
            <SocialRow className="mt-8" />
          </div>

          <div>
            <p className="display-xl text-xl text-navy-ink sm:text-2xl">
              {t.newsletter.title}
            </p>

            {submitted ? (
              <p className="mt-8 border-b border-azure-deep pb-3 text-sm font-semibold text-azure-deep">
                {t.newsletter.success}
              </p>
            ) : (
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const response = await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                      email: form.get("email"),
                      locale: lang,
                    }),
                  });
                  if (response.ok) setSubmitted(true);
                }}
                className="mt-8 flex items-center gap-4 border-b border-navy-ink/30 pb-2 transition-colors focus-within:border-navy-ink"
              >
                <input
                  type="email"
                  name="email"
                  required
                  aria-label={t.newsletter.placeholder}
                  placeholder={t.newsletter.placeholder}
                  className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-sm text-navy-ink outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  aria-label={t.newsletter.subscribeLabel}
                  className="group grid min-h-11 min-w-11 shrink-0 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                >
                  <ArrowDisc />
                </button>
              </form>
            )}

            <p className="mt-4 text-sm text-ink/55">{t.newsletter.copy}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
