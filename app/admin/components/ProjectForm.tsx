import { archiveProject, saveProject } from "@/app/admin/actions";
import {
  FormField,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";
import {
  ProjectGalleryManager,
  type AdminProjectImage,
} from "@/app/admin/components/ProjectGalleryManager";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
import { TrashActionButton } from "@/app/admin/components/TrashActionButton";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";

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
  lifecycle: "ongoing" | "completed" | "inactive";
  featured: boolean;
  imageUrl: string | null;
  imagePublicId: string | null;
  sortOrder: number;
  projectTranslations: Translation[];
  projectImages?: AdminProjectImage[];
};

function translation(project: ProjectRecord | null, locale: "en" | "tr") {
  return project?.projectTranslations.find((item) => item.locale === locale);
}

export function ProjectForm({ project }: { project: ProjectRecord | null }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form action={saveProject} className="space-y-6">
        <input type="hidden" name="id" value={project?.id ?? ""} />
        <UnsavedChangesGuard />

        <section className="border border-line bg-white p-5 sm:p-6">
          <h2 className="text-base font-semibold text-navy-ink">
            Proje bilgileri
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Website adresi"
              hint="Küçük harf, rakam ve tire kullanın. Değiştirirseniz projenin website adresi de değişir."
            >
              <input
                name="slug"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                defaultValue={project?.slug}
                className={inputClass}
              />
            </FormField>
            <FormField label="Website sırası">
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
          const language =
            locale === "en" ? "English (isteğe bağlı)" : "Türkçe";
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
                <FormField label="Başlık">
                  <input
                    name={`title_${locale}`}
                    required={locale === "tr"}
                    defaultValue={item?.title}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Bölge">
                  <input
                    name={`region_${locale}`}
                    required={locale === "tr"}
                    defaultValue={item?.region}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Website durum etiketi">
                  <input
                    name={`statusLabel_${locale}`}
                    required={locale === "tr"}
                    defaultValue={item?.statusLabel}
                    className={inputClass}
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
              <div className="mt-5 space-y-5">
                <FormField label="Kısa özet">
                  <textarea
                    name={`summary_${locale}`}
                    required={locale === "tr"}
                    rows={3}
                    defaultValue={item?.summary}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Proje açıklaması"
                  hint="İlk paragraf proje sayfasının girişinde öne çıkar. Biçimlendirme için üstteki düğmeleri kullanın."
                >
                  <RichTextEditor
                    name={`body_${locale}`}
                    initialBlocks={item?.body ?? []}
                    required={locale === "tr"}
                    requiredMessage="Proje açıklaması boş bırakılamaz."
                    placeholder={
                      locale === "tr"
                        ? "Projeyi buraya anlatın…"
                        : "İngilizce açıklama (isteğe bağlı) — boş bırakılırsa Türkçe metin kullanılır."
                    }
                  />
                </FormField>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Etki bilgileri"
                    hint="Her satıra bir bilgi yazın: Etiket | Değer"
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
                    label="Etiketler"
                    hint="Etiketleri virgülle ayırın."
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

        <ProjectGalleryManager initialImages={project?.projectImages ?? []} />

        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-4">
          <p className="text-xs text-ink/55">
            Yayında seçtiğiniz değişiklikler kaydettiğinizde website'de görünür.
          </p>
          <AdminSubmitButton>Projeyi kaydet</AdminSubmitButton>
        </div>

        <aside className="border border-line bg-white p-5 xl:fixed xl:right-8 xl:top-24 xl:w-80">
          <FormField
            label="Yayın durumu"
            hint="Projenin website'de görünüp görünmeyeceğini belirler."
          >
            <select
              name="state"
              defaultValue={project?.state ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Çöp kutusunda</option>
            </select>
          </FormField>

          {/*
            Kept apart from the publication state on purpose: a finished
            project stays on the website, so "tamamlandı" must not be a way of
            hiding it.
          */}
          <div className="mt-5">
            <FormField
              label="Proje durumu"
              hint="İşin kendisi ne aşamada? Yayın durumundan bağımsızdır."
            >
              <select
                name="lifecycle"
                defaultValue={project?.lifecycle ?? "ongoing"}
                className={inputClass}
              >
                <option value="ongoing">Devam ediyor</option>
                <option value="completed">Tamamlandı</option>
                <option value="inactive">Askıda</option>
              </select>
            </FormField>
          </div>

          <label className="admin-toggle-row mt-5">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? false}
            />
            <span>
              <strong>Anasayfada göster</strong>
              <span>Seçili projeler anasayfadaki proje bölümünde öne çıkar.</span>
            </span>
          </label>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-navy-ink">
              Kapak görseli
            </p>
            <ImageUpload
              initialUrl={project?.imageUrl}
              initialPublicId={project?.imagePublicId}
            />
            <p className="mt-2 text-xs leading-relaxed text-ink/55">
              Zorunlu değildir. Görsel eklenmezse proje kartı yalnızca metinle
              gösterilir.
            </p>
          </div>
        </aside>
      </form>

      {project && (
        <div className="xl:col-start-2">
          <TrashActionButton action={archiveProject} id={project.id} itemName={translation(project, "tr")?.title ?? project.slug} kind="trash" />
        </div>
      )}
    </div>
  );
}
