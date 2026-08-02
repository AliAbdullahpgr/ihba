import { CheckCircle2, ExternalLink, Languages, Save } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { saveSiteContent } from "@/app/admin/actions";
import { AdminPageHeader, inputClass } from "@/app/admin/components/AdminUi";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
import { contentFieldName, flattenContentFields } from "@/lib/content-fields";
import { isContentLocale, loadContentDocument } from "../../document";
import { contentGroupByKey, contentSectionByKey } from "../../sections";

type Params = Promise<{ locale: string; section: string }>;
type SearchParams = Promise<{ saved?: string }>;

/**
 * One content area, on its own page. Fields are open by default — you only get
 * here by choosing this section, so hiding them behind a disclosure would just
 * add a click.
 */
export default async function ContentSectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale, section: sectionKey } = await params;
  if (!isContentLocale(locale)) notFound();
  const section = contentSectionByKey.get(sectionKey);
  if (!section) notFound();

  const document = await loadContentDocument(locale);
  if (!document) notFound();

  const fields = flattenContentFields(
    document[section.key],
    [section.key],
    new Set(section.reveal ?? []),
  );
  if (!fields.length) notFound();

  const saved = (await searchParams).saved === "1";
  const otherLocale = locale === "tr" ? "en" : "tr";

  return (
    <>
      <AdminPageHeader
        eyebrow={locale === "tr" ? "Türkçe içerik" : "İngilizce içerik"}
        backHref={`/admin/content/${locale}/group/${section.group}`}
        backLabel={`${contentGroupByKey.get(section.group)?.title ?? "Bölümler"} listesine dön`}
        title={section.title}
        description={section.description}
        action={
          <div className="admin-language-switcher" aria-label="Dil seçimi">
            <Languages className="size-4" aria-hidden="true" />
            <Link href={`/admin/content/tr/${section.key}`} className={locale === "tr" ? "admin-language-link is-active" : "admin-language-link"}>
              Türkçe
            </Link>
            <Link href={`/admin/content/en/${section.key}`} className={locale === "en" ? "admin-language-link is-active" : "admin-language-link"}>
              English
            </Link>
          </div>
        }
      />

      {saved && (
        <div className="admin-feedback admin-feedback-success" role="status">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Değişiklikler kaydedildi. Website kısa süre içinde güncellenecek.
        </div>
      )}

      <section className="admin-content-section">
        <div className="admin-content-section-summary">
          <div>
            <span className="admin-eyebrow">{fields.length} alan</span>
            <h2>{section.title}</h2>
            <p>
              {locale === "en"
                ? "Bu metinler EN diline geçen ziyaretçilere gösterilir. Boş bıraktığınız alan website'de de boş görünür — Türkçe metin otomatik kullanılmaz."
                : "Bu bölümün değişiklikleri yalnızca burada kaydedilir."}
            </p>
          </div>
          {section.preview && (
            <a
              className="admin-content-section-status"
              href={section.preview}
              target="_blank"
              rel="noreferrer"
            >
              Website'de gör
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>

        <form action={saveSiteContent} className="admin-content-form">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="returnTo" value="section" />
          <input type="hidden" name="section" value={section.key} />
          <div className="admin-content-fields">
            {fields.map((field) => {
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
                <label
                  key={name}
                  className={long ? "admin-content-field admin-content-field-wide" : "admin-content-field"}
                >
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
            <span>
              {locale === "tr"
                ? `İngilizce karşılığı için ${otherLocale.toUpperCase()} sekmesine geçin.`
                : "Türkçe metin ana kaynaktır."}
            </span>
            <button type="submit" className="admin-button admin-button-primary">
              <Save className="size-4" aria-hidden="true" />
              Kaydet
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
