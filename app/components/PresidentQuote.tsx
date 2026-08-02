"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink } from "@/app/components/primitives";

/**
 * The president's message, standing on its own.
 *
 * Portrait left, message right, same as before — but attribution and the
 * link to the full message on /president now stack: name and role on their
 * own line, then "Message from the President" underneath as its own row,
 * rather than crowded onto one line together.
 */
export function PresidentQuote() {
  const { t } = useI18n();
  const hasPhoto = t.presidentPage.photoEnabled && t.media.presidentPortrait.url;

  return (
    <section
      aria-labelledby="president-title"
      className="bg-white py-20 lg:py-28"
    >
      <div className="container-site">
        {/* The section had no heading at all, so it was an unnamed region
            between two named ones. The quote carries it visually. */}
        <h2 id="president-title" className="sr-only">
          {t.presidentPage.title}
        </h2>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {hasPhoto ? (
            <div className="lg:col-span-4">
              <div className="relative aspect-square w-full max-w-sm">
                <Image
                  src={t.media.presidentPortrait.url}
                  alt={t.presidentPage.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 384px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          ) : null}

          <div className={hasPhoto ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-8"}>
            <blockquote className="display-xl text-balance text-xl text-navy-ink sm:text-2xl lg:text-[1.75rem]">
              “{t.presidentPage.lede}”
            </blockquote>

            <div className="mt-8 border-t border-navy-ink/15 pt-5">
              <p className="text-sm font-bold text-navy-ink">
                {t.presidentPage.name}
              </p>
              <p className="mt-1 text-sm text-ink/70">
                {t.presidentPage.role}
              </p>
              <div className="mt-6">
                <ArrowLink href="/president">{t.presidentPage.title}</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
