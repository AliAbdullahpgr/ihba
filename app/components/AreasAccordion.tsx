"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import {
  ArrowLink,
  CardLink,
  CardMedia,
  CardTitle,
  Mark,
} from "@/app/components/primitives";
import { pickSelectedIndices } from "@/lib/homepage-sections";
import type { CategoryKey } from "@/lib/i18n";
import type { SiteMedia } from "@/lib/media";

/**
 * Three of the seven fields, as a photographic preview.
 *
 * The full remit lives on /areas-of-work; this is a taste of it, not an
 * index — three equal cards, with the header link carrying visitors to the
 * rest, rather than all seven squeezed into an accordion no one opens on a
 * homepage.
 *
 * Each card carries its own photograph, uploaded in the homepage layout
 * editor. These bundled images are the fallback for cards that have not been
 * given one, and are keyed by slot rather than by card — which is exactly why
 * they are only a fallback.
 */
const fallbackThumbs: Array<{ image: keyof SiteMedia; alt: string }> = [
  { image: "fieldRamadanIftar", alt: "A large IHBA Ramadan iftar gathering in Pakistan" },
  { image: "educationCentre", alt: "Teacher guiding girls and boys as they study together in a classroom" },
  { image: "solarWaterPump", alt: "A solar-powered water pump installed for a rural community" },
];

export function AreasAccordion() {
  const { t } = useI18n();
  const { title } = t.programs;
  const cards = pickSelectedIndices(t.programs.cards, t.homepage.areas);

  const labelFor = (key: CategoryKey) =>
    t.programs.filters.find((option) => option.key === key)?.label ?? "";

  return (
    <section
      id="programs"
      aria-labelledby="programs-title"
      className="bg-paper-warm/50 py-20 lg:py-28"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2
            id="programs-title"
            className="display-xl max-w-[22ch] text-3xl text-navy-ink sm:text-4xl"
          >
            {title.pre}
            <Mark tone="azure">{title.highlight}</Mark>
            {title.post}
          </h2>
          <ArrowLink href="/areas-of-work">{t.programs.viewAll}</ArrowLink>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => {
            const thumb = fallbackThumbs[index] ?? fallbackThumbs[0];
            const src = card.imageUrl || t.media[thumb.image].url;
            const alt = card.imageUrl ? card.imageAlt || card.title : thumb.alt;

            return (
              <Reveal key={card.title} delay={index * 90}>
                <CardLink href="/areas-of-work">
                  <CardMedia
                    src={src}
                    alt={alt}
                    ratio="aspect-[4/3]"
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  />
                  <p className="mt-5 text-xs font-semibold text-gold-ink">
                    {labelFor(card.categoryKey)}
                  </p>
                  <CardTitle className="mt-2 text-lg">{card.title}</CardTitle>
                </CardLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
