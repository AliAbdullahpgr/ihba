"use client";

import { useEffect, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";

/*
  Brand glyphs are drawn inline rather than pulled from an icon set: icon
  libraries rename and redraw their brand marks between major versions, and a
  share row that silently loses its X icon on an upgrade is worse than twenty
  lines of path data.
*/

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.687 4.533-4.687 1.313 0 2.686.236 2.686.236v2.955H15.83c-1.491 0-1.956.93-1.956 1.887v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.019-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.198.057-.371-.058-.52-.116-.148-.652-1.57-.893-2.148-.234-.564-.472-.487-.652-.496l-.558-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.898 9.83 9.83 0 0 1 2.892 6.994c-.003 5.45-4.437 9.885-9.884 9.885M20.463 3.488A11.78 11.78 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
    </svg>
  );
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0" />
    </svg>
  );
}

const shareClasses =
  "inline-flex min-h-11 min-w-11 items-center justify-center border border-navy-ink/20 text-navy-ink transition-colors hover:border-navy-ink hover:bg-navy-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure";

/**
 * Share affordances for an article or project page.
 *
 * The URL is read from the browser rather than composed from a configured base:
 * the site is a static export with no request context, so `window.location` is
 * the only source that is right on every deployment and preview alike.
 */
export function ShareRow({ title }: { title: string }) {
  const { t } = useI18n();
  const [url, setUrl] = useState("");

  useEffect(() => setUrl(window.location.href), []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Glyph: XGlyph,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Glyph: FacebookGlyph,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Glyph: LinkedInGlyph,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      Glyph: WhatsAppGlyph,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="eyebrow mr-1 text-ink/50">{t.common.share}</p>

      {targets.map(({ key, label, href, Glyph }) => (
        <a
          key={key}
          href={url ? href : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.common.share} — ${label}`}
          aria-disabled={url ? undefined : true}
          className={shareClasses}
        >
          <Glyph />
        </a>
      ))}

      <CopyLinkButton url={url} />
    </div>
  );
}

/** Copies the current URL and confirms it in place for a couple of seconds. */
export function CopyLinkButton({ url }: { url: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
    } catch {
      // Clipboard access can be refused outright (insecure context, denied
      // permission). Staying silent is better than an alert the reader can do
      // nothing about — the visible URL is still selectable.
    }
  }

  const label = copied ? t.common.copied : t.common.copyLink;

  return (
    <>
      <button
        type="button"
        onClick={copy}
        /*
          The label is set explicitly rather than left to name-from-content:
          the live region below is a sibling, not a child, because a role=status
          element inside a button is dropped from the name computation and
          leaves the control announced as a bare "button".
        */
        aria-label={label}
        className={`${shareClasses} gap-2 px-4 text-xs font-bold uppercase tracking-[0.1em] ${
          copied ? "border-navy-ink bg-navy-ink text-white" : ""
        }`}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        <span aria-hidden="true">{label}</span>
      </button>

      {/* Announces the copy without moving focus, so it is not sighted-only. */}
      <span role="status" className="sr-only">
        {copied ? t.common.copied : ""}
      </span>
    </>
  );
}
