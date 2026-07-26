"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { ArrowLink } from "@/app/components/primitives";
import { Figure } from "@/app/components/Lightbox";
import { VolunteerForm } from "@/app/components/VolunteerForm";
import {
  NumberedList,
  PageHeader,
  PageSection,
  Prose,
} from "@/app/components/PageShell";

export function VolunteerPage() {
  const { t } = useI18n();

  return (
    <>
      <PageHeader title={t.volunteerPage.title} lede={t.volunteerPage.lede} />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Prose paragraphs={t.volunteerPage.body} />

            <div className="mt-10 border-l-2 border-gold pl-5">
              <p className="text-sm leading-relaxed text-ink/70">
                {t.volunteerPage.formNote}
              </p>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <Figure
              images={[
                {
                  src: "/images/generated/volunteer-team.webp",
                  alt: "A diverse volunteer team assembling school and essential-supply kits",
                  caption: t.volunteerPage.photoCaption,
                },
              ]}
              imageClassName="arch aspect-[4/5] w-full object-cover"
            />
          </aside>
        </div>
      </section>

      {/* The application itself, on its own band so it cannot be scrolled past. */}
      <PageSection title={t.volunteerPage.formTitle} tone="warm" id="apply">
        <div className="max-w-3xl">
          <VolunteerForm />
        </div>
      </PageSection>

      <PageSection title={t.volunteerPage.areasLabel}>
        <NumberedList items={t.volunteerPage.areas} />

        <div className="mt-12 border-t border-navy-ink/15">
          <div className="pt-8">
            <h3 className="font-display text-lg font-medium text-navy-ink">
              {t.donatePage.title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
              {t.donatePage.lede}
            </p>
            <ArrowLink href="/donate" className="mt-5">
              {t.donatePage.title}
            </ArrowLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
