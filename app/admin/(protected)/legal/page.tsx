import { eq } from "drizzle-orm";
import { CheckCircle2, ExternalLink, Languages } from "lucide-react";
import Link from "next/link";

import { saveSiteContent } from "@/app/admin/actions";
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  FormField,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
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

function fieldName(path: Array<string | number>) {
  return encodeURIComponent(JSON.stringify(path));
}

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
          const base = ["legalPages", page.key];

          return (
            <AdminCard
              key={page.key}
              title={page.title}
              description={page.description}
              action={
                <Link
                  href={page.href}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-button admin-button-secondary"
                >
                  Sayfayı görüntüle
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              }
            >
              <form action={saveSiteContent} className="admin-content-form">
                <UnsavedChangesGuard />
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="returnTo" value="legal" />

                <div className="admin-settings-grid">
                  <FormField label="Sayfa başlığı">
                    <input
                      name={`field:${fieldName([...base, "title"])}`}
                      defaultValue={value.title}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Son güncelleme tarihi">
                    <input
                      name={`field:${fieldName([...base, "lastUpdated"])}`}
                      defaultValue={value.lastUpdated}
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <FormField label="Giriş cümlesi">
                  <textarea
                    name={`field:${fieldName([...base, "lede"])}`}
                    defaultValue={value.lede}
                    rows={3}
                    className={inputClass}
                  />
                </FormField>

                <div className="admin-legal-sections">
                  {value.sections.map((section, index) => (
                    <div key={`${page.key}-${index}`} className="admin-legal-section">
                      <FormField label={`${index + 1}. bölüm başlığı`}>
                        <input
                          name={`field:${fieldName([...base, "sections", index, "heading"])}`}
                          defaultValue={section.heading}
                          className={inputClass}
                        />
                      </FormField>
                      <FormField label="Bölüm metni">
                        <RichTextEditor
                          name={`rich:${fieldName([...base, "sections", index, "paragraphs"])}`}
                          initialBlocks={section.paragraphs}
                          placeholder="Bu bölümün metnini buraya yazın…"
                        />
                      </FormField>
                    </div>
                  ))}
                </div>

                <div className="admin-content-form-actions">
                  <span>Bu metnin değişiklikleri ayrı kaydedilir.</span>
                  <AdminSubmitButton>{page.title} kaydet</AdminSubmitButton>
                </div>
              </form>
            </AdminCard>
          );
        })}
      </div>
    </>
  );
}
