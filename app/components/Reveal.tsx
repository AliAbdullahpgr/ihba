"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/*
  Arming has to happen before the browser paints, or the reader sees the content
  flash in and then get hidden again. `useLayoutEffect` does that but warns
  during server rendering, where it is meaningless — so the server gets the
  passive version and the browser gets the blocking one.
*/
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Scroll-triggered fade-and-rise, layered over content that is already visible.
 *
 * The server renders the children at full opacity. The hidden state is applied
 * on the client, before first paint, and only once we know an observer exists
 * to take it back off again. Previously the `opacity-0` was in the server
 * markup itself, so anything that never ran the effect — JavaScript disabled, a
 * crawler, a headless renderer, a tab backgrounded before the observer fired —
 * got a page whose every section below the hero was invisible.
 *
 * `delay` staggers a group: pass `delay={index * 80}` over a grid and the items
 * cascade instead of arriving as one block. It is a transition delay rather
 * than a timer, so reduced motion drops the transition and the delay with it.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState(false);

  useBeforePaint(() => {
    const node = ref.current;
    if (!node) return;

    // No observer, or the reader asked for less motion: leave the content
    // exactly as the server rendered it and never arm the hidden state.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Already on screen at first paint — arming it would hide something the
    // reader is looking at, then fade it back in. Above-the-fold content is
    // simply left alone.
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      // Only opacity and transform — `transition-all` also watches the layout
      // properties, which are the expensive ones to interpolate.
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
