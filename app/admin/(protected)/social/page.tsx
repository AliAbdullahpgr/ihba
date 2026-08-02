import { asc, eq } from "drizzle-orm";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import {
  SocialAccountsForm,
  type AdminSocialAccount,
} from "@/app/admin/components/SocialAccountsForm";
import { content } from "@/lib/content";
import { db } from "@/lib/db/client";
import { siteContent, socialAccounts } from "@/lib/db/schema";
import { dict, type SocialProfile } from "@/lib/i18n";
import { mergeContentDefaults } from "@/lib/merge-content";

type SearchParams = Promise<{ saved?: string }>;

/**
 * Social profiles used to live inside the per-locale content document. Until
 * the first save writes rows into `social_accounts`, the editor is seeded from
 * those older values so the existing links are not silently dropped.
 */
async function seedFromLegacyDocument(): Promise<AdminSocialAccount[]> {
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, "tr"),
  });
  if (!row) return [];
  const document = mergeContentDefaults(
    { ...dict.tr, ...content.tr },
    row.document
  ) as typeof dict.tr & typeof content.tr;
  const profiles = (document.socialLinks ?? []) as SocialProfile[];
  return profiles.map((profile) => ({
    id: "",
    platform: profile.key,
    label: profile.label ?? "",
    url: profile.url ?? "",
    active: profile.active ?? true,
    openInNewTab: profile.openInNewTab ?? true,
  }));
}

export default async function AdminSocialPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const saved = (await searchParams).saved === "1";
  const rows = await db
    .select()
    .from(socialAccounts)
    .orderBy(asc(socialAccounts.sortOrder));

  const accounts: AdminSocialAccount[] = rows.length
    ? rows.map((account) => ({
        id: account.id,
        platform: account.platform,
        label: account.label,
        url: account.url,
        active: account.active,
        openInNewTab: account.openInNewTab,
      }))
    : await seedFromLegacyDocument();

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Sosyal medya hesapları"
        description="Hesapları ekleyin, sırasını değiştirin ve hangilerinin yayında olacağını seçin. Bağlantısı olmayan hesaplar website'de görünmez."
        action={
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-button admin-button-secondary"
          >
            Website&apos;i görüntüle
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />
      <SocialAccountsForm initialAccounts={accounts} saved={saved} />
    </>
  );
}
