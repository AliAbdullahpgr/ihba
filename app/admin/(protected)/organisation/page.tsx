import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { OrganisationSettingsForm } from "@/app/admin/components/OrganisationSettingsForm";
import { readOrgSettings } from "@/app/admin/actions";
import { orgFieldDefs } from "@/lib/org-settings";

type SearchParams = Promise<{ saved?: string }>;

export default async function OrganisationSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const saved = (await searchParams).saved === "1";
  const settings = await readOrgSettings();

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
        description="İletişim bilgileri ve resmî kayıt numaraları. Bu bilgiler website'in her yerinde kullanılır."
      />
      <OrganisationSettingsForm values={values} saved={saved} />
    </>
  );
}
