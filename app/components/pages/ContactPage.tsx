"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink } from "@/app/components/primitives";
import { DataList, PageHeader, PageSection } from "@/app/components/PageShell";
import { SocialRow } from "@/app/components/SocialRow";
import { socialLinks } from "@/lib/content";

export function ContactPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.contactPage.title} lede={t.contactPage.lede} />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* The two direct routes, given weight rather than buried in a table. */}
          <div className="lg:col-span-5">
            <div className="border-t border-navy-ink/40 pt-8 space-y-8">
              <div>
                <p className="eyebrow text-ink/50">
                  {t.contactPage.rows[1].label}
                </p>
                <a
                  href={`mailto:${t.utility.email}`}
                  className="group mt-3 flex items-center gap-3 font-display text-xl font-medium text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                >
                  <Mail
                    className="h-5 w-5 shrink-0 text-gold-deep"
                    aria-hidden="true"
                  />
                  {t.utility.email}
                </a>
              </div>

              <div>
                <p className="eyebrow text-ink/50">
                  {t.contactPage.rows[0].label}
                </p>
                <a
                  href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
                  className="mt-3 flex items-center gap-3 font-display text-xl font-medium text-navy-ink transition-colors hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                >
                  <Phone
                    className="h-5 w-5 shrink-0 text-gold-deep"
                    aria-hidden="true"
                  />
                  {t.utility.phone}
                </a>
              </div>

              <div>
                <p className="eyebrow text-ink/50">
                  {t.contactPage.addressLabel}
                </p>
                <address className="mt-3 flex items-start gap-3 text-base not-italic leading-relaxed text-ink/75">
                  <MapPin
                    className="mt-1 h-5 w-5 shrink-0 text-gold-deep"
                    aria-hidden="true"
                  />
                  {t.contactPage.address}
                </address>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-10 border-t border-navy-ink/15 pt-5">
                <SocialRow />
              </div>
            )}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border-t border-navy-ink/40 pt-8">
              <DataList rows={t.contactPage.rows} />
            </div>
          </div>
        </div>
      </section>

      <PageSection title={t.identity.title} tone="warm">
        <DataList rows={t.identity.rows} />
        <div className="mt-10">
          <ArrowLink href="/about">{t.aboutPage.title}</ArrowLink>
        </div>
      </PageSection>
    </>
  );
}
