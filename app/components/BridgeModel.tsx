"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { SectionHeader } from "@/app/components/SectionHeader";

export function BridgeModel() {
  const { t } = useI18n();

  return (
    <section id="approach" className="bg-paper-warm py-16 lg:py-24">
      <div className="container-site">
        <SectionHeader align="left" title={t.approach.title} />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {t.approach.steps.map((step, index) => (
            <Reveal key={step.title}>
              <div className="border-t-2 border-gold/50 pt-6">
                <p className="font-display font-bold text-4xl text-gold/60">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold text-navy-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink/65">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
