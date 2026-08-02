"use client";

import Link from "next/link";
import { useId } from "react";
import { ArrowLeft } from "lucide-react";
import { RichText } from "@/app/components/RichText";
import type { Row } from "@/lib/content";

/**
 * Masthead for a subpage: an oversized title over a hairline, so every page
 * opens on the same structural note as the homepage.
 */
export function PageHeader({
  title,
  lede,
  eyebrow,
  backHref,
  backLabel,
}: {
  title: string;
  lede?: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="bg-white">
      <div className="container-site pt-12 pb-14 lg:pt-16 lg:pb-16">
        {backHref && backLabel && (
          <Link
            href={backHref}
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-ink/70 transition-colors hover:text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            {backLabel}
          </Link>
        )}

        {/* Sentence case. `gold-deep` measures 3.3:1 and the tracked capital
            kicker was appearing above every page title on the site. */}
        {eyebrow && (
          <p className="mb-5 text-sm font-semibold text-gold-ink">{eyebrow}</p>
        )}

        <h1 className="display-xl max-w-[26ch] text-[2rem] text-navy-ink sm:text-[2.5rem] lg:text-[3rem]">
          {title}
        </h1>

        {lede && (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/70">
            {lede}
          </p>
        )}

        {/* A plain hairline. The landing page carries no span-rules any more,
            so one here was the only place the piered deck line survived. */}
        <div className="mt-12 border-t border-navy-ink/15" />
      </div>
    </header>
  );
}

/**
 * A band of body copy set to a readable measure.
 *
 * The entries may be plain paragraphs (as they always were) or blocks of
 * admin-authored rich text; `RichText` normalises both, so every caller —
 * the legal pages, the donate and volunteer bands — gains formatting without
 * needing to know which kind it holds.
 */
export function Prose({
  paragraphs,
  className = "",
}: {
  paragraphs: string[];
  className?: string;
}) {
  return <RichText blocks={paragraphs} className={`max-w-2xl ${className}`} />;
}

/**
 * Label/value rows for registry and contact data. Ruled rather than boxed —
 * a ledger, which suits official information better than a table with borders.
 */
export function DataList({ rows }: { rows: Row[] }) {
  return (
    <dl className="grid gap-x-12 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-1 border-b border-navy-ink/12 py-4 sm:flex-row sm:items-baseline sm:gap-6"
        >
          <dt className="shrink-0 text-sm text-ink/70 sm:w-44">{row.label}</dt>
          <dd className="text-sm font-semibold text-navy-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A titled section on the deck line, used to break long pages into bands. */
export function PageSection({
  title,
  children,
  tone = "white",
  id,
}: {
  title?: string;
  children: React.ReactNode;
  tone?: "white" | "warm";
  id?: string;
}) {
  const headingId = useId();

  /*
    A `section` with no accessible name is a region a screen reader announces
    without being able to say what it is — worse than no landmark at all. When
    there is no title there is nothing to name it with, so the band renders as
    a plain element and the page's own headings carry the structure.
  */
  const Tag = title ? "section" : "div";

  return (
    <Tag
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={`${tone === "warm" ? "bg-paper-warm/50" : "bg-white"} py-16 lg:py-20`}
    >
      <div className="container-site">
        {title && (
          <h2
            id={headingId}
            className="display-xl mb-10 max-w-[24ch] border-b border-navy-ink/15 pb-8 text-2xl text-navy-ink sm:text-3xl"
          >
            {title}
          </h2>
        )}
        {/*
          No wrapper animation. Every section of every subpage was fading and
          rising identically because this one component wrapped all of them —
          the clearest case there is of motion applied by reflex rather than to
          describe anything. Cascades belong on lists, at the call site.
        */}
        {children}
      </div>
    </Tag>
  );
}

/** Numbered ledger of short items — values, uses, volunteer areas. */
export function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li
          key={item}
          className="flex items-baseline gap-4 border-b border-navy-ink/12 py-3.5"
        >
          <span className="font-display text-sm font-medium text-navy-ink/75">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-base font-semibold text-navy-ink">{item}</span>
        </li>
      ))}
    </ol>
  );
}
