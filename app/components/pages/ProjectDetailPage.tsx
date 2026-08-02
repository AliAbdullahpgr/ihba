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
import { RichText } from "@/app/components/RichText";
import { ShareRow } from "@/app/components/ShareRow";
import { resolveProjectImage } from "@/app/components/pages/projectImages";
import { stripHtml } from "@/lib/rich-text";

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
  const [lead, ...body] = project.body;
  // The deck is set as a plain string in the page header, so any formatting the
  // editor applied to the opening paragraph is flattened away here.
  const deck = stripHtml(lead ?? "");

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

      {/*
        A plain wrapper, not a section: the page's own h1 (the project title)
        already labels this content, so there is no separate heading here to
        hang a landmark label on.
      */}
      <div className="bg-white pb-16 lg:pb-20">
        <div className="container-site">
          {/*
            No caption here on purpose: the only text available is the alt, and
            printing it underneath would make a screen reader read the same
            sentence twice. A caption belongs here once the content drafts carry
            translated ones.

            A project may legitimately have no photograph, in which case the
            figure is omitted rather than filled with a placeholder.
          */}
          {image && (
            <Figure
              images={[{ src: image.src, alt: image.alt }]}
              imageClassName="aspect-[16/9] w-full"
            />
          )}

          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <Tag tone="gold">{project.status}</Tag>

              <RichText blocks={body} className="mt-6" />

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
                    <dt className="text-sm text-ink/70">{fact.label}</dt>
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

          {/*
            Additional photographs, in the order the admin arranged them. Only
            rendered when the project actually has some, so a text-only project
            ends cleanly after the facts rail.
          */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-16 border-t border-navy-ink/15 pt-10">
              <div className="grid gap-6 sm:grid-cols-2">
                {project.gallery.map((photo) => (
                  <figure key={photo.src}>
                    <Figure
                      images={[{ src: photo.src, alt: photo.alt }]}
                      imageClassName="aspect-[4/3] w-full"
                    />
                    {photo.caption && (
                      <figcaption className="mt-3 text-sm leading-relaxed text-ink/65">
                        {photo.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No dead end: the reader always leaves with somewhere else to go. */}
      <PageSection title={t.projectsPage.moreTitle} tone="warm">
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {others.map((other, index) => {
            const otherImage = resolveProjectImage(other);
            return (
              <Reveal key={other.slug} delay={index * 90}>
                <CardLink href={`/projects/${other.slug}`}>
                  {otherImage && (
                    <CardMedia
                      src={otherImage.src}
                      alt={otherImage.alt}
                      ratio="aspect-square"
                    />
                  )}
                  {/* Status and region, matching the meta row on every other
                      project card on the site, rather than a lone eyebrow label. */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Tag tone="gold">{other.status}</Tag>
                    <span className="text-xs font-semibold text-ink/70">
                      {other.region}
                    </span>
                  </div>
                  <CardTitle className="mt-3 text-xl">{other.title}</CardTitle>
                </CardLink>
              </Reveal>
            );
          })}
        </div>
      </PageSection>
    </>
  );
}
