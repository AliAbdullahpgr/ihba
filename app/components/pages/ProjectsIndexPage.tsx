"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { CardLink, CardMedia, CardTitle, Tag } from "@/app/components/primitives";
import { PageHeader } from "@/app/components/PageShell";
import { resolveProjectImage } from "@/app/components/pages/projectImages";

const tones = ["azure", "gold", "navy"] as const;

export function ProjectsIndexPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.projectsPage.title} lede={t.projectsPage.lede} />

      {/*
        A plain wrapper, not a section: the page's own h1 already labels this
        content, and every card below carries its own heading, so there is no
        single heading left to point a landmark label at.
      */}
      <div className="bg-white pb-20 lg:pb-28">
        <div className="container-site">
          {/* Same three-up card as the landing page's own projects grid, so a
              visitor who lands here from either place sees one consistent card. */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {t.projectsPage.details.map((project, index) => {
              const image = resolveProjectImage(project);
              return (
                <Reveal key={project.slug} delay={(index % 3) * 90}>
                  <CardLink href={`/projects/${project.slug}`}>
                    {/* A project published without a photograph shows a plain
                        text card rather than a stock placeholder. */}
                    {image && (
                      <CardMedia src={image.src} alt={image.alt} ratio="aspect-square" />
                    )}

                    {/*
                      Status and region, then the title. No station number and
                      no summary paragraph: the project page one click away
                      carries the detail, so the card only needs to identify it.
                    */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Tag tone={tones[index % tones.length]}>{project.status}</Tag>
                      <span className="text-xs font-semibold text-ink/70">
                        {project.region}
                      </span>
                    </div>

                    <CardTitle className="mt-3 text-lg">{project.title}</CardTitle>
                  </CardLink>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
