"use client";

import { useI18n } from "@/app/components/LanguageProvider";
import { PageHeader, PageSection, Prose } from "@/app/components/PageShell";

type LegalPageKey = "kvkk" | "privacy" | "cookies";

export function LegalPage({ page }: { page: LegalPageKey }) {
  const { t } = useI18n();
  const content = t.legalPages[page];

  return (
    <>
      <PageHeader title={content.title} lede={content.lede} />
      <PageSection>
        <p className="mb-10 text-sm font-semibold text-navy-ink/65">
          {content.updatedLabel}: {content.lastUpdated}
        </p>
        <div className="max-w-3xl space-y-12">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="border-t border-navy-ink/15 pt-5 font-display text-xl font-medium text-navy-ink">
                {section.heading}
              </h2>
              <Prose paragraphs={section.paragraphs} className="mt-4" />
            </section>
          ))}
        </div>
      </PageSection>
    </>
  );
}
