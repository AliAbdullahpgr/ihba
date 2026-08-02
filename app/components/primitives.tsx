import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Route links go through next/link for client-side navigation; in-page hashes
 * stay as plain anchors so they don't trigger a router push.
 */
function Anchor({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/**
 * Solid block behind a phrase inside a headline. The single most recognisable
 * device in the system — used in the hero, section titles and the footer
 * mission statement so the same voice repeats down the page.
 */
export function Mark({
  children,
  tone = "gold",
}: {
  children: React.ReactNode;
  tone?: "gold" | "azure" | "navy";
}) {
  const tones = {
    gold: "bg-gold-soft text-navy-ink",
    azure: "bg-azure-soft text-navy-ink",
    navy: "bg-navy text-white",
  } as const;

  return <span className={`mark-block ${tones[tone]}`}>{children}</span>;
}

/**
 * Status tag. Sits inline in the meta line beneath a card rather than floating
 * over the image.
 *
 * A bounded label, not a 2px coloured stripe down one side. The side-stripe is
 * the most-copied callout decoration there is and it reads as a template part;
 * a hairline box is the same information with an edge that closes. Colours are
 * the ink-weight variants, since the previous `gold-deep` label was 3.3:1.
 */
export function Tag({
  children,
  tone = "gold",
}: {
  children: React.ReactNode;
  tone?: "gold" | "azure" | "navy";
}) {
  const tones = {
    gold: "border-gold-ink/40 text-gold-ink",
    azure: "border-azure-deep/40 text-azure-deep",
    navy: "border-navy-ink/40 text-navy-ink",
  } as const;

  return (
    <span
      className={`inline-block border px-2 py-1 text-xs font-semibold leading-none ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * The deck line with piers. Deliberately rationed: once per page at the
 * masthead, plus the bridge model's own deck. Every other divider is a plain
 * hairline, which is what keeps this one legible as a mark.
 */
export function SpanRule({
  className = "",
  tight = false,
}: {
  className?: string;
  tight?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${tight ? "span-rule-tight" : "span-rule"} text-navy-ink/30 ${className}`}
    />
  );
}

/**
 * Whole-card hit area. One link wraps the media, title and summary so the
 * entire block is clickable, and `group` drives a single coherent hover state
 * across all three. Never put another link inside one of these.
 */
export function CardLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure focus-visible:ring-offset-4 ${className}`}
    >
      {children}
    </Link>
  );
}

/**
 * Media slot for a CardLink: crops the image so it can lift on hover.
 *
 * `next/image` with `fill`, so the ratio box reserves the space before the
 * bytes arrive and nothing below it shifts. `sizes` describes the widest the
 * card ever gets — a third of the 1240px column — which is what lets the
 * optimiser stop serving 2000px originals for a 390px slot.
 */
export function CardMedia({
  src,
  alt,
  ratio = "aspect-[16/9]",
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${ratio}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

/** Card heading that underlines on hover, so the whole block reads as a link. */
export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`font-display font-medium leading-snug text-navy-ink decoration-gold decoration-2 underline-offset-4 transition-colors group-hover:underline ${className}`}
    >
      {children}
    </h3>
  );
}

/** The one circular element in the system: a filled disc holding an arrow. */
export function ArrowDisc({
  className = "",
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "outline" | "white";
}) {
  const tones = {
    navy: "bg-navy-deep text-white",
    outline: "border border-navy/25 text-navy-ink",
    white: "bg-white text-navy-ink",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={`grid size-9 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-0.5 ${tones[tone]} ${className}`}
    >
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}

/** Disc + label, the standard "read on" affordance. */
export function ArrowLink({
  href,
  children,
  tone = "navy",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "navy" | "outline" | "white";
  className?: string;
}) {
  return (
    <Anchor
      href={href}
      className={`group inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure ${
        tone === "white" ? "text-white hover:text-gold" : ""
      } ${className}`}
    >
      <ArrowDisc tone={tone} />
      {children}
    </Anchor>
  );
}

/** Rectangular button. Filled = primary action, outline = secondary. */
export function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "onDark" | "gold";
  className?: string;
}) {
  const variants = {
    solid:
      "bg-navy-deep text-white hover:bg-navy focus-visible:ring-navy",
    outline:
      "border border-navy-ink/25 text-navy-ink hover:border-navy-ink focus-visible:ring-navy",
    onDark:
      "border border-white/30 text-white hover:bg-white/10 focus-visible:ring-white",
    gold:
      "bg-gold text-navy-ink hover:bg-gold-soft focus-visible:ring-gold",
  } as const;

  return (
    <Anchor
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 ${variants[variant]} ${className}`}
    >
      {children}
    </Anchor>
  );
}

/** Category tags rendered as a row separated by thin vertical rules. */
export function TagRow({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-navy-ink">
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-3">
          {index > 0 && (
            <span className="h-3 w-px bg-navy-ink/25" aria-hidden="true" />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}
