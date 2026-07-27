"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Mark } from "@/app/components/primitives";

/**
 * Three columns, one destination each, nothing said twice.
 *
 * The footer carried four rows and eighteen links, and most of them were
 * repeats: a five-item "quick links" nav above three link columns that already
 * held projects, news and gallery; four separate links whose href was all
 * `/areas-of-work`; the three project detail pages listed individually; and the
 * contact email appearing three times in three different rows. Columns are now
 * top-level destinations only, the address block is the single place contact
 * details live, and the governance note sits on one line above the legal rule.
 */
export function SiteFooter() {
  const { t } = useI18n();
  const { headline } = t.hero;

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
      <div className="container-site pt-16">
        {/* The page closes on the line it opened with. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Image
              src="/brand/logo-horizontal.png"
              alt="IHBA"
              width={200}
              height={56}
              className="h-14 w-auto"
            />
          </div>

          <p className="font-display text-lg font-medium leading-relaxed text-navy-ink lg:col-span-8 lg:col-start-5">
            {headline.pre}
            <Mark tone="azure">{headline.highlight}</Mark>
            {headline.post}
          </p>
        </div>

        <div className="mt-14 grid gap-10 border-t border-navy-ink/15 pt-12 md:grid-cols-3 md:gap-0">
          {columns.map((column, index) => (
            <div
              key={column.header}
              className={`md:px-10 ${
                index === 0 ? "md:pl-0" : "md:border-l md:border-navy-ink/15"
              }`}
            >
              <h2 className="font-display text-base font-medium text-navy-ink">
                {column.header}
              </h2>
              <ul className="mt-5 space-y-2.5 text-sm text-navy-ink/70">
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

              {/* Contact details live here and only here. */}
              {index === 2 && (
                <address className="mt-8 space-y-2.5 text-sm not-italic text-navy-ink/70">
                  <span className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink"
                      aria-hidden="true"
                    />
                    {t.footer.addressLine}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone
                      className="h-4 w-4 shrink-0 text-gold-ink"
                      aria-hidden="true"
                    />
                    <a
                      href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
                      className="underline decoration-navy-ink/30 underline-offset-4 transition-colors hover:text-azure-deep"
                    >
                      {t.utility.phone}
                    </a>
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail
                      className="h-4 w-4 shrink-0 text-gold-ink"
                      aria-hidden="true"
                    />
                    <a
                      href={`mailto:${t.utility.email}`}
                      className="underline decoration-navy-ink/30 underline-offset-4 transition-colors hover:text-azure-deep"
                    >
                      {t.utility.email}
                    </a>
                  </span>
                </address>
              )}
            </div>
          ))}
        </div>

        {/*
          Governance, on one line. This was a three-column row whose middle
          column was a second copy of the contact email.
        */}
        <div className="mt-12 grid gap-8 border-t border-navy-ink/15 pt-10 text-sm text-navy-ink/70 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-semibold text-navy-ink">
              {t.footer.reportTitle}
            </p>
            <p className="mt-2 leading-relaxed">{t.footer.reportCopy}</p>
          </div>
          <p className="leading-relaxed">{t.footer.transparency}</p>
        </div>

        {/*
          Legal row. The Terms / Privacy / Transparency / Media links that used
          to sit here all pointed at /contact because no such pages exist — a
          link that lands somewhere unrelated is worse than no link, so the row
          carries the copyright and the registry line only.
        */}
        <div className="mt-10 flex flex-col gap-2 border-t border-navy-ink/15 py-6 text-xs text-navy-ink/70 md:flex-row md:items-center md:justify-between">
          <p>{t.footer.copyright}</p>
          <p>{t.utility.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
