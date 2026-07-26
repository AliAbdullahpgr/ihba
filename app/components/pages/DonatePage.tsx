"use client";

import { Mail, Phone } from "lucide-react";
import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink, Button } from "@/app/components/primitives";
import {
  NumberedList,
  PageHeader,
  PageSection,
  Prose,
} from "@/app/components/PageShell";

export function DonatePage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.donatePage.title} lede={t.donatePage.lede} />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Prose paragraphs={t.donatePage.body} />

            {/*
              Bank details are not published yet, so the page states that plainly
              and gives the direct route instead of a dead form.
            */}
            <div className="mt-10 border-l-2 border-gold pl-5">
              <p className="text-sm leading-relaxed text-ink/70">
                {t.donatePage.accountsNote}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={`mailto:${t.utility.email}`}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t.utility.email}
              </Button>
              <Button
                href={`tel:${t.utility.phone.replace(/\s+/g, "")}`}
                variant="outline"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t.utility.phone}
              </Button>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <img
              src={t.media.ramadanProgramme.url}
              alt="Community volunteers preparing food parcels and shared meals"
              className="arch aspect-[4/5] w-full object-cover"
            />
          </aside>
        </div>
      </section>

      <PageSection title={t.donatePage.usesLabel} tone="warm">
        <NumberedList items={t.donatePage.uses} />

        <div className="mt-12 border-t border-navy-ink/15">
          <div className="grid gap-8 pt-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-medium text-navy-ink">
                {t.volunteerPage.title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
                {t.volunteerPage.lede}
              </p>
              <ArrowLink href="/volunteer" className="mt-5">
                {t.volunteerPage.title}
              </ArrowLink>
            </div>
            <div>
              <h3 className="font-display text-lg font-medium text-navy-ink">
                {t.identity.title}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
                {t.footer.transparency}
              </p>
              <ArrowLink href="/about" className="mt-5">
                {t.identity.title}
              </ArrowLink>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
