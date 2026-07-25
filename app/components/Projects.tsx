"use client";

import { MapPin } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { SectionHeader } from "@/app/components/SectionHeader";

const images = [
  {
    src: "/images/generated/project-education-centre.webp",
    alt: "Teacher guiding girls and boys as they study together in a classroom",
  },
  {
    src: "/images/generated/project-student-support.webp",
    alt: "University students reviewing applications together on campus",
  },
  {
    src: "/images/generated/project-ramadan-programme.webp",
    alt: "Community volunteers preparing food and shared meals together",
  },
];

const badgeClasses: Record<string, string> = {
  planning: "bg-azure-soft/60 text-navy",
  active: "bg-gold-soft text-navy-ink",
  seasonal: "bg-navy text-white",
};

export function Projects() {
  const { t } = useI18n();

  return (
    <section id="projects" className="bg-white py-16 lg:py-24">
      <div className="container-site">
        <SectionHeader align="center" title={t.projects.title} />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {t.projects.cards.map((card, index) => (
            <Reveal key={card.title}>
              <article className="h-full overflow-hidden rounded-2xl border border-line bg-white transition-all hover:border-azure/60 hover:-translate-y-0.5">
                <div className="rounded-t-[9rem] rounded-b-none overflow-hidden bg-paper-warm">
                  <img
                    src={images[index].src}
                    alt={images[index].alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${badgeClasses[card.badgeKey]}`}
                    >
                      {card.badge}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink/50">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {card.region}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-navy-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/65">{card.summary}</p>
                  <p className="mt-4 text-xs font-semibold text-ink/55">
                    {card.chips.join(" · ")}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
