"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import {
  ArrowDisc,
  CardLink,
  CardMedia,
  CardTitle,
  Tag,
} from "@/app/components/primitives";
import { PageHeader, PageSection } from "@/app/components/PageShell";
import { Figure } from "@/app/components/Lightbox";
import { Reveal } from "@/app/components/Reveal";
import { ShareRow } from "@/app/components/ShareRow";
import { resolveProjectImage } from "@/app/components/pages/projectImages";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { t } = useI18n();

  const project = t.projectsPage.details.find((item) => item.slug === slug);

  /*
    The slug is validated by the route before this renders, so a miss here can
    only mean the content and the slug list have drifted apart.
  */
  if (!project) return null;

  const image = resolveProjectImage(project);
  const others = t.projectsPage.details.filter((item) => item.slug !== slug);
  const [deck, ...body] = project.body;

  return (
    <>
      {/*
        The opening paragraph is promoted to a deck — set larger, above the
        photograph — so the page reads as an article rather than as a record.
      */}
      <PageHeader
        title={project.title}
        eyebrow={project.region}
        lede={deck}
        backHref="/projects"
        backLabel={t.common.backToProjects}
      />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site">
          {/*
            No caption here on purpose: the only text available is the alt, and
            printing it underneath would make a screen reader read the same
            sentence twice. A caption belongs here once the content drafts carry
            translated ones.
          */}
          <Figure
            images={[{ src: image.src, alt: image.alt }]}
            imageClassName="aspect-[16/9] w-full object-cover"
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <Tag tone="gold">{project.status}</Tag>

              <div className="mt-6 space-y-5">
                {body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-ink/75"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 border-t border-navy-ink/15 pt-6">
                <ShareRow title={project.title} />
              </div>
            </div>

            {/*
              Facts rail: the project's hard numbers, ruled not boxed, and stuck
              to the viewport so the figures stay beside the paragraph that
              refers to them instead of scrolling out of the argument.
            */}
            <aside className="lg:col-span-4 lg:col-start-9 lg:sticky lg:top-28 lg:self-start">
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

              <CardLink href="/donate" className="mt-8">
                <span className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-navy-ink transition-colors group-hover:text-azure-deep">
                  <ArrowDisc />
                  {t.nav.donate}
                </span>
              </CardLink>
            </aside>
          </div>
        </div>
      </section>

      {/* No dead end: the reader always leaves with somewhere else to go. */}
      <PageSection title={t.projectsPage.moreTitle} tone="warm">
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {others.map((other, index) => {
            const otherImage = resolveProjectImage(other);
            return (
              <Reveal key={other.slug} delay={index * 90}>
                <CardLink href={`/projects/${other.slug}`}>
                  <CardMedia
                    src={otherImage.src}
                    alt={otherImage.alt}
                    ratio="aspect-[16/9]"
                  />
                  <p className="eyebrow mt-5 text-gold-deep">{other.region}</p>
                  <CardTitle className="mt-3 text-xl">{other.title}</CardTitle>
                  <span className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-navy-ink">
                    <ArrowDisc />
                    {t.common.readProject}
                  </span>
                </CardLink>
              </Reveal>
            );
          })}
        </div>
      </PageSection>
    </>
  );
}
