import { eq } from "drizzle-orm";
import { CheckCircle2, Languages } from "lucide-react";

import { AdminButton, AdminPageHeader } from "@/app/admin/components/AdminUi";
import { LegalPageForm } from "@/app/admin/components/LegalPageForm";
import { content } from "@/lib/content";
import { db } from "@/lib/db/client";
import { siteContent } from "@/lib/db/schema";
import { dict } from "@/lib/i18n";
import { mergeContentDefaults } from "@/lib/merge-content";

type SearchParams = Promise<{ saved?: string; locale?: string }>;

/**
 * The three legal documents, given their own screen.
 *
 * They were previously reachable only as one group inside the generic content
 * editor, where each paragraph appeared as a separate numbered input. Here each
 * document is a card with its own heading and body editor, which is what makes
 * them findable and editable by someone who was told to "update the KVKK text".
 */
const legalPages = [
  {
    key: "kvkk",
    title: "KVKK Aydınlatma Metni",
    description: "Kişisel verilerin korunmasına dair aydınlatma metni.",
    href: "/kvkk",
  },
  {
    key: "privacy",
    title: "Gizlilik Politikası",
    description: "Website ziyaretçilerinin verilerinin nasıl işlendiği.",
    href: "/privacy-policy",
  },
  {
    key: "cookies",
    title: "Çerez Politikası",
    description: "Website'de kullanılan çerezler hakkında bilgilendirme.",
    href: "/cookie-policy",
  },
] as const;

type LegalSection = { heading: string; paragraphs: string[] };
type LegalDocument = {
  title: string;
  lede: string;
  updatedLabel: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export default async function AdminLegalPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const locale = params.locale === "en" ? "en" : "tr";
  const saved = params.saved === "1";

  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) return null;

  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document
  ) as Record<string, unknown>;
  const legal = document.legalPages as Record<string, LegalDocument>;

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Yasal metinler"
        description="KVKK, gizlilik ve çerez metinleri. Her metin ayrı ayrı kaydedilir."
        action={
          <div className="admin-language-switcher" aria-label="Dil seçimi">
            <Languages className="size-4" aria-hidden="true" />
            <AdminButton
              href="/admin/legal?locale=tr"
              variant={locale === "tr" ? "primary" : "secondary"}
            >
              Türkçe
            </AdminButton>
            <AdminButton
              href="/admin/legal?locale=en"
              variant={locale === "en" ? "primary" : "secondary"}
            >
              English
            </AdminButton>
          </div>
        }
      />

      {saved && (
        <div className="admin-feedback admin-feedback-success" role="status">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Değişiklikler kaydedildi. Website kısa süre içinde güncellenecek.
        </div>
      )}

      <div className="admin-content-sections">
        {legalPages.map((page) => {
          const value = legal?.[page.key];
          if (!value) return null;
          return (
            <LegalPageForm
              key={page.key}
              locale={locale}
              legalKey={page.key}
              title={page.title}
              description={page.description}
              href={page.href}
              value={{
                title: value.title,
                lede: value.lede,
                lastUpdated: value.lastUpdated,
                sections: value.sections ?? [],
              }}
            />
          );
        })}
      </div>
    </>
  );
}
