"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { Button } from "@/app/components/primitives";

/**
 * Homepage contact summary, sitting just before the global footer.
 *
 * A light band: the three direct routes (email, phone, address) condensed to
 * one line each, plus a single button to the full /contact page where the form
 * lives. Intentionally does not duplicate the footer's contact column — this
 * section is the destination the homepage "contact" nav points at, the footer
 * is the always-present recap.
 */
export function ContactSection() {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="contact-title"
      className="bg-paper-warm/50 py-20 lg:py-28"
    >
      <div className="container-site">
        <h2
          id="contact-title"
          className="display-xl max-w-[24ch] text-3xl text-navy-ink sm:text-4xl"
        >
          {t.contactSection.title}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
          {t.contactSection.lede}
        </p>

        <dl className="mt-12 grid gap-x-8 gap-y-8 border-t border-navy-ink/15 pt-10 sm:grid-cols-3 sm:gap-0">
          <div className="sm:px-8 sm:first:pl-0 sm:border-l sm:border-navy-ink/15 sm:first:border-0">
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <Mail className="h-4 w-4 text-gold-ink" aria-hidden="true" />
              {t.contactPage.rows[1].label}
            </dt>
            <dd className="mt-3">
              <a
                href={`mailto:${t.utility.email}`}
                className="font-display text-lg font-medium text-navy-ink transition-colors hover:text-azure-deep"
              >
                {t.utility.email}
              </a>
            </dd>
          </div>

          <div className="sm:px-8 sm:border-l sm:border-navy-ink/15">
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <Phone className="h-4 w-4 text-gold-ink" aria-hidden="true" />
              {t.contactPage.rows[0].label}
            </dt>
            <dd className="mt-3">
              <a
                href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
                className="font-display text-lg font-medium text-navy-ink transition-colors hover:text-azure-deep"
              >
                {t.utility.phone}
              </a>
            </dd>
          </div>

          <div className="sm:px-8 sm:border-l sm:border-navy-ink/15">
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <MapPin className="h-4 w-4 text-gold-ink" aria-hidden="true" />
              {t.contactPage.addressLabel}
            </dt>
            <dd className="mt-3 max-w-xs text-base leading-relaxed text-ink/70">
              {t.footer.addressLine}
            </dd>
          </div>
        </dl>

        <div className="mt-12">
          <Button href="/contact">{t.contactSection.cta}</Button>
        </div>
      </div>
    </section>
  );
}