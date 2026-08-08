import { archiveNews, saveNews } from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import {
  DocControls,
  DocFields,
  DocMain,
  DocSection,
  DocSidebar,
  DocView,
} from "@/app/admin/components/DocView";
import { ImageUpload } from "@/app/admin/components/ImageUpload";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
import { TrashActionButton } from "@/app/admin/components/TrashActionButton";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";

type NewsTranslation = {
  locale: "en" | "tr";
  title: string;
  excerpt: string;
  body: string[];
  imageAlt: string;
};

type NewsRecord = {
  id: string;
  slug: string;
  state: "draft" | "published" | "archived";
  imageUrl: string | null;
  imagePublicId: string | null;
  newsTranslations: NewsTranslation[];
};

const stateLabels: Record<string, string> = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Çöp kutusunda",
};

export function NewsForm({ article }: { article: NewsRecord | null }) {
  return (
    <DocView>
      <form action={saveNews}>
        <input type="hidden" name="id" value={article?.id ?? ""} />
        <UnsavedChangesGuard />

        <DocControls
          meta={
            article
              ? [
                  { label: "Durum", value: stateLabels[article.state] ?? article.state },
                  { label: "Website adresi", value: `/news/${article.slug}` },
                ]
              : [{ label: "Durum", value: "Yeni haber" }]
          }
        >
          <AdminSubmitButton>Kaydet</AdminSubmitButton>
        </DocControls>

        <DocFields>
          <DocMain>
            <DocSection title="Haber bilgileri">
              <FormField label="Website adresi" hint="Küçük harf, rakam ve tire kullanın.">
                <input
                  name="slug"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  defaultValue={article?.slug}
                  className={inputClass}
                />
              </FormField>
            </DocSection>

            {(["en", "tr"] as const).map((locale) => {
              const item = article?.newsTranslations.find(
                (translation) => translation.locale === locale,
              );
              return (
                <DocSection
                  key={locale}
                  title={locale === "en" ? "English (isteğe bağlı)" : "Türkçe"}
                  badge={locale}
                >
                  <FormField label="Başlık">
                    <input
                      name={`title_${locale}`}
                      required={locale === "tr"}
                      defaultValue={item?.title}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Kısa özet">
                    <textarea
                      name={`excerpt_${locale}`}
                      required={locale === "tr"}
                      rows={3}
                      defaultValue={item?.excerpt}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField
                    label="Haber metni"
                    hint="Yazıyı doğrudan buraya yazın. Kalın yazı, başlık, liste ve bağlantı eklemek için üstteki düğmeleri kullanın."
                  >
                    <RichTextEditor
                      name={`body_${locale}`}
                      initialBlocks={item?.body ?? []}
                      required={locale === "tr"}
                      requiredMessage="Haber metni boş bırakılamaz."
                      placeholder={
                        locale === "tr"
                          ? "Haberin metnini buraya yazın…"
                          : "İngilizce metin (isteğe bağlı) — boş bırakılırsa Türkçe metin kullanılır."
                      }
                    />
                  </FormField>
                  <FormField label="Görsel alternatif metni">
                    <input
                      name={`imageAlt_${locale}`}
                      required={locale === "tr"}
                      defaultValue={item?.imageAlt}
                      className={inputClass}
                    />
                  </FormField>
                </DocSection>
              );
            })}
          </DocMain>

          <DocSidebar>
            <FormField label="Yayın durumu">
              <select name="state" defaultValue={article?.state ?? "draft"} className={inputClass}>
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
                <option value="archived">Çöp kutusunda</option>
              </select>
            </FormField>

            <FormField label="Kapak görseli">
              <ImageUpload
                initialUrl={article?.imageUrl}
                initialPublicId={article?.imagePublicId}
              />
            </FormField>

            {article && (
              <div className="pl-doc__danger">
                <TrashActionButton
                  action={archiveNews}
                  id={article.id}
                  itemName={
                    article.newsTranslations.find((item) => item.locale === "tr")?.title ??
                    article.slug
                  }
                  kind="trash"
                />
              </div>
            )}
          </DocSidebar>
        </DocFields>
      </form>
    </DocView>
  );
}
