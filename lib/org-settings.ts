/**
 * Organisation settings: the facts about the institution itself.
 *
 * The field list lives here, apart from both the form and the server action,
 * because three separate places need to agree on it — the inputs rendered to
 * the operator, the before/after diff shown in the confirmation dialog, and
 * the audit entry written on save. Defining a field once and deriving all
 * three from it is what keeps the confirmation honest: a field that is saved
 * but missing from this list would change silently.
 */

export type OrgFieldGroup = "contact" | "registry";

export type OrgFieldDef = {
  field: string;
  label: string;
  group: OrgFieldGroup;
  hint?: string;
  type?: "text" | "tel" | "email" | "url" | "textarea";
  placeholder?: string;
};

export const orgFieldDefs: OrgFieldDef[] = [
  {
    field: "phone",
    label: "Telefon",
    group: "contact",
    type: "tel",
    hint: "Website'in üst kısmında, iletişim sayfasında ve alt bilgide görünür.",
  },
  {
    field: "whatsapp",
    label: "WhatsApp numarası",
    group: "contact",
    type: "tel",
    hint: "Boş bırakılırsa WhatsApp bağlantısı gösterilmez.",
  },
  { field: "email", label: "E-posta", group: "contact", type: "email" },
  {
    field: "address",
    label: "Açık adres",
    group: "contact",
    type: "textarea",
    hint: "İletişim sayfasında ve alt bilgide görünür.",
  },
  {
    field: "mapsUrl",
    label: "Google Haritalar bağlantısı",
    group: "contact",
    type: "url",
    placeholder: "https://maps.google.com/…",
    hint: "Adresin haritadaki konumu. Boş bırakılırsa harita bağlantısı gösterilmez.",
  },
  {
    field: "workingHours",
    label: "Çalışma saatleri",
    group: "contact",
    placeholder: "Pazartesi – Cuma, 09:00 – 18:00",
  },
  { field: "registryNumber", label: "Kütük numarası", group: "registry" },
  { field: "taxNumber", label: "Vergi numarası", group: "registry" },
  { field: "mersisNumber", label: "MERSİS numarası", group: "registry" },
  {
    field: "establishedOn",
    label: "Kuruluş tarihi",
    group: "registry",
    placeholder: "19 Şubat 2025",
  },
  {
    field: "orgStatus",
    label: "Kurum statüsü",
    group: "registry",
    placeholder: "Dernek",
  },
];

/** Per-account fields; the diff labels them with the account's currency. */
export const bankFieldDefs = [
  { field: "currency", label: "Para birimi" },
  { field: "bankName", label: "Banka adı" },
  { field: "accountHolder", label: "Hesap sahibi" },
  { field: "iban", label: "IBAN" },
  { field: "active", label: "Yayında" },
] as const;

export type OrgSettingsValues = Record<string, string> & {
  heroSliderEnabled?: boolean;
};

export type BankAccountValues = {
  id: string;
  currency: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  active: boolean;
  sortOrder: number;
};

export const orgFieldGroups: Array<{
  key: OrgFieldGroup;
  title: string;
  description: string;
}> = [
  {
    key: "contact",
    title: "İletişim bilgileri",
    description:
      "Ziyaretçilerin size ulaşmak için kullandığı bilgiler. Website'in her sayfasında görünür.",
  },
  {
    key: "registry",
    title: "Kurumsal kayıt bilgileri",
    description:
      "Resmî kayıt bilgileri. Genellikle alt bilgide ve yasal metinlerde kullanılır.",
  },
];

/** IBANs are compared without spacing so re-formatting alone is not a change. */
export function normaliseIban(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function formatIban(value: string) {
  const compact = normaliseIban(value);
  return compact.replace(/(.{4})/g, "$1 ").trim();
}
