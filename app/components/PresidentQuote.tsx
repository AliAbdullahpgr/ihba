"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

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
    <section className="bg-white py-20 lg:py-28">
      <div className="container-site">
        <Reveal>
          {/*
            Portrait left, message right. The image is square like everything
            else on this page and sits at the top of its column, so its upper
            edge lines up with the first line of the quote — the two columns
            start together instead of one floating against the other.
          */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <img
                src={t.media.presidentPortrait.url}
                alt={t.presidentQuote.name}
                className="aspect-square w-full max-w-sm object-cover object-top"
              />
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
                <p className="mt-1 text-sm text-ink/60">
                  {t.presidentQuote.role}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
