"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { SocialRow } from "@/app/components/SocialRow";

/**
 * Compact, the way most NGO footers are: logo and one-line remit, three
 * link columns, contact address, social icons, one legal bar. No headline
 * quote and no separate governance block — the transparency note is folded
 * into a single small line so the essential info still ships without the
 * extra vertical rows a marketing-style footer used to carry.
 */
export function SiteFooter() {
  const { t } = useI18n();

  const columns = [
    {
      header: t.nav.about,
      links: [
        { href: "/about", label: t.aboutPage.title },
        { href: "/president", label: t.presidentPage.title },
        { href: "/board", label: t.boardPage.title },
      ],
    },
    {
      header: t.nav.projects,
      links: [
        { href: "/projects", label: t.nav.projects },
        { href: "/areas-of-work", label: t.nav.areas },
        { href: "/news", label: t.nav.news },
        { href: "/gallery", label: t.nav.gallery },
      ],
    },
    {
      header: t.nav.contact,
      links: [
        { href: "/donate", label: t.nav.donate },
        { href: "/volunteer", label: t.nav.volunteer },
        { href: "/contact", label: t.nav.contact },
      ],
    },
  ];

  return (
    <footer className="bg-paper-warm/60">
      <div className="container-site pt-12">
        <div className="grid gap-10 border-b border-navy-ink/15 pb-10 md:grid-cols-9">
          {/* Logo, one-line remit, address and social — the block a visitor
              actually looks for in a footer. */}
          <div className="md:col-span-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="IHBA"
              width={160}
              height={45}
              className="h-10 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-ink/70">
              {t.utility.tagline}
            </p>

            <address className="mt-5 space-y-2 text-sm not-italic text-navy-ink/70">
              <span className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink"
                  aria-hidden="true"
                />
                {t.footer.addressLine}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                <a
                  href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-azure-deep"
                >
                  {t.utility.phone}
                </a>
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
                <a
                  href={`mailto:${t.utility.email}`}
                  className="transition-colors hover:text-azure-deep"
                >
                  {t.utility.email}
                </a>
              </span>
            </address>

            <SocialRow className="mt-5" />
          </div>

          {columns.map((column) => (
            <div key={column.header} className="md:col-span-2">
              <h2 className="text-sm font-semibold text-navy-ink">
                {column.header}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-navy-ink/70">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-azure-deep"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 py-6 text-xs text-navy-ink/70 lg:flex-row lg:items-center lg:justify-between">
          <p>{t.footer.copyright}</p>
          <p className="max-w-xl leading-relaxed">{t.footer.transparency}</p>
          <nav aria-label={t.legalPages.privacy.title}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link className="transition-colors hover:text-azure-deep" href="/kvkk">
                  {t.legalPages.kvkk.title}
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-azure-deep"
                  href="/privacy-policy"
                >
                  {t.legalPages.privacy.title}
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-azure-deep"
                  href="/cookie-policy"
                >
                  {t.legalPages.cookies.title}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
