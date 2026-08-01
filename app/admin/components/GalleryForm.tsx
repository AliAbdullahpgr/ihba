import { Archive, Save } from "lucide-react";
import {
  archiveGalleryItem,
  saveGalleryItem,
} from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";

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

        <div className="space-y-6">
          <section className="border border-line bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-navy-ink">
              Gallery placement
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <FormField
                label="Display order"
                hint="Lower numbers appear first."
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
                label="Image layout"
                hint="Controls the photograph's gallery composition."
              >
                <select
                  name="layout"
                  defaultValue={item?.layout ?? "landscape"}
                  className={inputClass}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="wide">Full width</option>
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
                    {locale === "en" ? "English (optional)" : "Turkish"}
                  </h2>
                  <span className="text-xs font-bold uppercase text-ink/45">
                    {locale}
                  </span>
                </div>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <FormField label="Category">
                    <input
                      name={`category_${locale}`}
                      required={locale === "tr"}
                      defaultValue={translation?.category}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Place and date">
                    <input
                      name={`place_${locale}`}
                      required={locale === "tr"}
                      defaultValue={translation?.place}
                      className={inputClass}
                    />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Caption">
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
                      label="Image alt text"
                      hint="Describe what is visible for visitors using screen readers."
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
              Published changes appear in the gallery immediately.
            </p>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-5 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
            >
              <Save className="size-4" />
              Save gallery item
            </button>
          </div>
        </div>

        <aside className="h-fit space-y-5 border border-line bg-white p-5 xl:sticky xl:top-24">
          <FormField label="Publication state">
            <select
              name="state"
              defaultValue={item?.state ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
          <div>
            <p className="mb-2 text-sm font-semibold text-navy-ink">
              Gallery image
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
        <form action={archiveGalleryItem} className="mt-6 max-w-xs">
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#a33b32]/30 bg-white px-4 text-sm font-semibold text-[#8f3029] hover:border-[#a33b32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33b32]"
          >
            <Archive className="size-4" />
            Archive gallery item
          </button>
        </form>
      )}
    </>
  );
}
