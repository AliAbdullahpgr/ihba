"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { LanguageToggle } from "@/app/components/LanguageToggle";

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

export function SiteHeader() {
  const { t, lang } = useI18n();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  /* Which desktop dropdown is open, keyed by its top-level href. */
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  /*
    Every child label is an existing dictionary entry — the dropdowns surface
    pages that already exist rather than introducing new copy to translate.
  */
  const links: NavLink[] = [
    {
      href: "/about",
      label: t.nav.about,
      children: [
        { href: "/about", label: t.aboutPage.title },
        { href: "/president", label: t.nav.president },
        { href: "/board", label: t.nav.board },
      ],
    },
    {
      href: "/areas-of-work",
      label: t.nav.areas,
      children: t.areasPage.items
        .slice(0, 4)
        .map((item) => ({ href: "/areas-of-work", label: item.title })),
    },
    {
      href: "/projects",
      label: t.nav.projects,
      children: [
        { href: "/projects", label: t.common.backToProjects },
        ...t.projectsPage.details.map((project) => ({
          href: `/projects/${project.slug}`,
          label: project.title,
        })),
      ],
    },
    { href: "/news", label: t.nav.news },
    {
      href: "/gallery",
      label: t.nav.gallery ?? (lang === "tr" ? "Galeri" : "Gallery"),
    },
    {
      href: "/contact",
      label: t.nav.contact,
      children: [
        { href: "/contact", label: t.contactPage.title },
        { href: "/volunteer", label: t.nav.volunteer },
        { href: "/donate", label: t.nav.donate },
      ],
    },
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
          {links.map((link) => {
            const open = openDrop === link.href;

            return (
              /*
                Hover opens it, focus opens it, Escape and leaving the group
                close it — so the panel is reachable by pointer and by keyboard
                without turning the top-level label into a non-link.
              */
              <div
                key={link.href}
                className="relative"
                onMouseEnter={
                  link.children ? () => setOpenDrop(link.href) : undefined
                }
                onMouseLeave={
                  link.children ? () => setOpenDrop(null) : undefined
                }
                onFocus={
                  link.children ? () => setOpenDrop(link.href) : undefined
                }
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setOpenDrop(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setOpenDrop(null);
                  if (event.key === "ArrowDown" && link.children) {
                    event.preventDefault();
                    setOpenDrop(link.href);
                  }
                }}
              >
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  aria-expanded={link.children ? open : undefined}
                  className={`flex items-center gap-1.5 border-b-2 py-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure ${
                    isActive(link.href)
                      ? "border-gold text-navy-ink"
                      : "border-transparent text-navy-ink/75 hover:text-navy-ink"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {link.children && open && (
                  /* pt-2 keeps the pointer path unbroken between label and panel. */
                  <div className="absolute left-0 top-full pt-2">
                    <ul className="min-w-[16rem] border border-navy-ink bg-white py-1 shadow-[6px_6px_0_0_rgba(16,24,40,0.08)]">
                      {link.children.map((child) => (
                        <li key={`${child.href}-${child.label}`}>
                          <Link
                            href={child.href}
                            onClick={() => setOpenDrop(null)}
                            className="block px-4 py-2.5 text-sm leading-snug text-navy-ink/80 transition-colors hover:bg-paper-warm hover:text-navy-ink focus-visible:outline-none focus-visible:bg-paper-warm focus-visible:text-navy-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
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
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <nav className="container-site flex flex-col py-2" aria-label="Mobile">
            {/*
              No accordions on mobile: the sub-pages sit indented under their
              parent, so nothing needs a second tap to be discovered.
            */}
            {links.map((link) => (
              <div key={link.href} className="border-b border-line py-3">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="block text-base font-bold text-navy-ink"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <ul className="mt-2 space-y-1 border-l border-navy-ink/15 pl-4">
                    {link.children.map((child) => (
                      <li key={`${child.href}-${child.label}`}>
                        <Link
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="block py-1.5 text-sm text-navy-ink/70"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="mt-4 mb-2 inline-flex items-center justify-center bg-navy-deep px-5 py-3 text-sm font-bold text-white"
            >
              {t.nav.donate}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
