"use client";

import { Mail, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div className={`flex items-center gap-1 text-xs font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-1 transition-colors ${
          lang === "en" ? "text-gold font-bold" : "text-current hover:text-gold"
        }`}
      >
        EN
      </button>
      <span aria-hidden="true">|</span>
      <button
        type="button"
        onClick={() => setLang("tr")}
        aria-pressed={lang === "tr"}
        className={`px-1 transition-colors ${
          lang === "tr" ? "text-gold font-bold" : "text-current hover:text-gold"
        }`}
      >
        TR
      </button>
    </div>
  );
}

export function TopStrip() {
  const { t } = useI18n();

  return (
    <div className="hidden md:block bg-navy-deep text-white/75">
      <div className="container-site flex items-center justify-between py-2 text-xs">
        <p className="font-medium">{t.utility.tagline}</p>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${t.utility.email}`}
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {t.utility.email}
          </a>
          <a
            href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {t.utility.phone}
          </a>
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
