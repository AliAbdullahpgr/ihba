"use client";

import { useRef, useState } from "react";
import { Prose } from "@/app/components/PageShell";
import type { PrinciplePanel } from "@/lib/content";

/**
 * The standards behind the work — ethics, integrity, compliance, oversight —
 * as a switchable ledger rather than four separate pages. The index sits on the
 * left so the whole set of commitments is visible at once, and only the reading
 * matter changes when a topic is chosen.
 */
export function PrinciplesTabs({
  panels,
  navLabel,
}: {
  panels: PrinciplePanel[];
  navLabel: string;
}) {
  const [activeKey, setActiveKey] = useState(panels[0]?.key ?? "");
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = Math.max(
    0,
    panels.findIndex((panel) => panel.key === activeKey)
  );
  const active = panels[activeIndex];

  if (!active) return null;

  /* Roving focus, so the index behaves like the tab list it is announced as. */
  const move = (nextIndex: number) => {
    const bounded = (nextIndex + panels.length) % panels.length;
    setActiveKey(panels[bounded].key);
    buttonsRef.current[bounded]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    if (event.key in step) {
      event.preventDefault();
      move(activeIndex + step[event.key]);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(panels.length - 1);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div
        role="tablist"
        aria-label={navLabel}
        aria-orientation="vertical"
        className="lg:col-span-4"
      >
        {panels.map((panel, index) => {
          const isActive = panel.key === active.key;
          return (
            <button
              key={panel.key}
              ref={(node) => {
                buttonsRef.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`principle-tab-${panel.key}`}
              aria-selected={isActive}
              aria-controls={`principle-panel-${panel.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveKey(panel.key)}
              onKeyDown={onKeyDown}
              className={`flex w-full items-baseline gap-4 border-b border-navy-ink/12 py-4 pr-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure ${
                isActive
                  ? "border-l-2 border-l-gold-deep pl-4"
                  : "pl-4 hover:bg-white/60"
              }`}
            >
              <span
                className={`font-display text-sm font-medium ${
                  isActive ? "text-gold-deep" : "text-navy-ink/35"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-base font-semibold ${
                  isActive ? "text-navy-ink" : "text-navy-ink/60"
                }`}
              >
                {panel.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`principle-panel-${active.key}`}
        aria-labelledby={`principle-tab-${active.key}`}
        tabIndex={0}
        className="lg:col-span-7 lg:col-start-6"
      >
        <h3 className="font-display text-xl font-medium text-navy-ink sm:text-2xl">
          {active.heading}
        </h3>
        <Prose paragraphs={active.paragraphs} className="mt-6" />
      </div>
    </div>
  );
}
