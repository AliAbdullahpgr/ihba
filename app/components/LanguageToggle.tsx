"use client";

import { useI18n } from "@/app/components/LanguageProvider";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div className={`flex items-center gap-1 text-xs font-bold ${className}`}>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-1 transition-colors ${
          lang === "en" ? "text-gold-deep" : "text-current hover:text-azure-deep"
        }`}
      >
        EN
      </button>
      <span className="text-current/40" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLang("tr")}
        aria-pressed={lang === "tr"}
        className={`px-1 transition-colors ${
          lang === "tr" ? "text-gold-deep" : "text-current hover:text-azure-deep"
        }`}
      >
        TR
      </button>
    </div>
  );
}
