"use client";

import { useI18n } from "@/app/components/LanguageProvider";

export function Ticker() {
  const { t } = useI18n();
  const items = t.ticker.items;

  return (
    <div className="overflow-hidden border-y border-navy-ink bg-white py-3">
      <div className="flex w-max animate-marquee gap-10" aria-hidden="true">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-10 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-navy-ink"
          >
            {item}
            <span className="size-1.5 shrink-0 bg-gold" />
          </span>
        ))}
      </div>
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
