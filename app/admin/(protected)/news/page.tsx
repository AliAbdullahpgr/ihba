import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  AdminButton,
  AdminPageHeader,
  StatusBadge,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import { newsArticles } from "@/lib/db/schema";

export default async function AdminNewsPage() {
  const rows = await db.query.newsArticles.findMany({
    with: { newsTranslations: true },
    orderBy: [desc(newsArticles.updatedAt)],
  });

  return (
    <>
      <AdminPageHeader
        title="News"
        description="Draft and publish bilingual field reports and announcements."
        action={
          <AdminButton href="/admin/news/new">
            <Plus className="size-4" />
            New article
          </AdminButton>
        }
      />
      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[680px] text-left">
          <thead className="border-b border-line bg-azure-mist/70 text-xs font-semibold uppercase text-ink/55">
            <tr>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Updated</th>
              <th className="w-20 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((article) => {
              const translation = article.newsTranslations.find(
                (item) => item.locale === "en"
              );
              return (
                <tr
                  key={article.id}
                  className="border-b border-line last:border-0 hover:bg-azure-mist/35"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-navy-ink">
                      {translation?.title ?? article.slug}
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      /news/{article.slug}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge state={article.state} />
                  </td>
                  <td className="px-4 py-4 text-sm text-ink/60">
                    {article.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/news/${article.id}`}
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
            <p className="font-semibold text-navy-ink">No articles yet</p>
            <p className="mt-1 text-sm text-ink/55">
              Draft the first field update when it is ready.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
