"use client";

import { Check } from "lucide-react";
import { saveContactSettings, saveDonationSettings } from "@/app/admin/actions";
import { AdminCard, FormField, inputClass } from "@/app/admin/components/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";

type Locale = "tr" | "en";

function LocaleLabel({ locale }: { locale: Locale }) {
  return <div className="admin-form-locale-heading"><h2>{locale === "tr" ? "Türkçe (ana dil)" : "English (isteğe bağlı)"}</h2><span>{locale}</span></div>;
}

export function ContactSettingsForm({
  copies,
  saved,
}: {
  copies: Record<Locale, { email: string; phone: string; address: string }>;
  saved: boolean;
}) {
  return (
    <form action={saveContactSettings} className="admin-settings-form">
      <UnsavedChangesGuard />
      {saved && <div className="admin-feedback admin-feedback-success" role="status"><Check className="size-4" aria-hidden="true" /> İletişim bilgileri güncellendi.</div>}
      <AdminCard eyebrow="Website ve iletişim sayfası" title="İletişim bilgileri" description="Bu bilgiler footer, anasayfadaki iletişim özeti ve İletişim sayfasında görünür.">
        <div className="admin-settings-locale-grid">
          {(["tr", "en"] as const).map((locale) => (
            <section className="admin-settings-locale" key={locale}>
              <LocaleLabel locale={locale} />
              <div className="admin-settings-fields">
                <FormField label="E-posta adresi" required hint="Website footer'ında ve İletişim sayfasında görünür."><input className={inputClass} type="email" name={`email_${locale}`} required defaultValue={copies[locale].email} /></FormField>
                <FormField label="Telefon numarası" required hint="Ülke koduyla yazın. Örnek: +90 533 620 63 74"><input className={inputClass} name={`phone_${locale}`} required defaultValue={copies[locale].phone} /></FormField>
                <FormField label="Adres" required hint="İletişim sayfasında ve footer'da görünür."><textarea className={inputClass} name={`address_${locale}`} required rows={4} defaultValue={copies[locale].address} /></FormField>
              </div>
            </section>
          ))}
        </div>
        <div className="admin-settings-footer"><span>Türkçe ana dildir; İngilizce alanları boş bırakmak yerine ziyaretçilerin göreceği çeviriyi kontrol edin.</span><AdminSubmitButton>İletişim bilgilerini kaydet</AdminSubmitButton></div>
      </AdminCard>
    </form>
  );
}

export type DonationCopy = { title: string; lede: string; accountsNote: string };

export function DonationSettingsForm({
  copies,
  saved,
}: {
  copies: Record<Locale, DonationCopy>;
  saved: boolean;
}) {
  return (
    <form action={saveDonationSettings} className="admin-settings-form">
      <UnsavedChangesGuard />
      {saved && <div className="admin-feedback admin-feedback-success" role="status"><Check className="size-4" aria-hidden="true" /> Bağış bilgileri güncellendi.</div>}
      <AdminCard eyebrow="Bağış sayfası" title="Bağış sayfası metinleri" description="Ziyaretçiler bu metinleri Bağış sayfasında görür.">
        {/*
          The bank accounts themselves are the card directly below this one, on
          this same page — this form only owns the surrounding page copy.
        */}
        <p className="admin-field-hint" style={{ marginBottom: "16px" }}>
          Banka ve IBAN bilgilerini bu sayfanın alt kısmındaki bölümden ekleyip düzenleyebilirsiniz.
        </p>
        <div className="admin-settings-locale-grid">
          {(["tr", "en"] as const).map((locale) => (
            <section className="admin-settings-locale" key={locale}>
              <LocaleLabel locale={locale} />
              <div className="admin-settings-fields">
                <FormField label="Sayfa başlığı" required><input className={inputClass} name={`title_${locale}`} required defaultValue={copies[locale].title} /></FormField>
                <FormField label="Giriş açıklaması" required><textarea className={inputClass} name={`lede_${locale}`} required rows={3} defaultValue={copies[locale].lede} /></FormField>
                <FormField label="Banka bilgisi yoksa gösterilecek açıklama" required hint="Hiç banka hesabı yayında değilken bu metin gösterilir."><textarea className={inputClass} name={`accountsNote_${locale}`} required rows={3} defaultValue={copies[locale].accountsNote} /></FormField>
              </div>
            </section>
          ))}
        </div>
        <div className="admin-settings-footer"><span>IBAN değişiklikleri yayınlandığında Bağış sayfasında görünür.</span><AdminSubmitButton>Bağış bilgilerini kaydet</AdminSubmitButton></div>
      </AdminCard>
    </form>
  );
}
