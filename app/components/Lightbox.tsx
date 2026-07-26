"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Editorial figure. A captioned image that opens full-size on click.
 *
 * The trigger is the whole image, which is the affordance readers already
 * expect from a photograph; the corner glyph only appears on hover to say so
 * out loud. Pass `images` to make one figure the entrance to a set.
 */
export function Figure({
  images,
  index = 0,
  className = "",
  imageClassName = "aspect-[16/9] w-full object-cover",
}: {
  images: LightboxImage[];
  index?: number;
  className?: string;
  imageClassName?: string;
}) {
  const { t } = useI18n();
  const [openAt, setOpenAt] = useState<number | null>(null);
  const image = images[index];

  if (!image) return null;

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => setOpenAt(index)}
        aria-label={`${t.common.enlarge} — ${image.alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-4"
      >
        <img
          src={image.src}
          alt={image.alt}
          className={`transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${imageClassName}`}
        />
        <span
          aria-hidden="true"
          className="absolute right-0 top-0 grid h-11 w-11 place-items-center bg-navy-ink text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {image.caption && (
        <figcaption className="mt-3 border-l-2 border-gold pl-3 text-xs leading-relaxed text-ink/60">
          {image.caption}
        </figcaption>
      )}

      {openAt !== null && (
        <Lightbox
          images={images}
          startAt={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </figure>
  );
}

/**
 * Full-screen image viewer. Mounted only while open, so there is no hidden
 * dialog in the tree and no chance of a stray keydown listener.
 */
export function Lightbox({
  images,
  startAt,
  onClose,
}: {
  images: LightboxImage[];
  startAt: number;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [at, setAt] = useState(startAt);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const many = images.length > 1;

  const go = useCallback(
    (step: number) => setAt((i) => (i + step + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    /*
      Focus moves into the dialog on open and returns to whatever opened it on
      close, so keyboard readers are not dropped back at the top of the page.
    */
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && many) go(1);
      if (event.key === "ArrowLeft" && many) go(-1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [go, many, onClose]);

  const image = images[at];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.caption ?? image.alt}
      className="fixed inset-0 z-100 flex flex-col bg-navy-ink/95 p-4 sm:p-8"
      onClick={(event) => {
        // Clicking the backdrop closes; clicking the picture does not.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-white/60">
          {many ? `${at + 1} / ${images.length}` : ""}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="grid h-11 w-11 place-items-center border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-3 py-4">
        {many && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.common.previous}
            className="grid h-11 w-11 shrink-0 place-items-center border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <img
          src={image.src}
          alt={image.alt}
          className="max-h-full min-h-0 w-auto max-w-full object-contain"
        />

        {many && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t.common.next}
            className="grid h-11 w-11 shrink-0 place-items-center border border-white/30 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {image.caption && (
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-white/70">
          {image.caption}
        </p>
      )}
    </div>
  );
}
