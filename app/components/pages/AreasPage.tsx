"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink } from "@/app/components/primitives";
import { PageHeader, PageSection, Prose } from "@/app/components/PageShell";

export function AreasPage() {
  const { t } = useI18n();
  const images: Record<number, { src: string; alt: string }> = {
    0: {
      src: t.media.fieldRamadanIftar.url,
      alt: "A large IHBA Ramadan iftar gathering in Pakistan",
    },
    1: {
      src: t.media.studentSupport.url,
      alt: "University students reviewing applications together on campus",
    },
    3: {
      src: t.media.educationCentre.url,
      alt: "Teacher guiding girls and boys as they study together in a classroom",
    },
    2: {
      src: t.media.solarWaterPump.url,
      alt: "A solar-powered pump carrying water into a village channel in Pakistan",
    },
    4: {
      src: t.media.cleanWaterOpening.url,
      alt: "Families gathered for the opening of an IHBA clean-water well in Pakistan",
    },
    5: {
      src: t.media.fieldTeamPakistan.url,
      alt: "IHBA volunteers and local partners together in Pakistan",
    },
  };

  return (
    <>
      <PageHeader title={t.areasPage.title} lede={t.areasPage.lede} />

      {/* Why the seven fields belong together, before they are listed apart. */}
      <section className="bg-white pb-14 lg:pb-16">
        <div className="container-site">
          <Prose paragraphs={t.areasPage.intro} />
        </div>
      </section>

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
                    {/* The blurb stands as the standfirst; the body carries the substance. */}
                    <p className="text-base font-medium leading-relaxed text-navy-ink">
                      {item.blurb}
                    </p>
                    <div className="mt-5 space-y-4">
                      {item.body.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-sm leading-relaxed text-ink/70"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    {image && (
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    )}
                    <p
                      className={`eyebrow text-ink/50 ${image ? "mt-6" : ""}`}
                    >
                      {t.areasPage.activitiesLabel}
                    </p>
                    <ul className="mt-3">
                      {item.activities.map((activity) => (
                        <li
                          key={activity}
                          className="border-b border-navy-ink/12 py-2.5 text-sm leading-snug text-ink/70"
                        >
                          {activity}
                        </li>
                      ))}
                    </ul>
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
