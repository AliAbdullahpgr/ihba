"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import {
  ArrowDisc,
  CardLink,
  CardMedia,
  CardTitle,
  ChipToggle,
  Mark,
} from "@/app/components/primitives";
import type { CategoryKey, ProgramCard } from "@/lib/i18n";
import type { SiteMedia } from "@/lib/media";

type Rail = "left" | "right";

interface CardSpec {
  rail: Rail;
  image: string | null;
  alt: string;
  ratio: string;
}

/**
 * Each card is composed rather than templated: which rail it lives in, whether
 * it carries an image, and at what crop. Two flex rails instead of one dense
 * grid means filtering can never open a hole in the middle of the mosaic.
 */
function getSpecs(media: SiteMedia): CardSpec[] {
  return [
  {
    rail: "left",
    image: media.fieldRamadanIftar.url,
    alt: "A large IHBA Ramadan iftar gathering in Pakistan",
    ratio: "aspect-[16/9]",
  },
  {
    rail: "left",
    image: media.studentSupport.url,
    alt: "University students reviewing applications together on campus",
    ratio: "aspect-[16/9]",
  },
  { rail: "right", image: null, alt: "", ratio: "" },
  {
    rail: "right",
    image: media.educationCentre.url,
    alt: "Teacher guiding girls and boys as they study together in a classroom",
    ratio: "aspect-[4/3]",
  },
  { rail: "right", image: null, alt: "", ratio: "" },
  {
    rail: "left",
    image: media.fieldTeamPakistan.url,
    alt: "IHBA volunteers and local partners together in Pakistan",
    ratio: "aspect-[16/9]",
  },
  { rail: "right", image: null, alt: "", ratio: "" },
  ];
}

function MosaicCard({
  card,
  spec,
  index,
  categoryLabel,
}: {
  card: ProgramCard;
  spec: CardSpec;
  index: number;
  categoryLabel: string;
}) {
  return (
    <Reveal>
      {/* The whole card is one link into the areas of work. */}
      <CardLink href="/areas-of-work">
        {spec.image ? (
          <CardMedia src={spec.image} alt={spec.alt} ratio={spec.ratio} />
        ) : (
          <p className="font-display text-6xl font-medium tracking-[-0.03em] text-navy-ink/15 transition-colors group-hover:text-navy-ink/30">
            {String(index + 1).padStart(2, "0")}
          </p>
        )}

        <p className="eyebrow mt-5 text-gold-deep">{categoryLabel}</p>
        <CardTitle className="mt-2 text-xl">{card.title}</CardTitle>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{card.blurb}</p>
      </CardLink>
    </Reveal>
  );
}

export function FocusMosaic() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const { title } = t.programs;
  const specs = getSpecs(t.media);

  const labelFor = (key: CategoryKey) =>
    t.programs.filters.find((option) => option.key === key)?.label ?? "";

  const visible = useMemo(
    () =>
      t.programs.cards
        .map((card, index) => ({ card, index, spec: specs[index] }))
        .filter(({ card }) => filter === "all" || card.categoryKey === filter),
    [t.programs.cards, t.media, filter]
  );

  const railCards = (rail: Rail) =>
    visible.filter(({ spec }) => spec.rail === rail);

  return (
    <section id="programs" className="bg-paper-warm/50 py-20 lg:py-28">
      <div className="container-site">
        <h2 className="display-xl max-w-[22ch] text-3xl text-navy-ink sm:text-4xl">
          {title.pre}
          <Mark tone="azure">{title.highlight}</Mark>
          {title.post}
        </h2>

        {/* The taxonomy is on show as an index, not hidden in a dropdown. */}
        <div
          className="mt-10 flex flex-wrap gap-2"
          role="group"
          aria-label={t.programs.filterLabel}
        >
          {t.programs.filters.map((option) => (
            <ChipToggle
              key={option.key}
              active={filter === option.key}
              onClick={() => setFilter(option.key)}
            >
              {option.label}
            </ChipToggle>
          ))}
        </div>

        <div className="mt-14 lg:grid lg:grid-cols-7 lg:gap-8">
          <div className="flex flex-col gap-14 lg:col-span-4">
            {railCards("left").map(({ card, index, spec }) => (
              <MosaicCard
                key={card.title}
                card={card}
                spec={spec}
                index={index}
                categoryLabel={labelFor(card.categoryKey)}
              />
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-14 lg:col-span-3 lg:mt-0">
            {railCards("right").map(({ card, index, spec }) => (
              <MosaicCard
                key={card.title}
                card={card}
                spec={spec}
                index={index}
                categoryLabel={labelFor(card.categoryKey)}
              />
            ))}
          </div>
        </div>

        {/* Signposts: each a single clickable block on a plain hairline. */}
        <div className="mt-20 grid gap-10 border-t border-navy-ink/15 pt-10 md:grid-cols-2 md:gap-16">
          {t.programs.signposts.map((signpost, index) => (
            <CardLink
              key={signpost.title}
              href={index === 0 ? "/gallery" : "/volunteer"}
            >
              <CardTitle className="text-xl">{signpost.title}</CardTitle>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
                {signpost.copy}
              </p>
              <span className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-navy-ink">
                <ArrowDisc />
                {signpost.cta}
              </span>
            </CardLink>
          ))}
        </div>
      </div>
    </section>
  );
}
