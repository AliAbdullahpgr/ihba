import { asc } from "drizzle-orm";
import { Save, Trash2 } from "lucide-react";
import {
  removeBoardMember,
  saveBoardMember,
} from "@/app/admin/actions";
import {
  AdminPageHeader,
  FormField,
  inputClass,
} from "@/app/admin/components/AdminUi";
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
          <FormField label="Name">
            <input
              name="name"
              required
              defaultValue={member?.name}
              className={inputClass}
            />
          </FormField>
          <FormField label="Role in English (optional)">
            <input
              name="roleEn"
              defaultValue={member?.roleEn}
              className={inputClass}
            />
          </FormField>
          <FormField label="Role in Turkish">
            <input
              name="roleTr"
              required
              defaultValue={member?.roleTr}
              className={inputClass}
            />
          </FormField>
          <FormField label="Display order">
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
            Visible on public board page
          </label>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-4 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Save className="size-4" />
            {member ? "Save member" : "Add member"}
          </button>
        </div>
      </form>
      {member && (
        <form action={removeBoardMember} className="border-t border-line px-5 py-3">
          <input type="hidden" name="id" value={member.id} />
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#8f3029] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33b32]"
          >
            <Trash2 className="size-4" />
            Remove
          </button>
        </form>
      )}
    </div>
  );
}

export default async function AdminBoardPage() {
  const members = await db
    .select()
    .from(boardMembers)
    .orderBy(asc(boardMembers.sortOrder));
  return (
    <>
      <AdminPageHeader
        title="Board members"
        description="Names are shared across languages; roles can be translated independently."
      />
      <div className="space-y-4">
        {members.map((member) => (
          <MemberForm key={member.id} member={member} />
        ))}
        <div className="pt-3">
          <h2 className="mb-3 text-sm font-semibold text-navy-ink">
            Add board member
          </h2>
          <MemberForm />
        </div>
      </div>
    </>
  );
}
