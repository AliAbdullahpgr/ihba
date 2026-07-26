"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink } from "@/app/components/primitives";
import { PageHeader, PageSection } from "@/app/components/PageShell";

export function AreasPage() {
  const { t } = useI18n();
  const images: Record<number, { src: string; alt: string }> = {
    0: {
      src: t.media.ramadanProgramme.url,
      alt: "Community volunteers preparing food parcels and shared meals",
    },
    1: {
      src: t.media.studentSupport.url,
      alt: "University students reviewing applications together on campus",
    },
    3: {
      src: t.media.educationCentre.url,
      alt: "Teacher guiding girls and boys as they study together in a classroom",
    },
    5: {
      src: t.media.volunteerTeam.url,
      alt: "A diverse volunteer team assembling school and essential-supply kits",
    },
  };

  return (
    <>
      <PageHeader title={t.areasPage.title} lede={t.areasPage.lede} />

      {/*
        Each field is a numbered entry on the deck line: the number and title on
        the left bank, the description and any imagery on the right.
      */}
      <section className="bg-white pb-8 lg:pb-12">
        <div className="container-site">
          {t.areasPage.items.map((item, index) => {
            const image = images[index];
            return (
              <Reveal key={item.title} delay={(index % 3) * 90}>
                <article className="grid gap-6 border-b border-navy-ink/12 py-12 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-4">
                    <p className="font-display text-5xl font-medium tracking-[-0.03em] text-navy-ink/15">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-4 font-display text-xl font-medium leading-snug text-navy-ink">
                      {item.title}
                    </h2>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-base leading-relaxed text-ink/75">
                      {item.blurb}
                    </p>
                  </div>

                  <div className="lg:col-span-3">
                    {image && (
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <PageSection tone="warm">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.aboutPage.serveLabel}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
              {t.aboutPage.serveText}
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-medium text-navy-ink">
              {t.aboutPage.geographyLabel}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
              {t.aboutPage.geographyText}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-ink/15 pt-8">
          <ArrowLink href="/projects">{t.common.allProjects}</ArrowLink>
        </div>
      </PageSection>
    </>
  );
}
