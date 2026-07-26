import { Archive, Save } from "lucide-react";
import { archiveProject, saveProject } from "@/app/admin/actions";
import {
  FormField,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";

type Translation = {
  locale: "en" | "tr";
  title: string;
  region: string;
  statusLabel: string;
  summary: string;
  body: string[];
  facts: Array<{ label: string; value: string }>;
  chips: string[];
  imageAlt: string;
};

type ProjectRecord = {
  id: string;
  slug: string;
  state: "draft" | "published" | "archived";
  imageUrl: string | null;
  imagePublicId: string | null;
  sortOrder: number;
  projectTranslations: Translation[];
};

function translation(project: ProjectRecord | null, locale: "en" | "tr") {
  return project?.projectTranslations.find((item) => item.locale === locale);
}

export function ProjectForm({ project }: { project: ProjectRecord | null }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form action={saveProject} className="space-y-6">
        <input type="hidden" name="id" value={project?.id ?? ""} />

        <section className="border border-line bg-white p-5 sm:p-6">
          <h2 className="text-base font-semibold text-navy-ink">
            Project details
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Slug"
              hint="Lowercase letters, numbers and hyphens. Changing it changes the public URL."
            >
              <input
                name="slug"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                defaultValue={project?.slug}
                className={inputClass}
              />
            </FormField>
            <FormField label="Display order">
              <input
                name="sortOrder"
                type="number"
                min="0"
                required
                defaultValue={project?.sortOrder ?? 0}
                className={inputClass}
              />
            </FormField>
          </div>
        </section>

        {(["en", "tr"] as const).map((locale) => {
          const item = translation(project, locale);
          const language = locale === "en" ? "English" : "Turkish";
          return (
            <section
              key={locale}
              className="border border-line bg-white p-5 sm:p-6"
            >
              <div className="flex items-baseline justify-between border-b border-line pb-4">
                <h2 className="text-base font-semibold text-navy-ink">
                  {language}
                </h2>
                <span className="text-xs font-bold uppercase text-ink/45">
                  {locale}
                </span>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <FormField label="Title">
                  <input
                    name={`title_${locale}`}
                    required
                    defaultValue={item?.title}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Region">
                  <input
                    name={`region_${locale}`}
                    required
                    defaultValue={item?.region}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Public status label">
                  <input
                    name={`statusLabel_${locale}`}
                    required
                    defaultValue={item?.statusLabel}
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
              <div className="mt-5 space-y-5">
                <FormField label="Summary">
                  <textarea
                    name={`summary_${locale}`}
                    required
                    rows={3}
                    defaultValue={item?.summary}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Body"
                  hint="Separate paragraphs with a blank line."
                >
                  <textarea
                    name={`body_${locale}`}
                    required
                    rows={9}
                    defaultValue={item?.body.join("\n\n")}
                    className={inputClass}
                  />
                </FormField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Facts"
                    hint="One per line: Label | Value"
                  >
                    <textarea
                      name={`facts_${locale}`}
                      rows={5}
                      defaultValue={item?.facts
                        .map((fact) => `${fact.label} | ${fact.value}`)
                        .join("\n")}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField
                    label="Tags"
                    hint="Separate tags with commas."
                  >
                    <textarea
                      name={`chips_${locale}`}
                      rows={5}
                      defaultValue={item?.chips.join(", ")}
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
            Published changes appear on the public site immediately.
          </p>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-5 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Save className="size-4" />
            Save project
          </button>
        </div>

        <aside className="border border-line bg-white p-5 xl:fixed xl:right-8 xl:top-24 xl:w-80">
          <FormField label="Publication state">
            <select
              name="state"
              defaultValue={project?.state ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-navy-ink">
              Featured image
            </p>
            <ImageUpload
              initialUrl={project?.imageUrl}
              initialPublicId={project?.imagePublicId}
            />
          </div>
        </aside>
      </form>

      {project && (
        <form action={archiveProject} className="xl:col-start-2">
          <input type="hidden" name="id" value={project.id} />
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#a33b32]/30 bg-white px-4 text-sm font-semibold text-[#8f3029] hover:border-[#a33b32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33b32]"
          >
            <Archive className="size-4" />
            Archive project
          </button>
        </form>
      )}
    </div>
  );
}
