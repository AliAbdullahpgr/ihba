import { ArrowRight } from "lucide-react";

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
 * Small rectangular tag that sits flush in the top-left corner of a card
 * image, overlapping it. Sharp corners, uppercase, tight.
 */
export function Tag({
  children,
  tone = "gold",
}: {
  children: React.ReactNode;
  tone?: "gold" | "azure" | "navy";
}) {
  const tones = {
    gold: "bg-gold text-navy-ink",
    azure: "bg-azure-soft text-navy-ink",
    navy: "bg-navy-deep text-white",
  } as const;

  return (
    <span
      className={`eyebrow inline-block px-2.5 py-1.5 ${tones[tone]}`}
    >
      {children}
    </span>
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
    <a
      href={href}
      className={`group inline-flex items-center gap-3 text-sm font-semibold text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure ${
        tone === "white" ? "text-white hover:text-gold" : ""
      } ${className}`}
    >
      <ArrowDisc tone={tone} />
      {children}
    </a>
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
  variant?: "solid" | "outline" | "onDark";
  className?: string;
}) {
  const variants = {
    solid:
      "bg-navy-deep text-white hover:bg-navy focus-visible:ring-navy",
    outline:
      "border border-navy-ink/25 text-navy-ink hover:border-navy-ink focus-visible:ring-navy",
    onDark:
      "border border-white/30 text-white hover:bg-white/10 focus-visible:ring-white",
  } as const;

  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 ${variants[variant]} ${className}`}
    >
      {children}
    </a>
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
