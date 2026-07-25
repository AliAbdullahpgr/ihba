"use client";

import { Eye, Target } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { SectionHeader } from "@/app/components/SectionHeader";

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="bg-white py-16 lg:py-24">
      <div className="container-site">
        <SectionHeader align="center" title={t.about.title} />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-2xl border border-line bg-white p-8 lg:p-10">
              <span className="grid size-11 place-items-center rounded-full bg-gold-mist text-gold-deep">
                <Target className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy-ink">
                {t.about.missionLabel}
              </h3>
              <p className="mt-3 text-ink/70 leading-relaxed">{t.about.missionText}</p>
            </article>
          </Reveal>

          <Reveal>
            <article className="h-full rounded-2xl border border-line bg-white p-8 lg:p-10">
              <span className="grid size-11 place-items-center rounded-full bg-gold-mist text-gold-deep">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-navy-ink">
                {t.about.visionLabel}
              </h3>
              <p className="mt-3 text-ink/70 leading-relaxed">{t.about.visionText}</p>
            </article>
          </Reveal>
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm font-bold text-navy-ink">{t.about.valuesLabel}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2.5">
            {t.about.values.map((value) => (
              <span
                key={value}
                className="flex items-center gap-2 text-sm font-semibold text-navy-ink"
              >
                <span className="size-1.5 rounded-full bg-azure" aria-hidden="true" />
                {value}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
