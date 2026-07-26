"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import {
  ArrowLink,
  CardLink,
  CardMedia,
  CardTitle,
  Tag,
} from "@/app/components/primitives";
import { resolveProjectImage } from "@/app/components/pages/projectImages";

const tagTones = {
  planning: "azure",
  active: "gold",
  seasonal: "navy",
} as const;

export function Projects() {
  const { t } = useI18n();

  return (
    <section id="projects" className="bg-white pb-20 lg:pb-28">
      <div className="container-site">
        <div className="max-w-2xl">
          <h2 className="display-xl text-3xl text-navy-ink sm:text-4xl">
            {t.projects.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/65">
            {t.projects.lede}
          </p>
          <ArrowLink href="/projects" className="mt-7">
            {t.projects.browseAll}
          </ArrowLink>
        </div>

        {/* Three spans, numbered like stations — each opens its project page. */}
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {t.projectsPage.details.map((project, index) => {
            const card = t.projects.cards[index];
            const image = resolveProjectImage(project);

            return (
              <Reveal key={project.slug} delay={index * 90}>
                <CardLink href={`/projects/${project.slug}`}>
                  <CardMedia
                    src={image.src}
                    alt={image.alt}
                    ratio="aspect-[4/3]"
                  />

                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-display text-sm font-bold text-navy-ink/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Tag tone={tagTones[card.badgeKey]}>{card.badge}</Tag>
                    <span className="text-xs font-semibold text-ink/50">
                      {card.region}
                    </span>
                  </div>

                  <CardTitle className="mt-4 text-lg">{card.title}</CardTitle>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {card.summary}
                  </p>
                </CardLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
