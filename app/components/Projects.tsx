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
    <section id="projects" aria-labelledby="projects-title" className="bg-white pb-20 lg:pb-28">
      <div className="container-site">
        {/*
          Heading left, "browse all" hard right on the same line, and no
          standfirst between them. Every section used to open with title + lede
          + link before any content arrived; three of those down a page is three
          paragraphs a visitor reads before seeing the work. `items-end` sits
          the link on the heading's baseline.
        */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 id="projects-title" className="display-xl max-w-2xl text-3xl text-navy-ink sm:text-4xl">
            {t.projects.title}
          </h2>
          <ArrowLink href="/projects">{t.projects.browseAll}</ArrowLink>
        </div>

        {/* Three spans — each opens its project page. */}
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {t.projectsPage.details.map((project, index) => {
            const card = t.projects.cards[index];
            const image = resolveProjectImage(project);

            return (
              <Reveal key={project.slug} delay={index * 90}>
                <CardLink href={`/projects/${project.slug}`}>
                  {/* Square, like every other image on the landing page. */}
                  <CardMedia
                    src={image.src}
                    alt={image.alt}
                    ratio="aspect-square"
                  />

                  {/*
                    Status and region, then the title. The station number and
                    the summary are gone: six elements per card is what made a
                    three-up row read as a wall, and both are on the project
                    page one click away.
                  */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Tag tone={tagTones[card.badgeKey]}>{card.badge}</Tag>
                    <span className="text-xs font-semibold text-ink/70">
                      {card.region}
                    </span>
                  </div>

                  <CardTitle className="mt-3 text-lg">{card.title}</CardTitle>
                </CardLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
