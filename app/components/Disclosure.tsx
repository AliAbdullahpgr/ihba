"use client";

import { Plus } from "lucide-react";
import type React from "react";

/**
 * One accordion row, built on the native <details>/summary> element.
 *
 * Native disclosure gives keyboard, screen-reader and reduced-motion support
 * for free: Enter/Space toggles, the summary is a button in the a11y tree, and
 * the open state is announced. The only added behaviour is the icon rotation,
 * which is decorative and gated by `motion-reduce`.
 *
 * Square, one-pixel rules, 44px summary target — the same vocabulary as the
 * rest of the editorial system. Used by the homepage's areas, mission and FAQ
 * accordions so all three share one interaction.
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = "",
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={`group border-b border-navy-ink/15 ${className}`}
    >
      <summary
        className="
          flex min-h-11 cursor-pointer items-center gap-4 py-4 pr-3
          text-left transition-colors
          hover:bg-white/60 focus-visible:bg-white/60
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure
        "
      >
        <Plus
          className="
            size-5 shrink-0 text-navy-ink/70
            transition-transform duration-200 ease-out motion-reduce:transition-none
            group-open:rotate-45
          "
          aria-hidden="true"
        />
        <span className="flex-1">{summary}</span>
      </summary>
      {/*
        `details` manages open/close without JS, so the panel stays mounted
        while collapsed. The slight top padding keeps prose off the summary.
      */}
      <div className="pb-6 pr-3 motion-safe:animate-[disclosure-in_200ms_ease-out]">
        {children}
      </div>
    </details>
  );
}