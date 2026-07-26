"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowDisc } from "@/app/components/primitives";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/app/components/SocialIcons";

const socials = [
  { key: "twitter", Icon: X },
  { key: "facebook", Icon: FacebookIcon },
  { key: "linkedin", Icon: LinkedinIcon },
  { key: "instagram", Icon: InstagramIcon },
  { key: "youtube", Icon: YoutubeIcon },
] as const;

export function Newsletter() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-white pb-20 lg:pb-28">
      <div className="container-site">
        <div className="grid gap-12 border-t border-navy-ink pt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="display-xl text-xl text-navy-ink sm:text-2xl">
              {t.newsletter.socialTitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {socials.map(({ key, Icon }) => (
                <a
                  key={key}
                  href="#"
                  aria-label={t.social[key]}
                  className="grid size-10 place-items-center border border-navy-ink/25 text-navy-ink transition-colors hover:border-navy-ink hover:bg-navy-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
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
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                }}
                className="mt-8 flex items-center gap-4 border-b border-navy-ink/30 pb-2 transition-colors focus-within:border-navy-ink"
              >
                <input
                  type="email"
                  required
                  aria-label={t.newsletter.placeholder}
                  placeholder={t.newsletter.placeholder}
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-navy-ink outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  aria-label={t.newsletter.subscribeLabel}
                  className="group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
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
