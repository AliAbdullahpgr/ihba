"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Button, Mark } from "@/app/components/primitives";

/**
 * The current campaign or donation appeal.
 *
 * The whole block is admin-configurable: title, copy, calls to action and the
 * goal line are editable under the "Campaign" content group, and the image is
 * swappable from the media admin. Defaults to the Mazar-i-Sharif Education
 * Centre appeal so the section reads as a real ask on first publish.
 *
 * The image sits behind the whole band rather than boxed in a side column,
 * and is locked to the viewport on desktop so the band reads as a window onto
 * the photograph: the copy scrolls past while the picture holds still. A scrim
 * brings the type back to full contrast either way. The
 * primary action is solid gold — the one place on the page the accent colour
 * is a surface rather than a detail — with the secondary link kept lighter so
 * the two don't compete.
 */
export function CampaignCta() {
  const { t } = useI18n();
  const { title } = t.campaign;
  // An uploaded photograph wins over the bundled media key.
  const imageUrl =
    t.campaign.imageUrl ||
    t.media[t.campaign.imageKey as keyof typeof t.media]?.url ||
    t.media.campaignImage.url;

  return (
    <section
      id="donate"
      aria-labelledby="donate-title"
      className="relative overflow-hidden bg-navy py-20 text-white lg:flex lg:min-h-screen lg:items-center lg:py-28"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {/*
         * `bg-fixed` pins the photograph to the viewport instead of to the
         * section, so scrolling the appeal pans the window across the image
         * while the copy travels over it. `bg-cover` then sizes against the
         * viewport, which is what makes the crop feel like a window rather
         * than a tile. Mobile falls back to `bg-scroll`: iOS Safari renders
         * fixed backgrounds with a jittery, mis-cropped frame.
         */}
        <div
          className="absolute inset-0 bg-navy bg-cover bg-center bg-no-repeat bg-scroll lg:bg-fixed"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-navy/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
      </div>

      {/*
       * Full viewport height on desktop. The pinned photograph only reads as a
       * window you scroll across if it actually fills the screen — at the old
       * band height the pan was real but too small to notice.
       */}
      <div className="container-site relative w-full">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {t.campaign.kicker}
          </p>
          <h2
            id="donate-title"
            className="display-xl mt-4 text-4xl text-white sm:text-5xl"
          >
            {title.pre}
            <span className="block">
              <Mark tone="azure">{title.highlight}</Mark>
            </span>
            {title.post}
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-white/70">
            {t.campaign.copy}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-white/15 pt-8">
            <div>
              <p className="text-sm font-semibold text-white/60">
                {t.campaign.goalLabel}
              </p>
              <p className="mt-1 font-display text-2xl font-medium text-white">
                {t.campaign.goalValue}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={t.campaign.ctaPrimaryHref} variant="gold">
                {t.campaign.ctaPrimary}
              </Button>
              <Button href={t.campaign.ctaSecondaryHref} variant="onDark">
                {t.campaign.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}