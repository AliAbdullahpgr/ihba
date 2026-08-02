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
import { pickSelected } from "@/lib/homepage-sections";

const tagTones = {
  planning: "azure",
  active: "gold",
  seasonal: "navy",
} as const;

export function Projects() {
  const { t } = useI18n();

  /*
    `projects.cards` is built alongside `projectsPage.details` and indexed in
    step with it, so the two are paired before any filtering — selecting a
    subset by index alone would show one project's photograph above another
    project's title.
  */
  const paired = t.projectsPage.details.map((project, index) => ({
    project,
    card: t.projects.cards[index],
  }));
  const featured = pickSelected(
    paired,
    t.homepage.projects,
    (item) => item.project.slug,
  );

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
          {featured.map(({ project, card }, index) => {
            const image = resolveProjectImage(project);

            return (
              <Reveal key={project.slug} delay={index * 90}>
                <CardLink href={`/projects/${project.slug}`}>
                  {/* Square, like every other image on the landing page.
                      Omitted entirely when a project has no photograph, so the
                      card stays clean instead of showing a placeholder. */}
                  {image && (
                    <CardMedia
                      src={image.src}
                      alt={image.alt}
                      ratio="aspect-square"
                    />
                  )}

                  {/*
                    Status and region, then the title. The station number and
                    the summary are gone: six elements per card is what made a
                    three-up row read as a wall, and both are on the project
                    page one click away.
                  */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Tag tone={tagTones[card?.badgeKey ?? "active"]}>
                      {card?.badge ?? project.status}
                    </Tag>
                    <span className="text-xs font-semibold text-ink/70">
                      {card?.region ?? project.region}
                    </span>
                  </div>

                  <CardTitle className="mt-3 text-lg">
                    {card?.title ?? project.title}
                  </CardTitle>
                </CardLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
