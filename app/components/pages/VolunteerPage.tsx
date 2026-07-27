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

      {/* Nothing here needs a name beyond the page title above it, so this
          band is a plain div rather than an unlabelled section. */}
      <div className="bg-white pb-16 lg:pb-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Prose paragraphs={t.volunteerPage.body} />

            <div className="mt-10 border-t border-navy-ink/15 pt-5">
              <p className="text-sm leading-relaxed text-ink/70">
                {t.volunteerPage.formNote}
              </p>
            </div>
          </div>

          {/* Square, matching every other image in the rebuilt system — the
              arch mask stays off. Figure (Lightbox.tsx) still renders a plain
              <img> internally to drive its enlarge/zoom behaviour; that file
              is shared and off-limits here, so that part is unchanged. */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <Figure
              images={[
                {
                  src: t.media.fieldTeamPakistan.url,
                  alt: "IHBA volunteers and local partners together in Pakistan",
                  caption: t.volunteerPage.photoCaption,
                },
              ]}
              imageClassName="aspect-square w-full"
            />
          </aside>
        </div>
      </div>

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
