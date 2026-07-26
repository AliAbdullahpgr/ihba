import { eq } from "drizzle-orm";
import { Save } from "lucide-react";
import { notFound } from "next/navigation";
import { saveSiteContent } from "@/app/admin/actions";
import {
  AdminPageHeader,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import { siteContent } from "@/lib/db/schema";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ saved?: string }>;
type Field = { path: Array<string | number>; value: string; label: string };

const hiddenKeys = new Set([
  "key",
  "categoryKey",
  "badgeKey",
  "details",
  "members",
  "items",
]);

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function flatten(
  value: unknown,
  path: Array<string | number> = []
): Field[] {
  if (typeof value === "string") {
    const last = path.at(-1);
    const parent = path.at(-2);
    const label =
      typeof last === "number"
        ? `${humanize(String(parent ?? "Item"))} ${last + 1}`
        : humanize(String(last ?? "Value"));
    return [{ path, value, label }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flatten(item, [...path, index]));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      hiddenKeys.has(key) ? [] : flatten(child, [...path, key])
    );
  }
  return [];
}

export default async function EditContentPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "tr") notFound();
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) notFound();
  const saved = (await searchParams).saved === "1";
  const document = row.document as Record<string, unknown>;
  const groups = Object.entries(document)
    .map(([key, value]) => ({ key, fields: flatten(value, [key]) }))
    .filter((group) => group.fields.length);

  return (
    <>
      <AdminPageHeader
        title={`${locale === "en" ? "English (optional)" : "Turkish"} content`}
        description={
          locale === "en"
            ? "Optional translation. Leave a field empty to use its Turkish value."
            : "Required source content, grouped by the public section that uses it."
        }
      />
      {saved && (
        <p
          role="status"
          className="mb-5 border border-[#6da77f] bg-[#e8f5ed] px-4 py-3 text-sm font-semibold text-[#24613a]"
        >
          Content saved and the public cache was refreshed.
        </p>
      )}
      <form action={saveSiteContent} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        {groups.map((group, index) => (
          <details
            key={group.key}
            open={index < 2}
            className="border border-line bg-white"
          >
            <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-navy-ink hover:bg-azure-mist/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure">
              {humanize(group.key)}
              <span className="ml-2 text-xs font-normal text-ink/45">
                {group.fields.length} fields
              </span>
            </summary>
            <div className="grid gap-5 border-t border-line p-5 lg:grid-cols-2">
              {group.fields.map((field) => {
                const long = field.value.length > 90 || field.value.includes("\n");
                const name = `field:${JSON.stringify(field.path)}`;
                return (
                  <label
                    key={name}
                    className={long ? "block lg:col-span-2" : "block"}
                  >
                    <span className="mb-2 block text-sm font-semibold text-navy-ink">
                      {field.label}
                    </span>
                    {long ? (
                      <textarea
                        name={name}
                        defaultValue={field.value}
                        rows={Math.min(8, Math.max(3, Math.ceil(field.value.length / 80)))}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        name={name}
                        defaultValue={field.value}
                        className={inputClass}
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </details>
        ))}
        <div className="sticky bottom-0 flex justify-end border border-line bg-white p-4">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-5 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            <Save className="size-4" />
            Save content
          </button>
        </div>
      </form>
    </>
  );
}
