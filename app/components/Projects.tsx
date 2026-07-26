"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink, Tag, TagRow } from "@/app/components/primitives";

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

const tagTones = {
  planning: "azure",
  active: "gold",
  seasonal: "navy",
} as const;

export function Projects() {
  const { t } = useI18n();

  return (
    <section id="projects" className="bg-white pb-20 lg:pb-28">
      <div className="container-site border-t border-line pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Label rail: sits alongside the cards and holds the section voice. */}
          <div className="lg:col-span-3">
            <p className="eyebrow text-ink/50">{t.projects.label}</p>
            <h2 className="display-xl mt-6 text-2xl text-navy-ink sm:text-[1.75rem]">
              {t.projects.lede}
            </h2>
            <ArrowLink href="#contact" className="mt-8">
              {t.projects.browseAll}
            </ArrowLink>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-9 lg:col-start-4 lg:grid-cols-3">
            {t.projects.cards.map((card, index) => (
              <Reveal key={card.title}>
                <article className="flex h-full flex-col">
                  <div className="relative">
                    <img
                      src={images[index].src}
                      alt={images[index].alt}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span className="absolute left-0 top-0">
                      <Tag tone={tagTones[card.badgeKey]}>{card.badge}</Tag>
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-medium leading-snug text-navy-ink">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-semibold text-ink/50">
                    {card.region}
                  </p>

                  <div className="mt-4 border-y border-line py-3">
                    <TagRow items={card.chips} />
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-ink/65">
                    {card.summary}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
