import { CheckCircle2, ChevronDown, Languages, Save } from "lucide-react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { saveSiteContent } from "@/app/admin/actions";
import {
  AdminButton,
  AdminPageHeader,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
import { db } from "@/lib/db/client";
import { content } from "@/lib/content";
import { contentFieldName, flattenContentFields, humanize } from "@/lib/content-fields";
import { dict } from "@/lib/i18n";
import { siteContent } from "@/lib/db/schema";
import { mergeContentDefaults } from "@/lib/merge-content";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ saved?: string }>;

const sectionCopy: Record<string, { title: string; description: string }> = {
  utility: {
    title: "İletişim ve genel bilgiler",
    description: "Header, footer ve iletişim sayfasında görünen temel bilgiler.",
  },
  hero: {
    title: "Anasayfa giriş alanı",
    description: "Website'in ilk ekranındaki başlık, açıklama ve çağrı butonları.",
  },
  facts: {
    title: "Etki istatistikleri",
    description: "Anasayfada çalışmalarımızın etkisini özetleyen kısa bilgiler.",
  },
  about: {
    title: "Hakkımızda önizlemesi",
    description: "Anasayfa ve Hakkımızda sayfasında kurumumuzu anlatan bölüm.",
  },
  aboutPage: {
    title: "Hakkımızda sayfası",
    description: "Kurumun hikâyesi, yaklaşımı ve çalışma ilkeleri.",
  },
  donatePage: {
    title: "Bağış sayfası",
    description: "Bağış sayfasında ziyaretçilerin gördüğü yönlendirme metinleri.",
  },
  contactPage: {
    title: "İletişim sayfası",
    description: "İletişim formu ve adres bilgileri.",
  },
  legalPages: {
    title: "Yasal metinler",
    description: "KVKK, gizlilik ve çerez sayfalarında kullanılan metinler.",
  },
  presidentPage: {
    title: "Başkan mesajı özeti",
    description: "Detaylı mesaj için Başkan mesajı sayfasını kullanın.",
  },
};

export default async function EditContentPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "tr") notFound();
  const row = await db.query.siteContent.findFirst({ where: eq(siteContent.locale, locale) });
  if (!row) notFound();
  const saved = (await searchParams).saved === "1";
  const document = mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as Record<string, unknown>;
  const groups = Object.entries(document)
    .map(([key, value]) => ({ key, fields: flattenContentFields(value, [key]) }))
    .filter((group) => group.fields.length);

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title={locale === "tr" ? "Türkçe website metinleri" : "İngilizce website metinleri"}
        description={
          locale === "tr"
            ? "Türkçe, website'in ana içeriğidir. Her bölüm kendi içinden kaydedilir."
            : "İngilizce alanlar isteğe bağlıdır. Boş bırakılan alanlarda Türkçe içerik gösterilir."
        }
        action={
          <div className="admin-language-switcher" aria-label="Dil seçimi">
            <Languages className="size-4" aria-hidden="true" />
            <AdminButton href="/admin/content/tr" variant={locale === "tr" ? "primary" : "secondary"}>Türkçe</AdminButton>
            <AdminButton href="/admin/content/en" variant={locale === "en" ? "primary" : "secondary"}>English</AdminButton>
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
        {groups.map((group) => {
          const copy = sectionCopy[group.key] ?? {
            title: humanize(group.key),
            description: "Bu bölümde website'in ilgili alanında görünen metinleri düzenleyin.",
          };
          return (
            <section className="admin-content-section" key={group.key} id={group.key}>
              <div className="admin-content-section-summary">
                <div>
                  <span className="admin-eyebrow">{group.fields.length} alan</span>
                  <h2>{copy.title}</h2>
                  <p>{copy.description}</p>
                </div>
                <span className="admin-content-section-status">Düzenlemeye hazır</span>
              </div>
              <details className="admin-content-disclosure">
                <summary>
                  Alanları göster
                  <ChevronDown className="size-4" aria-hidden="true" />
                </summary>
                <form action={saveSiteContent} className="admin-content-form">
                  <input type="hidden" name="locale" value={locale} />
                  <div className="admin-content-fields">
                    {group.fields.map((field) => {
                      const name = contentFieldName(field);
                      if (field.kind === "rich") {
                        return (
                          <div key={name} className="admin-content-field admin-content-field-wide">
                            <span>{field.label}</span>
                            <RichTextEditor name={name} initialBlocks={field.blocks} />
                          </div>
                        );
                      }
                      const long = field.value.length > 90 || field.value.includes("\n");
                      return (
                        <label key={name} className={long ? "admin-content-field admin-content-field-wide" : "admin-content-field"}>
                          <span>{field.label}</span>
                          {long ? (
                            <textarea
                              name={name}
                              defaultValue={field.value}
                              rows={Math.min(8, Math.max(3, Math.ceil(field.value.length / 80)))}
                              className={inputClass}
                            />
                          ) : (
                            <input name={name} defaultValue={field.value} className={inputClass} />
                          )}
                        </label>
                      );
                    })}
                  </div>
                  <div className="admin-content-form-actions">
                    <span>Bu bölümün değişiklikleri ayrı kaydedilir.</span>
                    <button type="submit" className="admin-button admin-button-primary">
                      <Save className="size-4" aria-hidden="true" />
                      {copy.title} kaydet
                    </button>
                  </div>
                </form>
              </details>
            </section>
          );
        })}
      </div>
    </>
  );
}
