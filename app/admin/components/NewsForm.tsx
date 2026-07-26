import { Archive, Save } from "lucide-react";
import { archiveNews, saveNews } from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";

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
        <section className="border border-line bg-white p-5 sm:p-6">
          <FormField
            label="Slug"
            hint="Lowercase letters, numbers and hyphens."
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
                  {locale === "en" ? "English" : "Turkish"}
                </h2>
                <span className="text-xs font-bold uppercase text-ink/45">
                  {locale}
                </span>
              </div>
              <div className="mt-5 space-y-5">
                <FormField label="Title">
                  <input
                    name={`title_${locale}`}
                    required
                    defaultValue={item?.title}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Excerpt">
                  <textarea
                    name={`excerpt_${locale}`}
                    required
                    rows={3}
                    defaultValue={item?.excerpt}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Article body"
                  hint="Separate paragraphs with a blank line."
                >
                  <textarea
                    name={`body_${locale}`}
                    required
                    rows={12}
                    defaultValue={item?.body.join("\n\n")}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Image alt text">
                  <input
                    name={`imageAlt_${locale}`}
                    required
                    defaultValue={item?.imageAlt}
                    className={inputClass}
                  />
                </FormField>
              </div>
            </section>
          );
        })}

        <div className="sticky bottom-0 flex justify-end border border-line bg-white p-4">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-5 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Save className="size-4" />
            Save article
          </button>
        </div>

        <aside className="space-y-5 border border-line bg-white p-5 xl:fixed xl:right-8 xl:top-24 xl:w-80">
          <FormField label="Publication state">
            <select
              name="state"
              defaultValue={article?.state ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
          <div>
            <p className="mb-2 text-sm font-semibold text-navy-ink">
              Featured image
            </p>
            <ImageUpload
              initialUrl={article?.imageUrl}
              initialPublicId={article?.imagePublicId}
            />
          </div>
        </aside>
      </form>

      {article && (
        <form action={archiveNews} className="xl:col-start-2">
          <input type="hidden" name="id" value={article.id} />
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#a33b32]/30 bg-white px-4 text-sm font-semibold text-[#8f3029] hover:border-[#a33b32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33b32]"
          >
            <Archive className="size-4" />
            Archive article
          </button>
        </form>
      )}
    </div>
  );
}
