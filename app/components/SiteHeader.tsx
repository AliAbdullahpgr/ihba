"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { LanguageToggle } from "@/app/components/LanguageToggle";

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/about", label: t.nav.about },
    { href: "/areas-of-work", label: t.nav.areas },
    { href: "/projects", label: t.nav.projects },
    { href: "/news", label: t.nav.news },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-ink bg-white">
      <div className="container-site flex items-center gap-8 py-4">
        <Link href="/" className="shrink-0" aria-label="IHBA">
          <img
            src="/brand/logo-horizontal.png"
            alt="IHBA"
            className="h-10 w-auto"
          />
        </Link>

        <nav
          className="hidden flex-1 items-center gap-7 lg:flex"
          aria-label="Primary"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`border-b-2 py-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure ${
                isActive(link.href)
                  ? "border-gold text-navy-ink"
                  : "border-transparent text-navy-ink/75 hover:text-navy-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5 lg:ml-0">
          <LanguageToggle className="text-navy-ink/70" />
          <Link
            href="/donate"
            className="hidden items-center bg-navy-deep px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure sm:inline-flex"
          >
            {t.nav.donate}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="inline-flex size-10 items-center justify-center text-navy-ink lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
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
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="container-site flex flex-col py-2" aria-label="Mobile">
            {[
              ...links,
              { href: "/president", label: t.nav.president },
              { href: "/board", label: t.nav.board },
              { href: "/volunteer", label: t.nav.volunteer },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="border-b border-line py-3.5 text-base font-bold text-navy-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center bg-navy-deep px-5 py-3 text-sm font-bold text-white"
            >
              {t.nav.donate}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
