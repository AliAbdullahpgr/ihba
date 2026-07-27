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
        {/*
          One block, not two columns. Dropping the social sentence left a
          heading-plus-form facing a bare row of icons — two halves of a split
          layout with nothing in common, which is what read as inconsistent.
          The icons now sit under the form as a footnote to it, and the section
          has a single heading and a single measure.
        */}
        <div className="max-w-xl border-t border-navy-ink/15 pt-14">
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

            <SocialRow className="mt-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
