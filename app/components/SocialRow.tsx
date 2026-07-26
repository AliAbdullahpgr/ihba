"use client";

import { X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/app/components/SocialIcons";
import { socialLinks, type SocialKey } from "@/lib/content";

/* Lucide icons and the local brand SVGs have different component shapes, so the
   map is typed on what this row actually needs. */
const icons: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  twitter: X,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
};

/**
 * Bordered social marks. Renders nothing until real profile URLs exist, so the
 * site never ships icons that go nowhere.
 */
export function SocialRow({ className = "" }: { className?: string }) {
  const { t } = useI18n();

  if (socialLinks.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {socialLinks.map(({ key, url }) => {
        const Icon = icons[key];
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={t.social[key]}
            className="grid size-10 place-items-center border border-navy-ink/25 text-navy-ink transition-colors hover:border-navy-ink hover:bg-navy-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
