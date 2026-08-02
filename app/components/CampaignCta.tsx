"use client";

import Image from "next/image";
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
 * The image now sits behind the whole band rather than boxed in a side
 * column: a scrim brings the type back to full contrast, so the photograph
 * reads as the ground the appeal stands on instead of a decorative tile. The
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
      className="relative overflow-hidden bg-navy py-20 text-white lg:py-28"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent" />
      </div>

      <div className="container-site relative">
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