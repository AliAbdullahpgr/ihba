import { archiveProject, saveProject } from "@/app/admin/actions";
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
  const stateLabels: Record<string, string> = {
    draft: "Taslak",
    published: "Yayında",
    archived: "Çöp kutusunda",
  };

  return (
    <DocView>
      <form action={saveProject}>
        <input type="hidden" name="id" value={project?.id ?? ""} />
        <UnsavedChangesGuard />

        <DocControls
          meta={
            project
              ? [
                  { label: "Durum", value: stateLabels[project.state] ?? project.state },
                  { label: "Website adresi", value: `/projects/${project.slug}` },
                ]
              : [{ label: "Durum", value: "Yeni proje" }]
          }
        >
          <AdminSubmitButton>Kaydet</AdminSubmitButton>
        </DocControls>

        <DocFields>
          <DocMain>
            <DocSection title="Proje bilgileri">
              <DocRow>
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
              </DocRow>
            </DocSection>

            {(["en", "tr"] as const).map((locale) => {
              const item = translation(project, locale);
              const language = locale === "en" ? "English (isteğe bağlı)" : "Türkçe";
              return (
                <DocSection key={locale} title={language} badge={locale}>
                  <DocRow>
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
                  </DocRow>
                  <DocRow>
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
                  </DocRow>

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

                  <DocRow>
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
                    <FormField label="Etiketler" hint="Etiketleri virgülle ayırın.">
                      <textarea
                        name={`chips_${locale}`}
                        rows={5}
                        defaultValue={item?.chips.join(", ")}
                        className={inputClass}
                      />
                    </FormField>
                  </DocRow>
                </DocSection>
              );
            })}

            <ProjectGalleryManager initialImages={project?.projectImages ?? []} />
          </DocMain>

          <DocSidebar>
            <FormField
              label="Yayın durumu"
              hint="Projenin website'de görünüp görünmeyeceğini belirler."
            >
              <select name="state" defaultValue={project?.state ?? "draft"} className={inputClass}>
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

            <label className="admin-toggle-row">
              <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} />
              <span>
                <strong>Anasayfada göster</strong>
                <span>Seçili projeler anasayfadaki proje bölümünde öne çıkar.</span>
              </span>
            </label>

            <FormField
              label="Kapak görseli"
              hint="Zorunlu değildir. Görsel eklenmezse proje kartı yalnızca metinle gösterilir."
            >
              <ImageUpload
                initialUrl={project?.imageUrl}
                initialPublicId={project?.imagePublicId}
              />
            </FormField>

            {project && (
              <div className="pl-doc__danger">
                <TrashActionButton
                  action={archiveProject}
                  id={project.id}
                  itemName={translation(project, "tr")?.title ?? project.slug}
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
