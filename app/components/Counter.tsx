"use client";

import { useEffect, useRef, useState } from "react";

/** Splits "1.200+" into its numeric core and whatever brackets it. */
function parse(raw: string) {
  const match = raw.match(/^(\D*)([\d.,\s]+)(\D*)$/);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/[.,\s]/g, ""));
  if (!Number.isFinite(target)) return null;

  return { prefix, suffix, target };
}

function isYear(n: number) {
  return Number.isInteger(n) && n >= 1900 && n <= 2100;
}

/**
 * A figure that counts up the first time it scrolls into view.
 *
 * Years are left alone — watching 1970 tick up to 2025 reads as a loading bar,
 * not as an achievement — and so are single digits, where the animation is over
 * before the eye lands on it. Everything else counts, which means the strip
 * comes alive on its own as real programme numbers replace the founding facts.
 */
export function Counter({
  value,
  locale,
  className = "",
}: {
  value: string;
  locale: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const parsed = parse(value);
  const target = parsed?.target ?? 0;
  const animatable = parsed !== null && target >= 10 && !isYear(target);
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !animatable) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Arm from zero only once we know JS and motion are both available, so a
    // no-script or reduced-motion reader keeps the final figure in the markup.
    setDisplay(0);

    let frame = 0;
    let start: number | null = null;
    const duration = 1600;

    const step = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo: fast off the mark, then settling — this reads as counting
      // rather than as a linear meter filling up.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [animatable, target]);

  if (!parsed || !animatable) {
    return <span className={className}>{value}</span>;
  }

  return (
    // tabular-nums so digits keep a fixed advance width and the figure doesn't
    // shuffle sideways while it counts.
    <span ref={ref} className={`tabular-nums ${className}`}>
      {parsed.prefix}
      {(display ?? target).toLocaleString(locale)}
      {parsed.suffix}
    </span>
  );
}
