import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { DonationSettingsForm, type DonationCopy } from "@/app/admin/components/SiteSettingsForms";
import { content } from "@/lib/content";
import { db } from "@/lib/db/client";
import { dict } from "@/lib/i18n";
import { mergeContentDefaults } from "@/lib/merge-content";

type SearchParams = Promise<{ saved?: string }>;

export default async function AdminDonationPage({ searchParams }: { searchParams: SearchParams }) {
  const rows = await db.query.siteContent.findMany();
  const tr = rows.find((row) => row.locale === "tr");
  const en = rows.find((row) => row.locale === "en");
  if (!tr || !en) return null;
  const copy = (locale: "tr" | "en", row: typeof tr): DonationCopy => {
    const document = mergeContentDefaults({ ...dict[locale], ...content[locale] }, row.document) as typeof dict.tr & typeof content.tr;
    return {
      title: document.donatePage.title,
      lede: document.donatePage.lede,
      accountsNote: document.donatePage.accountsNote,
    };
  };
  return (
    <>
      <AdminPageHeader eyebrow="Website içeriği" title="Bağış ve IBAN bilgileri" description="Bağış sayfasındaki açıklamayı ve banka bilgilerini ayrı, anlaşılır bir formdan yönetin." action={<Link href="/donate" target="_blank" rel="noreferrer" className="admin-button admin-button-secondary">Bağış sayfasını görüntüle <ArrowUpRight className="size-4" aria-hidden="true" /></Link>} />
      <DonationSettingsForm copies={{ tr: copy("tr", tr), en: copy("en", en) }} saved={(await searchParams).saved === "1"} />
    </>
  );
}
