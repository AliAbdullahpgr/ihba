"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/LanguageProvider";

/**
 * The president's message, standing on its own.
 *
 * It used to close the warm band as a bare pull-quote continuing on from "Who
 * we are?", with the portrait tucked in beside the name at byline size. On its
 * own white ground with the portrait given a full column, it reads as a section
 * a visitor arrives at rather than as the tail of the one above it.
 */
export function PresidentQuote() {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="president-title"
      className="bg-white pt-20 pb-8 lg:pt-28 lg:pb-10"
    >
      <div className="container-site">
        {/* The section had no heading at all, so it was an unnamed region
            between two named ones. The quote carries it visually. */}
        <h2 id="president-title" className="sr-only">
          {t.presidentPage.title}
        </h2>
        {/*
          Portrait left, message right. The image is square like everything else
          on this page and sits at the top of its column, so its upper edge
          lines up with the first line of the quote — the two columns start
          together instead of one floating against the other.

          No entrance animation. Every section on this page used to fade and
          rise identically, which is the tell; a cascade across a list of items
          is motion that describes the content, a single block sliding up is
          motion applied because the section exists.
        */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            {/*
              Empty alt: the name and role sit in text directly beside this, so
              describing the portrait as "Abdullah Serenli" made a screen reader
              announce the same name twice in a row.
            */}
            <div className="relative aspect-square w-full max-w-sm">
              <Image
                src={t.media.presidentPortrait.url}
                alt=""
                fill
                sizes="(min-width: 1024px) 384px, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <blockquote className="display-xl text-balance text-xl text-navy-ink sm:text-2xl lg:text-[1.75rem]">
              “{t.presidentQuote.quote}”
            </blockquote>

            {/* Attribution on a hairline, the way a signature sits under a
                letter rather than beside it. */}
            <div className="mt-8 border-t border-navy-ink/15 pt-5">
              <p className="text-sm font-bold text-navy-ink">
                {t.presidentQuote.name}
              </p>
              <p className="mt-1 text-sm text-ink/70">
                {t.presidentQuote.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
