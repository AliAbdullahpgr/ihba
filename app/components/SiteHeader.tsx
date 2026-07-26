"use client";

import { useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { LanguageToggle } from "@/app/components/LanguageToggle";

const navAnchors = [
  { key: "about", href: "#about" },
  { key: "programs", href: "#programs" },
  { key: "projects", href: "#projects" },
  { key: "approach", href: "#approach" },
] as const;

export function SiteHeader() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLabels: Record<(typeof navAnchors)[number]["key"], string> = {
    about: t.nav.about,
    programs: t.nav.programs,
    projects: t.nav.projects,
    approach: t.nav.approach,
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Tier one — identity and the three destination buttons. */}
      <div className="container-site flex items-center justify-between gap-6 py-4">
        <a href="#top" className="shrink-0">
          <img
            src="/brand/logo-horizontal.png"
            alt="IHBA"
            className="h-10 w-auto lg:h-11"
          />
        </a>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 border border-navy-ink px-4 py-2.5 text-sm font-bold text-navy-ink transition-colors hover:bg-paper-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            {t.nav.explore}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#projects"
            className="inline-flex items-center border border-navy-ink px-4 py-2.5 text-sm font-bold text-navy-ink transition-colors hover:bg-paper-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            {t.nav.newsroom}
          </a>
          <a
            href="#donate"
            className="inline-flex items-center bg-navy-deep px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            {t.nav.donate}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          className="inline-flex size-10 items-center justify-center text-navy-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
        >
          {menuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Tier two — sections on the left, utilities on the right, hairline-bounded. */}
      <div className="hidden border-y border-line md:block">
        <div className="container-site flex items-center justify-between gap-6">
          <nav className="flex items-center gap-8" aria-label="Primary">
            {navAnchors.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="border-b-2 border-transparent py-3.5 text-sm font-bold text-navy-ink transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
              >
                {navLabels[item.key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6 py-3.5 text-sm text-navy-ink/70">
            <a
              href="#contact"
              className="hidden transition-colors hover:text-azure-deep lg:inline"
            >
              {t.nav.transparency}
            </a>
            <a
              href="#contact"
              className="hidden transition-colors hover:text-azure-deep lg:inline"
            >
              {t.nav.contact}
            </a>
            <LanguageToggle />
            <button
              type="button"
              aria-label={t.nav.search}
              className="text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-y border-line bg-white md:hidden">
          <nav className="container-site flex flex-col py-2" aria-label="Mobile">
            {navAnchors.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line py-3.5 text-base font-bold text-navy-ink"
              >
                {navLabels[item.key]}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-3.5 text-base font-bold text-navy-ink"
            >
              {t.nav.contact}
            </a>
            <div className="flex items-center justify-between gap-4 py-4">
              <LanguageToggle />
              <a
                href="#donate"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center bg-navy-deep px-5 py-2.5 text-sm font-bold text-white"
              >
                {t.nav.donate}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
