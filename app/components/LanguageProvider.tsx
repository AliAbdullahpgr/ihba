"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, type Lang } from "@/lib/i18n";
import { content } from "@/lib/content";
import { bundledMedia, type SiteMedia } from "@/lib/media";

/** Everything a page needs to read: homepage copy plus deeper page content. */
export type Copy = (typeof dict)[Lang] &
  (typeof content)[Lang] & { media: SiteMedia };

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "ihba-lang";

export function LanguageProvider({
  children,
  initialCopies,
}: {
  children: React.ReactNode;
  initialCopies?: Record<Lang, Copy>;
}) {
  const [lang, setLang] = useState<Lang>("tr");

  /*
    Read the stored preference after mount rather than during render: the server
    prerenders every route as Turkish, so touching localStorage earlier would
    produce a hydration mismatch.
  */
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "tr") setLang(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t:
        initialCopies?.[lang] ?? {
          ...dict[lang],
          ...content[lang],
          media: bundledMedia,
        },
    }),
    [initialCopies, lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return ctx;
}
