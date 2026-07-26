"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import {
  ArrowDisc,
  CardLink,
  CardMedia,
  CardTitle,
  Tag,
} from "@/app/components/primitives";
import { PageHeader } from "@/app/components/PageShell";
import { resolveProjectImage } from "@/app/components/pages/projectImages";

const tones = ["azure", "gold", "navy"] as const;

export function ProjectsIndexPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.projectsPage.title} lede={t.projectsPage.lede} />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site">
          {t.projectsPage.details.map((project, index) => {
            const image = resolveProjectImage(project);
            return (
              <Reveal key={project.slug}>
                {/*
                  One link per project covering image, title and summary, so the
                  whole entry is a single target rather than three small ones.
                */}
                <CardLink
                  href={`/projects/${project.slug}`}
                  className="grid gap-8 border-b border-navy-ink/12 py-12 lg:grid-cols-12"
                >
                  <div className="lg:col-span-5">
                    <CardMedia
                      src={image.src}
                      alt={image.alt}
                      ratio="aspect-[4/3]"
                    />
                  </div>

                  <div className="lg:col-span-6 lg:col-start-7">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-display text-sm font-bold text-navy-ink/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Tag tone={tones[index % tones.length]}>
                        {project.status}
                      </Tag>
                      <span className="text-xs font-semibold text-ink/50">
                        {project.region}
                      </span>
                    </div>

                    <CardTitle className="mt-4 text-2xl">
                      {project.title}
                    </CardTitle>

                    <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/70">
                      {project.body[0]}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-navy-ink">
                      <ArrowDisc />
                      {t.common.readProject}
                    </span>
                  </div>
                </CardLink>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
