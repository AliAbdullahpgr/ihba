"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/LanguageProvider";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLink, Tag } from "@/app/components/primitives";
import { PageHeader, PageSection, Prose } from "@/app/components/PageShell";

const tagTones = ["gold", "azure", "navy"] as const;

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

      {/*
        A plain wrapper, not a section: the page's own h1 already labels this
        content, and there is no heading of its own to hang a landmark label on.
      */}
      <div className="bg-white pb-14 lg:pb-16">
        <div className="container-site">
          <Prose paragraphs={t.areasPage.intro} />

          {/* The page's own premise is "seven fields" — so the seven get an
              index a reader can act on, not just prose promising they exist. */}
          <nav aria-label={t.areasPage.jumpLabel} className="mt-10 max-w-2xl">
            <ol className="grid gap-x-10 sm:grid-cols-2">
              {t.areasPage.items.map((item, index) => (
                <li key={item.title}>
                  <a
                    href={`#field-${index + 1}`}
                    className="group flex items-baseline gap-4 border-b border-navy-ink/12 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                  >
                    <span className="font-display text-sm font-medium text-navy-ink/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-semibold text-navy-ink transition-colors group-hover:text-azure-deep">
                      {item.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/*
        Each field is its own full-width band, alternating tone so seven
        entries in a row read as seven distinct things rather than one long
        repeating table. Every heading belongs to its own article, so this
        stays a div rather than an unlabelled section.
      */}
      <div className="pb-8 lg:pb-12">
        {t.areasPage.items.map((item, index) => {
          const image = images[index];
          const flip = index % 2 === 1;
          return (
            <Reveal key={item.title} delay={(index % 3) * 90}>
              <article
                id={`field-${index + 1}`}
                className={`scroll-mt-24 border-b border-navy-ink/12 ${
                  index % 2 === 1 ? "bg-paper-warm/40" : "bg-white"
                }`}
              >
                <div className="container-site py-14 lg:py-16">
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                    <span className="font-display text-4xl font-medium tracking-[-0.03em] text-navy-ink/20 lg:text-5xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl font-medium leading-snug text-navy-ink lg:text-3xl">
                      {item.title}
                    </h2>
                  </div>
                  {/* The blurb stands as the standfirst; the body carries the substance. */}
                  <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-navy-ink">
                    {item.blurb}
                  </p>

                  <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Text and the activities ledger share one column, so its
                        height comes from what it actually contains — not from
                        having to match a photo sitting alongside it. */}
                    <div
                      className={`${image ? "lg:col-span-7" : "lg:col-span-12"} ${flip ? "lg:order-2" : ""}`}
                    >
                      {item.body.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-base leading-relaxed text-ink/70"
                        >
                          {paragraph}
                        </p>
                      ))}

                      <div className="mt-6">
                        <Tag tone={tagTones[index % tagTones.length]}>
                          {t.areasPage.activitiesLabel}
                        </Tag>
                        <ul
                          className={`mt-4 grid gap-x-8 sm:grid-cols-2 ${image ? "" : "lg:grid-cols-3"}`}
                        >
                          {item.activities.map((activity) => (
                            <li
                              key={activity}
                              className="border-b border-navy-ink/12 py-2.5 text-base leading-snug text-ink/70"
                            >
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* The photo now stands alone at its own natural size —
                        a supporting image, not a column that has to fill
                        whatever height the text happens to leave it. */}
                    {image && (
                      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(min-width: 1024px) 420px, 100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

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
