import { asc } from "drizzle-orm";

import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { OrganisationSettingsForm } from "@/app/admin/components/OrganisationSettingsForm";
import { readOrgSettings } from "@/app/admin/actions";
import { db } from "@/lib/db/client";
import { bankAccounts } from "@/lib/db/schema";
import { orgFieldDefs } from "@/lib/org-settings";

type SearchParams = Promise<{ saved?: string }>;

export default async function OrganisationSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const saved = (await searchParams).saved === "1";
  const settings = await readOrgSettings();
  const accounts = await db
    .select()
    .from(bankAccounts)
    .orderBy(asc(bankAccounts.sortOrder));

  // The settings row is created on first save, so an unseeded install renders
  // empty fields rather than failing.
  const values: Record<string, string> = {};
  for (const definition of orgFieldDefs) {
    const value = settings?.[definition.field as keyof typeof settings];
    values[definition.field] = typeof value === "string" ? value : "";
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Kurum"
        title="Kurum bilgileri"
        description="İletişim bilgileri, resmî kayıt numaraları ve banka hesapları. Bu bilgiler website'in her yerinde kullanılır."
      />
      <OrganisationSettingsForm
        values={values}
        accounts={accounts.map((account) => ({
          id: account.id,
          currency: account.currency,
          bankName: account.bankName,
          accountHolder: account.accountHolder,
          iban: account.iban,
          active: account.active,
          sortOrder: account.sortOrder,
        }))}
        saved={saved}
      />
    </>
  );
}
