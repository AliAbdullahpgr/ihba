"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Button, Mark } from "@/app/components/primitives";
import { resolveHeroSlides } from "@/lib/hero-slides";

/**
 * The homepage hero: a full-bleed photo carousel with the copy overlaid,
 * rather than the split text/image layout the rest of the page uses.
 *
 * Every banner — the first included — comes from `heroSlides`, so all of them
 * are reorderable and editable in one place. One image above the fold loads
 * eagerly (priority), the rest are lazy.
 *
 * Autoplay pauses on hover, focus and when the visitor prefers reduced
 * motion. Swipe advances on touch; arrow keys and the on-image controls work
 * for everyone else.
 */
const AUTOPLAY_MS = 6000;

export function HeroSlider() {
  const { t } = useI18n();

  const published = resolveHeroSlides(t).filter((slide) => slide.active);
  /*
    The admin will not let every banner be hidden, but a document edited by
    hand could still get there. Falling back to the full list beats rendering
    a homepage with no headline at all.
  */
  const slides = published.length > 0 ? published : resolveHeroSlides(t).slice(0, 1);

  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [announcedIndex, setAnnouncedIndex] = useState<number | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const goto = useCallback(
    (next: number, announce = true) => {
      const resolved = ((next % count) + count) % count;
      setIndex(resolved);
      if (announce) setAnnouncedIndex(resolved);
    },
    [count]
  );
  const next = useCallback(() => goto(index + 1), [index, goto]);
  const prev = useCallback(() => goto(index - 1), [index, goto]);

  const autoplaying = !reducedMotion && !interactionPaused && !userPaused && count > 1;

  useEffect(() => {
    if (!autoplaying) return;
    timerRef.current = setInterval(
      () => goto(index + 1, false),
      AUTOPLAY_MS
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplaying, index]);

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const active = slides[index];

  return (
    <section
      className="relative isolate overflow-hidden bg-navy-ink text-white"
      aria-roledescription="carousel"
      aria-label="IHBA highlights"
      tabIndex={0}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setInteractionPaused(false);
      }}
    >
      {/* Frames — full-bleed, stacked, opacity crossfades; the active one gets
          a slow motion-safe zoom so the carousel never feels static. */}
      <div className="absolute inset-0 -z-20 h-[34rem] sm:h-[38rem] lg:h-[42rem]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={
                slide.imageUrl ??
                t.media[slide.imageKey as keyof typeof t.media]?.url ??
                t.media.hero.url
              }
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${
                i === index ? "motion-safe:animate-[hero-zoom_7s_ease-out_forwards]" : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* Legibility scrim: darker on the text side, sheer over the rest of the frame. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 h-[34rem] bg-[linear-gradient(90deg,rgba(38,42,51,.82)_0%,rgba(38,42,51,.55)_40%,rgba(38,42,51,.15)_75%,rgba(38,42,51,.3)_100%)] sm:h-[38rem] lg:h-[42rem] max-lg:bg-[linear-gradient(180deg,rgba(38,42,51,.35)_0%,rgba(38,42,51,.3)_40%,rgba(38,42,51,.78)_100%)]"
        aria-hidden="true"
      />

      <div className="relative flex h-[34rem] flex-col justify-end pb-8 sm:h-[38rem] lg:h-[42rem] lg:justify-center lg:pb-0">
        <div className="container-site">
          <h2 className="sr-only">{t.facts.title}</h2>
          <div
            key={index}
            className="max-w-xl motion-safe:animate-[slide-fade_500ms_ease-out]"
          >
            <h1 className="display-xl text-balance text-[clamp(1.875rem,4vw,3rem)] text-white">
              {active.headline.pre}
              <span className="block">
                <Mark tone="azure">{active.headline.highlight}</Mark>
              </span>
              {active.headline.post}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
              {active.subcopy}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={active.ctaPrimaryHref}>{active.ctaPrimary}</Button>
              <Button href={active.ctaSecondaryHref} variant="onDark">
                {active.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>

        {/* Controls — pinned to the image on desktop, flowing beneath the
            copy on narrow screens where there's no room to spare. */}
        {count > 1 && (
          <div className="container-site mt-10 lg:absolute lg:inset-x-0 lg:bottom-8 lg:mt-0">
            <div
              className="flex items-center gap-4"
              role="group"
              aria-label="Carousel controls"
            >
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="grid size-11 shrink-0 place-items-center border border-white/30 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="grid size-11 shrink-0 place-items-center border border-white/30 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => goto(i)}
                    className={`rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      i === index
                        ? "size-2.5 bg-gold"
                        : "size-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Play autoplay" : "Pause autoplay"}
                aria-pressed={!userPaused}
                className="ml-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {userPaused ? (
                  <Play className="size-4" aria-hidden="true" />
                ) : (
                  <Pause className="size-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  {userPaused ? "Play" : "Pause"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcedIndex === null
          ? ""
          : `Slide ${announcedIndex + 1}: ${slides[announcedIndex]?.headline.highlight ?? ""}`}
      </p>
    </section>
  );
}
