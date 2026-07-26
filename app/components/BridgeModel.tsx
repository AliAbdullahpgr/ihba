"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { SectionHeader } from "@/app/components/SectionHeader";

export function BridgeModel() {
  const { t } = useI18n();

  return (
    <section id="approach" className="bg-paper-warm/50 py-20 lg:py-28">
      <div className="container-site">
        <SectionHeader label={t.nav.approach} title={t.approach.title} />

        {/* Ruled numbered columns — the rule above each step is the divider. */}
        <div className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {t.approach.steps.map((step, index) => (
            <Reveal key={step.title}>
              <div className="border-t-2 border-navy-ink pt-5">
                <p className="font-display text-sm font-bold text-gold-deep">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-lg font-medium leading-snug text-navy-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
