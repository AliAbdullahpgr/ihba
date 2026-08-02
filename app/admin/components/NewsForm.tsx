import { archiveNews, saveNews } from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
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

export function NewsForm({ article }: { article: NewsRecord | null }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form action={saveNews} className="space-y-6">
        <input type="hidden" name="id" value={article?.id ?? ""} />
        <UnsavedChangesGuard />
        <section className="border border-line bg-white p-5 sm:p-6">
          <FormField
            label="Website adresi"
            hint="Küçük harf, rakam ve tire kullanın."
          >
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              defaultValue={article?.slug}
              className={inputClass}
            />
          </FormField>
        </section>

        {(["en", "tr"] as const).map((locale) => {
          const item = article?.newsTranslations.find(
            (translation) => translation.locale === locale
          );
          return (
            <section
              key={locale}
              className="border border-line bg-white p-5 sm:p-6"
            >
              <div className="flex items-baseline justify-between border-b border-line pb-4">
                <h2 className="text-base font-semibold text-navy-ink">
                  {locale === "en" ? "English (isteğe bağlı)" : "Türkçe"}
                </h2>
                <span className="text-xs font-bold uppercase text-ink/45">
                  {locale}
                </span>
              </div>
              <div className="mt-5 space-y-5">
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
              </div>
            </section>
          );
        })}

        <div className="sticky bottom-0 flex justify-end border border-line bg-white p-4">
          <AdminSubmitButton>Haberi kaydet</AdminSubmitButton>
        </div>

        <aside className="space-y-5 border border-line bg-white p-5 xl:fixed xl:right-8 xl:top-24 xl:w-80">
          <FormField label="Yayın durumu">
            <select
              name="state"
              defaultValue={article?.state ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Çöp kutusunda</option>
            </select>
          </FormField>
          <div>
            <p className="mb-2 text-sm font-semibold text-navy-ink">
              Kapak görseli
            </p>
            <ImageUpload
              initialUrl={article?.imageUrl}
              initialPublicId={article?.imagePublicId}
            />
          </div>
        </aside>
      </form>

      {article && (
        <div className="xl:col-start-2">
          <TrashActionButton action={archiveNews} id={article.id} itemName={article.newsTranslations.find((item) => item.locale === "tr")?.title ?? article.slug} kind="trash" />
        </div>
      )}
    </div>
  );
}
