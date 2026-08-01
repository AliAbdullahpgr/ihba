import Link from "next/link";
import { Eye, Save } from "lucide-react";
import { savePresidentProfile } from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";

type Locale = "en" | "tr";

export type PresidentCopy = {
  title: string;
  lede: string;
  name: string;
  role: string;
  imageAlt: string;
  photoEnabled: boolean;
  message: string[];
};

export function PresidentForm({
  copies,
  image,
  photoEnabled,
  saved,
}: {
  copies: Record<Locale, PresidentCopy>;
  image?: { url: string; publicId: string };
  photoEnabled: boolean;
  saved: boolean;
}) {
  return (
    <form action={savePresidentProfile} className="space-y-6">
      {saved && (
        <p
          role="status"
          className="border border-[#6da77f] bg-[#e8f5ed] px-4 py-3 text-sm font-semibold text-[#24613a]"
        >
          President profile saved. The public pages have been refreshed.
        </p>
      )}

      <section className="border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <h2 className="text-base font-semibold text-navy-ink">
              Photograph
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/60">
              This photograph appears on the homepage president message and on
              the full President&apos;s Message page. Upload a replacement or
              remove it; the message will remain published without a photo.
            </p>
          </div>
          <Link
            href="/president"
            target="_blank"
            className="inline-flex min-h-10 items-center gap-2 border border-navy-ink/20 bg-white px-3 text-sm font-semibold text-navy-ink hover:border-navy-ink/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Eye className="size-4" aria-hidden="true" />
            Preview page
          </Link>
        </div>

        <div className="mt-5 max-w-xl">
          <ImageUpload
            initialUrl={photoEnabled ? image?.url : ""}
            initialPublicId={photoEnabled ? image?.publicId : ""}
            cropAspectRatio={1}
            cropLabel="Square portrait crop"
          />
          <p className="mt-2 text-xs leading-relaxed text-ink/55">
            A square crop is used in both placements. You can adjust the crop
            before saving. Removing the image keeps the text live.
          </p>
        </div>
      </section>

      {(["tr", "en"] as const).map((locale) => {
        const copy = copies[locale];
        const language = locale === "tr" ? "Turkish (default)" : "English";
        return (
          <section
            key={locale}
            className="border border-line bg-white p-5 sm:p-6"
          >
            <div className="flex items-baseline justify-between border-b border-line pb-4">
              <div>
                <h2 className="text-base font-semibold text-navy-ink">
                  {language}
                </h2>
                <p className="mt-1 text-xs text-ink/55">
                  Keep this translation complete so the language switcher has a
                  clear version to publish.
                </p>
              </div>
              <span className="text-xs font-bold uppercase text-ink/45">
                {locale}
              </span>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <FormField label="Page heading">
                <input
                  name={`title_${locale}`}
                  required
                  defaultValue={copy.title}
                  className={inputClass}
                />
              </FormField>
              <FormField label="President&apos;s name">
                <input
                  name={`name_${locale}`}
                  required
                  defaultValue={copy.name}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Title / role">
                <input
                  name={`role_${locale}`}
                  required
                  defaultValue={copy.role}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label="Image alt text"
                hint="Describe the person and context for visitors using screen readers."
              >
                <input
                  name={`imageAlt_${locale}`}
                  defaultValue={copy.imageAlt}
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="mt-5 space-y-5">
              <FormField label="Opening line">
                <textarea
                  name={`lede_${locale}`}
                  required
                  rows={3}
                  defaultValue={copy.lede}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label="Message"
                hint="Separate paragraphs with a blank line."
              >
                <textarea
                  name={`message_${locale}`}
                  required
                  rows={12}
                  defaultValue={copy.message.join("\n\n")}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>
        );
      })}

      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-4">
        <p className="text-xs text-ink/55">
          Saving publishes the updated message and photograph settings
          immediately.
        </p>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-5 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
        >
          <Save className="size-4" aria-hidden="true" />
          Save president profile
        </button>
      </div>
    </form>
  );
}
