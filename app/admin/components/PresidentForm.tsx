import Link from "next/link";
import { Eye } from "lucide-react";
import { savePresidentProfile } from "@/app/admin/actions";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";

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
      <UnsavedChangesGuard />
      {saved && (
        <p
          role="status"
          className="border border-[#6da77f] bg-[#e8f5ed] px-4 py-3 text-sm font-semibold text-[#24613a]"
        >
          Başkan mesajı kaydedildi. Website'deki sayfalar güncellenecek.
        </p>
      )}

      <section className="border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
          <div>
            <h2 className="text-base font-semibold text-navy-ink">
              Başkan fotoğrafı
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/60">
              Bu fotoğraf anasayfadaki başkan mesajında ve Başkan Mesajı sayfasında görünür. Yeni bir görsel yükleyebilir veya kaldırabilirsiniz; metin fotoğraf olmadan da yayınlanır.
            </p>
          </div>
          <Link
            href="/president"
            target="_blank"
            className="inline-flex min-h-10 items-center gap-2 border border-navy-ink/20 bg-white px-3 text-sm font-semibold text-navy-ink hover:border-navy-ink/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Eye className="size-4" aria-hidden="true" />
              Sayfayı önizle
          </Link>
        </div>

        <div className="mt-5 max-w-xl">
          <ImageUpload
            initialUrl={photoEnabled ? image?.url : ""}
            initialPublicId={photoEnabled ? image?.publicId : ""}
            cropAspectRatio={1}
            cropLabel="Kare portre kırpma"
          />
          <p className="mt-2 text-xs leading-relaxed text-ink/55">
            Her iki yerde de kare kırpma kullanılır. Kaydetmeden önce odak noktasını ayarlayabilirsiniz. Görseli kaldırmak metni yayından kaldırmaz.
          </p>
        </div>
      </section>

      {(["tr", "en"] as const).map((locale) => {
        const copy = copies[locale];
        const language = locale === "tr" ? "Türkçe (ana dil)" : "English";
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
                  Dil seçimi için bu çeviriyi mümkün olduğunca eksiksiz tutun.
                </p>
              </div>
              <span className="text-xs font-bold uppercase text-ink/45">
                {locale}
              </span>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <FormField label="Sayfa başlığı">
                <input
                  name={`title_${locale}`}
                  required
                  defaultValue={copy.title}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Başkanın adı">
                <input
                  name={`name_${locale}`}
                  required
                  defaultValue={copy.name}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Görev veya unvan">
                <input
                  name={`role_${locale}`}
                  required
                  defaultValue={copy.role}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label="Görsel alternatif metni"
                hint="Ekran okuyucu kullanan ziyaretçiler için kişiyi ve bağlamı tarif edin."
              >
                <input
                  name={`imageAlt_${locale}`}
                  defaultValue={copy.imageAlt}
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="mt-5 space-y-5">
              <FormField label="Giriş cümlesi">
                <textarea
                  name={`lede_${locale}`}
                  required
                  rows={3}
                  defaultValue={copy.lede}
                  className={inputClass}
                />
              </FormField>
              <FormField
                label="Mesaj"
                hint="Mesajı doğrudan buraya yazın. Kalın yazı, başlık, liste ve bağlantı eklemek için üstteki düğmeleri kullanın."
              >
                <RichTextEditor
                  name={`message_${locale}`}
                  initialBlocks={copy.message}
                  required
                  requiredMessage="Başkan mesajı boş bırakılamaz."
                  placeholder="Başkanın mesajını buraya yazın…"
                />
              </FormField>
            </div>
          </section>
        );
      })}

      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-4">
        <p className="text-xs text-ink/55">
          Kaydettiğiniz değişiklikler, yayın durumuna göre website'de görünür.
        </p>
        <AdminSubmitButton>Başkan mesajını kaydet</AdminSubmitButton>
      </div>
    </form>
  );
}
