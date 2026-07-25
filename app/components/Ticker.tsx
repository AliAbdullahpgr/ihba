"use client";

import { useI18n } from "@/app/components/LanguageProvider";

export function Ticker() {
  const { t } = useI18n();
  const items = t.ticker.items;

  return (
    <div className="bg-navy-deep py-3.5 overflow-hidden">
      <div className="flex w-max animate-marquee gap-8" aria-hidden="true">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.2em] text-gold/90 whitespace-nowrap"
          >
            {item} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
