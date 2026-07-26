"use client";

import Link from "next/link";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowDisc, Tag } from "@/app/components/primitives";
import { DataList, PageHeader, PageSection } from "@/app/components/PageShell";
import { projectImages } from "@/app/components/pages/projectImages";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { t } = useI18n();

  const project = t.projectsPage.details.find((item) => item.slug === slug);
  const image = projectImages[slug];

  /*
    The slug is validated by the route before this renders, so a miss here can
    only mean the content and the slug list have drifted apart.
  */
  if (!project) return null;

  const others = t.projectsPage.details.filter((item) => item.slug !== slug);

  return (
    <>
      <PageHeader
        title={project.title}
        eyebrow={project.region}
        backHref="/projects"
        backLabel={t.common.backToProjects}
      />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site">
          <img
            src={image.src}
            alt={image.alt}
            className="aspect-[16/9] w-full object-cover"
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <Tag tone="gold">{project.status}</Tag>
              <div className="mt-6 space-y-5">
                {project.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-ink/75"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Facts rail: the project's hard numbers, ruled not boxed. */}
            <aside className="lg:col-span-4 lg:col-start-9">
              <dl className="border-t border-navy-ink/40 pt-6">
                {project.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-b border-navy-ink/12 py-4"
                  >
                    <dt className="eyebrow text-ink/50">{fact.label}</dt>
                    <dd className="mt-2 text-sm font-semibold text-navy-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/donate"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
              >
                <ArrowDisc />
                {t.nav.donate}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <PageSection tone="warm">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {others.map((other) => (
            <div key={other.slug}>
              <p className="eyebrow text-gold-deep">{other.region}</p>
              <h2 className="mt-3 font-display text-xl font-medium leading-snug text-navy-ink">
                <Link
                  href={`/projects/${other.slug}`}
                  className="transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                >
                  {other.title}
                </Link>
              </h2>
              <Link
                href={`/projects/${other.slug}`}
                className="group mt-5 inline-flex items-center gap-3 text-sm font-semibold text-navy-ink transition-colors hover:text-azure-deep"
              >
                <ArrowDisc />
                {t.common.readProject}
              </Link>
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
