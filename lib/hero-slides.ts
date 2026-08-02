import type { HeroSlide, TitleParts } from "@/lib/i18n";

/**
 * Shared shape and normalisation for the homepage banner carousel.
 *
 * Slide 1 used to be a different kind of object from the rest: assembled from
 * the `hero` copy block at render time, absent from the saved array, and
 * un-editable in the banner screen (the admin sent you to a separate page for
 * it). That made it impossible to reorder, and — because the editor posted the
 * whole visible list back — saving duplicated it into the carousel.
 *
 * Every slide is now an ordinary entry in `heroSlides`. Documents saved before
 * that change have no entry for it, so `resolveHeroSlides` rebuilds one from
 * the `hero` block; the first save from the new editor writes the complete
 * list and the fallback stops firing. No database migration is involved.
 */
export const HERO_SLIDE_ID = "hero";
export const MAX_ACTIVE_HERO_SLIDES = 5;

export type HeroSlideRecord = {
  id: string;
  headline: TitleParts;
  subcopy: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  imageKey: string;
  imageUrl?: string;
  imagePublicId?: string;
  /** Describes the photograph for screen readers and search engines. */
  alt: string;
  active: boolean;
};

export type HeroSlideTrashRecord = HeroSlideRecord & { deletedAt: string };

/**
 * Descriptions for the three bundled photographs. Uploaded images carry their
 * own `alt`, written in the admin; this only covers slides created before that
 * field existed.
 */
const legacyAltByImageKey: Record<string, string> = {
  hero: "Defterler ve temel yardım malzemeleriyle köprüden geçen gönüllüler",
  heroSlide2: "Pakistan'da düzenlenen geniş katılımlı IHBA iftar programı",
  heroSlide3: "Pakistan'da IHBA gönüllüleri ve yerel iş ortakları bir arada",
};

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function normaliseHeroSlide(value: unknown, index: number): HeroSlideRecord | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<HeroSlide>;
  const rawHeadline = raw.headline && typeof raw.headline === "object" ? raw.headline : {};
  const imageKey = text(raw.imageKey) || "hero";
  return {
    id: text(raw.id) || `slide-${index + 1}-${imageKey}`,
    headline: {
      pre: text((rawHeadline as { pre?: unknown }).pre),
      highlight: text((rawHeadline as { highlight?: unknown }).highlight),
      post: text((rawHeadline as { post?: unknown }).post),
    },
    subcopy: text(raw.subcopy),
    ctaPrimary: text(raw.ctaPrimary),
    ctaPrimaryHref: text(raw.ctaPrimaryHref),
    ctaSecondary: text(raw.ctaSecondary),
    ctaSecondaryHref: text(raw.ctaSecondaryHref),
    imageKey,
    imageUrl: text(raw.imageUrl) || undefined,
    imagePublicId: text(raw.imagePublicId) || undefined,
    alt: text(raw.alt) || legacyAltByImageKey[imageKey] || "",
    active: raw.active !== false,
  };
}

type HeroSource = {
  hero: {
    headline: TitleParts;
    subcopy: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  heroSlides: HeroSlide[];
};

/** The banner built from the legacy `hero` copy block. */
function slideFromHeroBlock(source: HeroSource): HeroSlideRecord {
  return {
    id: HERO_SLIDE_ID,
    headline: { ...source.hero.headline },
    subcopy: source.hero.subcopy,
    ctaPrimary: source.hero.ctaPrimary,
    ctaPrimaryHref: "/donate",
    ctaSecondary: source.hero.ctaSecondary,
    ctaSecondaryHref: "/projects",
    imageKey: "hero",
    alt: legacyAltByImageKey.hero,
    active: true,
  };
}

/**
 * The complete banner list, in display order. Callers filter on `active`
 * themselves — the admin needs the hidden ones too.
 */
export function resolveHeroSlides(source: HeroSource): HeroSlideRecord[] {
  const saved = Array.isArray(source.heroSlides)
    ? source.heroSlides
        .map((slide, index) => normaliseHeroSlide(slide, index))
        .filter((slide): slide is HeroSlideRecord => Boolean(slide))
    : [];

  return saved.some((slide) => slide.id === HERO_SLIDE_ID)
    ? saved
    : [slideFromHeroBlock(source), ...saved];
}

export function heroSlideTitle(slide: HeroSlideRecord) {
  const joined = `${slide.headline.pre}${slide.headline.highlight}${slide.headline.post}`.trim();
  return joined || "Başlıksız banner";
}
