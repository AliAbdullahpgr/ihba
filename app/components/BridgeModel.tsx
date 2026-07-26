"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";

/**
 * The bridge model, drawn as a bridge: one deck line spanning the full measure,
 * with a pier under each step. This is the section that names the organisation,
 * so it carries the device at full strength.
 */
export function BridgeModel() {
  const { t } = useI18n();

  return (
    <section id="approach" className="bg-navy-deep py-20 text-white lg:py-28">
      <div className="container-site">
        <h2 className="display-xl max-w-[24ch] text-3xl text-white sm:text-4xl">
          {t.approach.title}
        </h2>

        {/* The deck. Piers hang from it, one per step. */}
        <div className="mt-16">
          <div
            className="span-rule text-white/35"
            aria-hidden="true"
            style={{ backgroundSize: "3rem 0.625rem" }}
          />

          <div className="grid gap-x-8 gap-y-12 pt-8 md:grid-cols-2 lg:grid-cols-4">
            {t.approach.steps.map((step, index) => (
              <Reveal key={step.title}>
                {/* Pier stem: the vertical drop from the deck to the marker. */}
                <div
                  className="mx-auto h-8 w-px bg-white/35 md:mx-0 md:ml-5"
                  aria-hidden="true"
                />
                <div className="flex flex-col items-center md:items-start">
                  <span className="arch grid h-14 w-11 place-items-end justify-center border border-white/50 pb-2">
                    <span className="font-display text-sm font-bold text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <h3 className="mt-6 text-center font-display text-lg font-medium leading-snug text-white md:text-left">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-center text-sm leading-relaxed text-white/65 md:text-left">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
