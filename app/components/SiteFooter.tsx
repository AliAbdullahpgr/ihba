"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Mark } from "@/app/components/primitives";

export function SiteFooter() {
  const { t } = useI18n();
  const { headline } = t.hero;

  return (
    <footer id="contact" className="bg-paper-warm/60">
      <div className="container-site pt-16">
        {/* Mark and mission, restated — the page closes on the line it opened with. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-2">
            <img
              src="/brand/logo-horizontal.png"
              alt="IHBA"
              className="h-14 w-auto"
            />
          </div>

          <p className="font-display text-lg font-medium leading-relaxed text-navy-ink lg:col-span-5 lg:border-r lg:border-navy-ink/15 lg:pr-10">
            {headline.pre}
            <Mark tone="azure">{headline.highlight}</Mark>
            {headline.post}
          </p>

          <nav
            className="lg:col-span-4 lg:col-start-9"
            aria-label="Footer quick links"
          >
            <ul className="space-y-2.5 text-sm text-navy-ink/80">
              {[t.nav.about, t.nav.programs, t.nav.projects, t.nav.newsroom].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="transition-colors hover:text-azure-deep"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        {/* Link columns, divided by vertical rules. */}
        <div className="mt-14 grid gap-10 border-t border-navy-ink/15 pt-12 md:grid-cols-3 md:gap-0">
          {t.footer.columns.map((column, index) => (
            <div
              key={column.header}
              className={`md:px-10 ${
                index === 0 ? "md:pl-0" : "md:border-l md:border-navy-ink/15"
              }`}
            >
              <h3 className="font-display text-base font-medium text-navy-ink">
                {column.header}
              </h3>
              <ul className="mt-5 space-y-2.5 text-sm text-navy-ink/70">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="transition-colors hover:text-azure-deep"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>

              {index === 0 && (
                <address className="mt-8 space-y-2.5 text-sm not-italic text-navy-ink/70">
                  <span className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep"
                      aria-hidden="true"
                    />
                    {t.footer.addressLine}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone
                      className="h-4 w-4 shrink-0 text-gold-deep"
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
                      className="h-4 w-4 shrink-0 text-gold-deep"
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

        {/* Accountability row. */}
        <div className="mt-12 grid gap-8 border-t border-navy-ink/15 pt-10 text-sm text-navy-ink/70 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-semibold text-navy-ink">
              {t.footer.reportTitle}
            </p>
            <p className="mt-2 leading-relaxed">{t.footer.reportCopy}</p>
          </div>
          <div>
            <p className="font-semibold text-navy-ink">
              {t.footer.contactLabel}
            </p>
            <a
              href={`mailto:${t.utility.email}`}
              className="mt-2 inline-block underline decoration-navy-ink/30 underline-offset-4 transition-colors hover:text-azure-deep"
            >
              {t.utility.email}
            </a>
          </div>
          <p className="leading-relaxed lg:text-right">
            {t.footer.transparency}
          </p>
        </div>

        {/* Legal row. */}
        <div className="mt-10 flex flex-col gap-4 border-t border-navy-ink/15 py-6 text-xs text-navy-ink/55 md:flex-row md:items-center md:justify-between">
          <p>{t.footer.copyright}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {t.footer.legal.map((item) => (
              <li key={item}>
                <a
                  href="#top"
                  className="transition-colors hover:text-azure-deep"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
