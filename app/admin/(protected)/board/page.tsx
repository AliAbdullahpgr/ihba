import { asc, eq } from "drizzle-orm";
import { Save } from "lucide-react";
import {
  removeBoardMember,
  saveBoardMember,
} from "@/app/admin/actions";
import {
  AdminPageHeader,
  FormField,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { TrashActionButton } from "@/app/admin/components/TrashActionButton";
import { db } from "@/lib/db/client";
import { boardMembers } from "@/lib/db/schema";

function MemberForm({
  member,
}: {
  member?: {
    id: string;
    name: string;
    roleEn: string;
    roleTr: string;
    sortOrder: number;
    visible: boolean;
  };
}) {
  return (
    <div className="border border-line bg-white">
      <form action={saveBoardMember} className="p-5">
        <input type="hidden" name="id" value={member?.id ?? ""} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <FormField label="İsim" required>
            <input
              name="name"
              required
              defaultValue={member?.name}
              className={inputClass}
            />
          </FormField>
          <FormField label="Görev (İngilizce, isteğe bağlı)">
            <input
              name="roleEn"
              defaultValue={member?.roleEn}
              className={inputClass}
            />
          </FormField>
          <FormField label="Görev (Türkçe)" required>
            <input
              name="roleTr"
              required
              defaultValue={member?.roleTr}
              className={inputClass}
            />
          </FormField>
          <FormField label="Website sırası">
            <input
              name="sortOrder"
              type="number"
              min="0"
              required
              defaultValue={member?.sortOrder ?? 0}
              className={inputClass}
            />
          </FormField>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-navy-ink">
            <input
              type="checkbox"
              name="visible"
              defaultChecked={member?.visible ?? true}
              className="size-5 accent-navy"
            />
            Yönetim kurulu sayfasında göster
          </label>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-4 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Save className="size-4" />
            {member ? "Üyeyi kaydet" : "Üye ekle"}
          </button>
        </div>
      </form>
      {member && (
        <div className="border-t border-line px-5 py-3">
          <TrashActionButton action={removeBoardMember} id={member.id} itemName={member.name} kind="trash" />
        </div>
      )}
    </div>
  );
}

export default async function AdminBoardPage() {
  const members = await db
    .select()
    .from(boardMembers)
    .where(eq(boardMembers.visible, true))
    .orderBy(asc(boardMembers.sortOrder));
  return (
    <>
      <AdminPageHeader
        eyebrow="Kurum"
        title="Yönetim kurulu"
        description="Üyelerin isimleri ortak kullanılır; görevleri Türkçe ve İngilizce ayrı düzenlenebilir."
      />
      <div className="space-y-4">
        {members.map((member) => (
          <MemberForm key={member.id} member={member} />
        ))}
        <div className="pt-3">
          <h2 className="mb-3 text-sm font-semibold text-navy-ink">
            Yeni üye ekle
          </h2>
          <MemberForm />
        </div>
      </div>
    </>
  );
}
