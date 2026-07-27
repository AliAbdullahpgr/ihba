"use client";

import { Figure, type LightboxImage } from "@/app/components/Lightbox";
import { PageHeader, PageSection } from "@/app/components/PageShell";
import { ArrowLink } from "@/app/components/primitives";
import { Reveal } from "@/app/components/Reveal";
import { useI18n } from "@/app/components/LanguageProvider";
import { content } from "@/lib/content";
import type {
  GalleryLayout,
  PublicGalleryItem,
} from "@/lib/gallery";

function composition(layout: GalleryLayout, index: number) {
  if (layout === "wide") {
    return { column: "md:col-span-12", ratio: "aspect-[16/8]" };
  }
  if (layout === "portrait") {
    return {
      column:
        index % 2 === 0
          ? "md:col-span-7"
          : "md:col-span-5 md:pt-24",
      ratio: "aspect-[3/4]",
    };
  }
  return {
    column:
      index % 2 === 0
        ? "md:col-span-5"
        : "md:col-span-7 md:pt-20",
    ratio: "aspect-[4/3]",
  };
}

export function GalleryPage({ items }: { items: PublicGalleryItem[] }) {
  const { t, lang } = useI18n();
  // Older saved content documents may predate the gallery; bundled copy keeps
  // the new route available until an editor saves the expanded document.
  const page = t.galleryPage ?? content[lang].galleryPage;
  const localized = items.map((item) => ({
    ...item,
    translation:
      item.galleryTranslations.find(
        (translation) => translation.locale === lang
      ) ??
      item.galleryTranslations.find(
        (translation) => translation.locale === "tr"
      ) ??
      item.galleryTranslations[0],
  }));
  const images: LightboxImage[] = localized.map((item) => ({
    src: item.imageUrl,
    alt: item.translation?.imageAlt ?? "",
    caption: item.translation?.caption,
  }));

  return (
    <>
      <PageHeader title={page.title} lede={page.lede} />

      {/*
        A plain wrapper, not a section: the page's own h1 already labels this
        content, and every item below carries its own heading, so there is no
        single heading left to point a landmark label at.
      */}
      <div className="bg-white pb-20 lg:pb-28">
        <div className="container-site grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24">
          {localized.map((item, index) => {
            const placement = composition(item.layout, index);

            return (
              <Reveal key={item.id} delay={(index % 3) * 90} className={placement.column}>
                <article>
                  <Figure
                    images={images}
                    index={index}
                    imageClassName={`${placement.ratio} w-full`}
                  />
                  <div className="mt-4 flex items-start justify-between gap-5 border-t border-navy-ink/15 pt-4">
                    <h2 className="font-display text-base font-medium text-navy-ink">
                      {item.translation?.category}
                    </h2>
                    <p className="shrink-0 text-xs font-semibold text-ink/70">
                      {item.translation?.place}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <PageSection tone="warm">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.projectsPage.title}
            </h2>
            <ArrowLink href="/projects" className="mt-5">
              {t.common.allProjects}
            </ArrowLink>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.volunteerPage.title}
            </h2>
            <ArrowLink href="/volunteer" className="mt-5">
              {t.volunteerPage.title}
            </ArrowLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
