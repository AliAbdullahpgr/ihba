"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  GraduationCap,
  HandHeart,
  Handshake,
  Newspaper,
  Palette,
  Sprout,
  Stethoscope,
  Users,
} from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink, Mark, Tag } from "@/app/components/primitives";
import type { CategoryKey, ProgramCard } from "@/lib/i18n";

type Rail = "left" | "right";

interface CardSpec {
  rail: Rail;
  image: string | null;
  alt: string;
  ratio: string;
  tone: "gold" | "azure" | "navy";
}

/**
 * Each card is composed rather than templated: which rail it lives in, whether
 * it carries an image, and at what crop. Two flex rails instead of one dense
 * grid means filtering can never open a hole in the middle of the mosaic.
 */
const specs: CardSpec[] = [
  {
    rail: "left",
    image: "/images/generated/project-ramadan-programme.webp",
    alt: "Community volunteers preparing food parcels and shared meals",
    ratio: "aspect-[16/9]",
    tone: "gold",
  },
  {
    rail: "left",
    image: "/images/generated/project-student-support.webp",
    alt: "University students reviewing applications together on campus",
    ratio: "aspect-[16/9]",
    tone: "azure",
  },
  { rail: "right", image: null, alt: "", ratio: "", tone: "gold" },
  {
    rail: "right",
    image: "/images/generated/project-education-centre.webp",
    alt: "Teacher guiding girls and boys as they study together in a classroom",
    ratio: "aspect-[4/3]",
    tone: "azure",
  },
  { rail: "right", image: null, alt: "", ratio: "", tone: "gold" },
  {
    rail: "left",
    image: "/images/generated/volunteer-team.webp",
    alt: "A diverse volunteer team assembling school and essential-supply kits",
    ratio: "aspect-[16/9]",
    tone: "gold",
  },
  { rail: "right", image: null, alt: "", ratio: "", tone: "navy" },
];

const icons = [
  HandHeart,
  GraduationCap,
  Sprout,
  Users,
  Stethoscope,
  Palette,
  Handshake,
];

const signpostIcons = [Newspaper, CalendarDays];

function MosaicCard({
  card,
  spec,
  Icon,
  tagLabel,
}: {
  card: ProgramCard;
  spec: CardSpec;
  Icon: typeof HandHeart;
  tagLabel: string;
}) {
  const isDark = spec.tone === "navy";

  return (
    <Reveal>
      <article className={isDark ? "bg-navy-deep p-7" : ""}>
        {spec.image ? (
          <div className="relative">
            <img
              src={spec.image}
              alt={spec.alt}
              className={`w-full object-cover ${spec.ratio}`}
            />
            <span className="absolute left-0 top-0">
              <Tag tone={spec.tone}>{tagLabel}</Tag>
            </span>
          </div>
        ) : (
          <span
            className={`mb-5 inline-flex ${
              isDark ? "text-gold" : "text-azure-deep"
            }`}
          >
            <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}

        <h3
          className={`font-display text-xl font-medium leading-snug ${
            spec.image ? "mt-5" : ""
          } ${isDark ? "text-white" : "text-navy-ink"}`}
        >
          {card.title}
        </h3>
        <p
          className={`mt-2 text-sm leading-relaxed ${
            isDark ? "text-white/70" : "text-ink/65"
          }`}
        >
          {card.blurb}
        </p>
      </article>
    </Reveal>
  );
}

export function FocusMosaic() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<CategoryKey | "all">("all");
  const { title } = t.programs;

  const visible = useMemo(
    () =>
      t.programs.cards
        .map((card, index) => ({ card, index, spec: specs[index] }))
        .filter(({ card }) => filter === "all" || card.categoryKey === filter),
    [t.programs.cards, filter]
  );

  const railCards = (rail: Rail) => visible.filter(({ spec }) => spec.rail === rail);

  return (
    <section id="programs" className="bg-paper-warm/50">
      <div className="container-site pt-14 pb-20 lg:pt-16 lg:pb-28">
        <div className="lg:grid lg:grid-cols-7 lg:gap-8">
          {/* Left rail — the wide cards and the section's own masthead. */}
          <div className="flex flex-col gap-12 lg:col-span-4">
            <div>
              <h2 className="display-xl max-w-[22ch] text-3xl text-navy-ink sm:text-4xl">
                {title.pre}
                <Mark tone="azure">{title.highlight}</Mark>
                {title.post}
              </h2>

              <label className="mt-8 flex flex-wrap items-center gap-3">
                <span className="font-display text-lg font-medium text-navy-ink">
                  {t.programs.filterLabel}
                </span>
                <span className="relative">
                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value as CategoryKey | "all")
                    }
                    className="appearance-none border border-navy-ink/30 bg-white py-2.5 pl-4 pr-11 text-sm font-bold text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                  >
                    {t.programs.filters.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-ink/60"
                    aria-hidden="true"
                  />
                </span>
              </label>
            </div>

            {railCards("left").map(({ card, index, spec }) => (
              <MosaicCard
                key={card.title}
                card={card}
                spec={spec}
                Icon={icons[index]}
                tagLabel={t.programs.tag}
              />
            ))}
          </div>

          {/*
            Right rail — starts low on large screens to clear the hero feature
            card hanging into this band from above.
          */}
          <div className="mt-12 flex flex-col gap-12 lg:col-span-3 lg:mt-0 lg:pt-[15rem]">
            {/* Signposts are wayfinding, not content, so the filter leaves them. */}
            {t.programs.signposts.map((signpost, index) => {
              const Icon = signpostIcons[index];
              return (
                <Reveal key={signpost.title}>
                  <article className="frame flex flex-col p-7">
                    <Icon
                      className="h-10 w-10 text-navy-ink"
                      strokeWidth={1.25}
                      aria-hidden="true"
                    />
                    <h3 className="mt-8 font-display text-xl font-medium leading-snug text-navy-ink">
                      {signpost.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">
                      {signpost.copy}
                    </p>
                    <ArrowLink href="#projects" className="mt-6">
                      {signpost.cta}
                    </ArrowLink>
                  </article>
                </Reveal>
              );
            })}

            {railCards("right").map(({ card, index, spec }) => (
              <MosaicCard
                key={card.title}
                card={card}
                spec={spec}
                Icon={icons[index]}
                tagLabel={t.programs.tag}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
