"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import {
  CardLink,
  CardMedia,
  CardTitle,
  Mark,
} from "@/app/components/primitives";
import type { CategoryKey, ProgramCard } from "@/lib/i18n";
import type { SiteMedia } from "@/lib/media";

interface CardSpec {
  image: string;
  alt: string;
  /** Column span at `lg`, against the section's 12-column track. */
  span: string;
  ratio: string;
}

/**
 * The seven fields, as a two-scale mosaic.
 *
 * The mosaic is worth keeping — a flat seven-up grid says nothing about the
 * work. What was wrong before was the mechanism: two independent flex rails
 * holding 3 and 4 cards, so nothing lined up across the gutter and the section
 * read as two unrelated lists, with the wide rail rendering ~690px-wide 16/9
 * photographs. Here every card sits on one 12-column track, so every edge in
 * the section aligns with every other, and the variation is deliberate rather
 * than emergent: a top row of three at 4-of-12 and a 4/3 crop, then a bottom
 * row of four at 3-of-12 and a square. Two scales, two crops, no orphan cell,
 * and the widest image is ~390px.
 *
 * Every field carries a photograph. Three of them used to render a bare rule
 * where the others had an image, which made the section look half-loaded — a
 * section is either photographic throughout or it is not.
 */
function getSpecs(media: SiteMedia): CardSpec[] {
  const lead = { span: "lg:col-span-4", ratio: "aspect-[4/3]" };
  const rest = { span: "lg:col-span-3", ratio: "aspect-square" };

  return [
    {
      image: media.fieldRamadanIftar.url,
      alt: "A large IHBA Ramadan iftar gathering in Pakistan",
      ...lead,
    },
    {
      image: media.educationCentre.url,
      alt: "Teacher guiding girls and boys as they study together in a classroom",
      ...lead,
    },
    {
      image: media.solarWaterPump.url,
      alt: "A solar-powered water pump installed for a rural community",
      ...lead,
    },
    {
      image: media.studentSupport.url,
      alt: "University students reviewing applications together on campus",
      ...rest,
    },
    {
      image: media.cleanWaterOpening.url,
      alt: "Residents gathering at the opening of a clean-water point",
      ...rest,
    },
    {
      image: media.volunteerTeam.url,
      alt: "IHBA volunteers preparing supplies together",
      ...rest,
    },
    {
      image: media.fieldTeamPakistan.url,
      alt: "IHBA volunteers and local partners together in Pakistan",
      ...rest,
    },
  ];
}

function MosaicCard({
  card,
  spec,
  categoryLabel,
}: {
  card: ProgramCard;
  spec: CardSpec;
  categoryLabel: string;
}) {
  return (
    <Reveal className={spec.span}>
      {/* The whole card is one link into the areas of work. */}
      <CardLink href="/areas-of-work">
        <CardMedia src={spec.image} alt={spec.alt} ratio={spec.ratio} />
        <p className="eyebrow mt-5 text-gold-deep">{categoryLabel}</p>
        <CardTitle className="mt-2 text-lg">{card.title}</CardTitle>
      </CardLink>
    </Reveal>
  );
}

export function FocusMosaic() {
  const { t } = useI18n();
  const { title } = t.programs;
  const specs = getSpecs(t.media);

  const labelFor = (key: CategoryKey) =>
    t.programs.filters.find((option) => option.key === key)?.label ?? "";

  return (
    /*
      Opens the page's one warm band, which runs unbroken through About and the
      president's quote. No filter row: every card lands on /areas-of-work, so
      the chips let a visitor rearrange a seven-item list without ever leaving
      the page — an interaction that cost a control strip and bought nothing.
      Filtering belongs on the destination.
    */
    <section id="programs" className="bg-paper-warm/50 py-20 lg:py-28">
      <div className="container-site">
        <h2 className="display-xl max-w-[22ch] text-3xl text-navy-ink sm:text-4xl">
          {title.pre}
          <Mark tone="azure">{title.highlight}</Mark>
          {title.post}
        </h2>

        {/*
          One 12-column track carrying both scales. Below `lg` the spans do not
          apply and the mosaic collapses to a plain one- then two-up stack,
          which is the only thing that reads on a narrow screen anyway.
        */}
        <div className="mt-14 grid items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {t.programs.cards.map((card, index) => (
            <MosaicCard
              key={card.title}
              card={card}
              spec={specs[index]}
              categoryLabel={labelFor(card.categoryKey)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
