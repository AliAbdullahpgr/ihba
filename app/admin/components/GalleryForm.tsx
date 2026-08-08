import { archiveGalleryItem, saveGalleryItem } from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import {
  DocControls,
  DocFields,
  DocMain,
  DocRow,
  DocSection,
  DocSidebar,
  DocView,
} from "@/app/admin/components/DocView";
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

const stateLabels: Record<string, string> = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Çöp kutusunda",
};

export function GalleryForm({ item }: { item: GalleryRecord | null }) {
  return (
    <DocView>
      <form action={saveGalleryItem}>
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <UnsavedChangesGuard />

        <DocControls
          meta={
            item
              ? [
                  { label: "Durum", value: stateLabels[item.state] ?? item.state },
                  { label: "Website sırası", value: String(item.sortOrder) },
                ]
              : [{ label: "Durum", value: "Yeni görsel" }]
          }
        >
          <AdminSubmitButton>Kaydet</AdminSubmitButton>
        </DocControls>

        <DocFields>
          <DocMain>
            <DocSection title="Galeri yerleşimi">
              <DocRow>
                <FormField label="Website sırası" hint="Küçük numaralar önce görünür.">
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
              </DocRow>
            </DocSection>

            {(["en", "tr"] as const).map((locale) => {
              const translation = item?.galleryTranslations.find(
                (candidate) => candidate.locale === locale,
              );

              return (
                <DocSection
                  key={locale}
                  title={locale === "en" ? "English (isteğe bağlı)" : "Türkçe"}
                  badge={locale}
                >
                  <DocRow>
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
                  </DocRow>
                  <FormField label="Açıklama">
                    <textarea
                      name={`caption_${locale}`}
                      required={locale === "tr"}
                      rows={3}
                      defaultValue={translation?.caption}
                      className={inputClass}
                    />
                  </FormField>
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
                </DocSection>
              );
            })}
          </DocMain>

          <DocSidebar>
            <FormField label="Yayın durumu">
              <select name="state" defaultValue={item?.state ?? "draft"} className={inputClass}>
                <option value="draft">Taslak</option>
                <option value="published">Yayında</option>
                <option value="archived">Çöp kutusunda</option>
              </select>
            </FormField>

            <FormField label="Galeri görseli">
              <ImageUpload
                initialUrl={item?.imageUrl}
                initialPublicId={item?.imagePublicId}
                allowRemove={false}
              />
            </FormField>

            {item && (
              <div className="pl-doc__danger">
                <TrashActionButton
                  action={archiveGalleryItem}
                  id={item.id}
                  itemName={
                    item.galleryTranslations.find((candidate) => candidate.locale === "tr")
                      ?.category ?? "Galeri görseli"
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
