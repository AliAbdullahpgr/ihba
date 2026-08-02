"use client";

import { Link2, X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/app/components/SocialIcons";
import { socialLinks } from "@/lib/content";

/* Lucide icons and the local brand SVGs have different component shapes, so the
   map is typed on what this row actually needs. */
const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: X,
  x: X,
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
  const profiles = t.socialLinks?.filter((profile) => profile.active && profile.url) ?? socialLinks;

  if (profiles.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {profiles.map(({ key, url, label, openInNewTab = true }) => {
        // A platform added from the admin may not have a brand mark bundled;
        // a generic link icon is better than dropping the profile entirely.
        const Icon = icons[key] ?? Link2;
        const name =
          label?.trim() ||
          (t.social as Record<string, string>)[key] ||
          key;
        return (
          <a
            key={`${key}-${url}`}
            href={url}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noreferrer noopener" : undefined}
            aria-label={name}
            className="grid size-10 place-items-center border border-navy-ink/25 text-navy-ink transition-colors hover:border-navy-ink hover:bg-navy-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
