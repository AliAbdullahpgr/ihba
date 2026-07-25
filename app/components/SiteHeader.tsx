"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { LanguageToggle, TopStrip } from "@/app/components/TopStrip";

const navAnchors = [
  { key: "about", href: "#about" },
  { key: "programs", href: "#programs" },
  { key: "projects", href: "#projects" },
  { key: "approach", href: "#approach" },
  { key: "contact", href: "#contact" },
] as const;

export function SiteHeader() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLabels: Record<(typeof navAnchors)[number]["key"], string> = {
    about: t.nav.about,
    programs: t.nav.programs,
    projects: t.nav.projects,
    approach: t.nav.approach,
    contact: t.nav.contact,
  };

  return (
    <>
      <TopStrip />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line">
        <div className="container-site flex items-center justify-between py-3">
          <a href="#top" className="shrink-0">
            <img
              src="/brand/logo-horizontal.png"
              alt="IHBA"
              className="h-10 w-auto lg:h-12"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {navAnchors.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-sm font-semibold text-navy/80 hover:text-azure-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure rounded-sm"
              >
                {navLabels[item.key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageToggle className="hidden md:flex text-navy/70" />
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              {t.nav.donate}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
            >
              {menuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-line bg-white shadow-lg">
            <nav
              className="container-site flex flex-col gap-1 py-4"
              aria-label="Mobile"
            >
              {navAnchors.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2.5 text-base font-semibold text-navy/80 hover:bg-paper-warm hover:text-azure-deep transition-colors"
                >
                  {navLabels[item.key]}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gold-deep"
              >
                {t.nav.donate}
              </a>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="text-sm text-navy/60">{t.utility.tagline}</span>
                <LanguageToggle className="text-navy/70" />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
