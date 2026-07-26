import { Languages } from "lucide-react";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import Link from "next/link";

const languages = [
  {
    code: "en",
    name: "English",
    description: "Public navigation, page copy, labels and messages.",
  },
  {
    code: "tr",
    name: "Turkish",
    description: "Default public-language content and institutional copy.",
  },
] as const;

export default function AdminContentPage() {
  return (
    <>
      <AdminPageHeader
        title="Site content"
        description="Edit the copy used across public pages. Projects, news and board members have their own structured editors."
      />
      <div className="border border-line bg-white">
        {languages.map((language) => (
          <Link
            key={language.code}
            href={`/admin/content/${language.code}`}
            className="group flex items-center gap-4 border-b border-line p-5 last:border-0 hover:bg-azure-mist/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure"
          >
            <span className="grid size-11 shrink-0 place-items-center bg-navy-deep text-white">
              <Languages className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-navy-ink">
                {language.name}
              </span>
              <span className="mt-1 block text-sm text-ink/55">
                {language.description}
              </span>
            </span>
            <span className="text-sm font-semibold text-navy group-hover:text-azure-deep">
              Edit
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
