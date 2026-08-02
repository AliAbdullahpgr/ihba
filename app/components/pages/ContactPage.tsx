"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink } from "@/app/components/primitives";
import { ContactForm } from "@/app/components/ContactForm";
import { DataList, PageHeader, PageSection } from "@/app/components/PageShell";
import { SocialRow } from "@/app/components/SocialRow";

export function ContactPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.contactPage.title} lede={t.contactPage.lede} />

      {/*
        Neither route below is the section's name — the contact block and the
        form each carry their own heading — so this band is a plain div rather
        than a section with nothing to point aria-labelledby at.
      */}
      <div className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* The two direct routes, given weight rather than buried in a table. */}
          <div className="lg:col-span-5">
            {/* Term/value pairs are exactly what a contact block is, so this
                is a dl rather than a stack of styled divs. */}
            <dl className="border-t border-navy-ink/40 pt-8 space-y-8">
              <div>
                <dt className="text-sm font-semibold text-ink/70">
                  {t.contactPage.rows[1].label}
                </dt>
                <dd className="mt-3">
                  <a
                    href={`mailto:${t.utility.email}`}
                    className="group flex min-h-11 items-center gap-3 font-display text-xl font-medium text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                  >
                    <Mail
                      className="h-5 w-5 shrink-0 text-gold-ink"
                      aria-hidden="true"
                    />
                    {t.utility.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-ink/70">
                  {t.contactPage.rows[0].label}
                </dt>
                <dd className="mt-3">
                  <a
                    href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
                    className="flex min-h-11 items-center gap-3 font-display text-xl font-medium text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                  >
                    <Phone
                      className="h-5 w-5 shrink-0 text-gold-ink"
                      aria-hidden="true"
                    />
                    {t.utility.phone}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-semibold text-ink/70">
                  {t.contactPage.addressLabel}
                </dt>
                <dd className="mt-3">
                  <address className="flex items-start gap-3 text-base not-italic leading-relaxed text-ink/75">
                    <MapPin
                      className="mt-1 h-5 w-5 shrink-0 text-gold-ink"
                      aria-hidden="true"
                    />
                    {t.contactPage.address}
                  </address>
                </dd>
              </div>
            </dl>

            {t.socialLinks.some((profile) => profile.active && profile.url) && (
              <div className="mt-10 border-t border-navy-ink/15 pt-5">
                <SocialRow />
              </div>
            )}
          </div>

          {/* The form gets the wider bank: writing to us is the point of the page. */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-navy-ink/40 pt-8">
              <h2 className="display-xl mb-8 text-xl text-navy-ink sm:text-2xl">
                {t.contactPage.formTitle}
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <PageSection title={t.identity.title} tone="warm">
        <DataList rows={t.identity.rows} />
        <div className="mt-10">
          <ArrowLink href="/about">{t.aboutPage.title}</ArrowLink>
        </div>
      </PageSection>
    </>
  );
}
