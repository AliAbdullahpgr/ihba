import {
  archiveGalleryItem,
  saveGalleryItem,
} from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";
import { TrashActionButton } from "@/app/admin/components/TrashActionButton";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";

type GalleryTranslation = {
  locale: "en" | "tr";
  category: string;
  place: string;
  caption: string;
  imageAlt: string;
};

type GalleryRecord = {
  id: string;
  state: "draft" | "published" | "archived";
  imageUrl: string;
  imagePublicId: string | null;
  layout: "portrait" | "landscape" | "wide";
  sortOrder: number;
  galleryTranslations: GalleryTranslation[];
};

export function GalleryForm({ item }: { item: GalleryRecord | null }) {
  return (
    <>
      <form
        action={saveGalleryItem}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <UnsavedChangesGuard />

        <div className="space-y-6">
          <section className="border border-line bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-navy-ink">
              Galeri yerleşimi
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Website sırası"
                hint="Küçük numaralar önce görünür."
              >
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  required
                  defaultValue={item?.sortOrder ?? 0}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label="Görsel yerleşimi"
                hint="Fotoğrafın galeri içindeki görünümünü belirler."
              >
                <select
                  name="layout"
                  defaultValue={item?.layout ?? "landscape"}
                  className={inputClass}
                >
                  <option value="portrait">Dikey</option>
                  <option value="landscape">Yatay</option>
                  <option value="wide">Tam genişlik</option>
                </select>
              </FormField>
            </div>
          </section>

          {(["en", "tr"] as const).map((locale) => {
            const translation = item?.galleryTranslations.find(
              (candidate) => candidate.locale === locale
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
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <FormField label="Kategori veya başlık">
                    <input
                      name={`category_${locale}`}
                      required={locale === "tr"}
                      defaultValue={translation?.category}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Konum ve tarih">
                    <input
                      name={`place_${locale}`}
                      required={locale === "tr"}
                      defaultValue={translation?.place}
                      className={inputClass}
                    />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Açıklama">
                      <textarea
                        name={`caption_${locale}`}
                        required={locale === "tr"}
                        rows={3}
                        defaultValue={translation?.caption}
                        className={inputClass}
                      />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField
                      label="Görsel alternatif metni"
                      hint="Ekran okuyucu kullanan ziyaretçiler için görseli tarif edin."
                    >
                      <input
                        name={`imageAlt_${locale}`}
                        required={locale === "tr"}
                        defaultValue={translation?.imageAlt}
                        className={inputClass}
                      />
                    </FormField>
                  </div>
                </div>
              </section>
            );
          })}

          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-4">
            <p className="text-xs text-ink/55">
              Yayında seçtiğiniz değişiklikler kaydettiğinizde galeride görünür.
            </p>
            <AdminSubmitButton>Galeri görselini kaydet</AdminSubmitButton>
          </div>
        </div>

        <aside className="h-fit space-y-5 border border-line bg-white p-5 xl:sticky xl:top-24">
          <FormField label="Yayın durumu">
            <select
              name="state"
              defaultValue={item?.state ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Çöp kutusunda</option>
            </select>
          </FormField>
          <div>
            <p className="mb-2 text-sm font-semibold text-navy-ink">
              Galeri görseli
            </p>
            <ImageUpload
              initialUrl={item?.imageUrl}
              initialPublicId={item?.imagePublicId}
              allowRemove={false}
            />
          </div>
        </aside>
      </form>

      {item && (
        <div className="mt-6 max-w-xs">
          <TrashActionButton action={archiveGalleryItem} id={item.id} itemName={item.galleryTranslations.find((candidate) => candidate.locale === "tr")?.category ?? "Galeri görseli"} kind="trash" />
        </div>
      )}
    </>
  );
}
