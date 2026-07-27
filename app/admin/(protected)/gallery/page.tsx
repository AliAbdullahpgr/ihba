import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  AdminButton,
  AdminPageHeader,
  StatusBadge,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import { galleryItems } from "@/lib/db/schema";

export default async function AdminGalleryPage() {
  const rows = await db.query.galleryItems.findMany({
    with: { galleryTranslations: true },
    orderBy: [asc(galleryItems.sortOrder), asc(galleryItems.createdAt)],
  });

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Upload, translate, order and publish photographs from the field."
        action={
          <AdminButton href="/admin/gallery/new">
            <Plus className="size-4" />
            New photograph
          </AdminButton>
        }
      />
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-line bg-azure-mist/70 text-xs font-semibold uppercase text-ink/55">
            <tr>
              <th className="px-4 py-3">Photograph</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Layout</th>
              <th className="px-4 py-3">State</th>
              <th className="w-20 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const translation =
                item.galleryTranslations.find(
                  (candidate) => candidate.locale === "en"
                ) ?? item.galleryTranslations[0];
              return (
                <tr
                  key={item.id}
                  className="border-b border-line last:border-0 hover:bg-azure-mist/35"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-16 w-20 shrink-0 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-navy-ink">
                          {translation?.category ?? "Untitled photograph"}
                        </p>
                        <p className="mt-1 text-xs text-ink/50">
                          {translation?.place}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-ink/60">
                    {item.sortOrder}
                  </td>
                  <td className="px-4 py-4 text-sm capitalize text-ink/60">
                    {item.layout}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge state={item.state} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/gallery/${item.id}`}
                      className="text-sm font-semibold text-navy hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-navy-ink">
              No gallery photographs yet
            </p>
            <p className="mt-1 text-sm text-ink/55">
              Add the first field photograph and publish it when ready.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
