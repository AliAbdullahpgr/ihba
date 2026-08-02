import { ArrowLeft, ArrowRight, Eye, Newspaper, Plus, Search } from "lucide-react";
import Link from "next/link";
import {
  AdminButton,
  AdminCard,
  AdminListToolbar,
  AdminPageHeader,
  EmptyState,
  StatusBadge,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import { newsArticles } from "@/lib/db/schema";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

async function getNews() {
  return db.query.newsArticles.findMany({
    with: { newsTranslations: true },
  });
}

type Article = Awaited<ReturnType<typeof getNews>>[number];

function getTitle(article: Article) {
  return (
    article.newsTranslations.find((item) => item.locale === "tr")?.title ??
    article.newsTranslations.find((item) => item.locale === "en")?.title ??
    article.slug
  );
}

function queryLink({ q, state, sort, page }: { q: string; state: string; sort: string; page: number }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (state !== "all") params.set("state", state);
  if (sort !== "updated") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/news?${query}` : "/admin/news";
}

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = first(params.q).trim().toLocaleLowerCase("tr-TR");
  const state = first(params.state, "all");
  const sort = first(params.sort, "updated");
  const requestedPage = Math.max(1, Number(first(params.page, "1")) || 1);
  const allRows = await getNews();
  const filtered = allRows
    .filter((article) => {
      if (state !== "all" && article.state !== state) return false;
      if (!q) return true;
      return (
        getTitle(article).toLocaleLowerCase("tr-TR").includes(q) ||
        article.slug.toLocaleLowerCase("tr-TR").includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === "title") return getTitle(a).localeCompare(getTitle(b), "tr");
      if (sort === "published") return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <AdminPageHeader
        eyebrow="İçerik yönetimi"
        title="Haberler"
        description="Saha haberlerini ve duyuruları taslak olarak hazırlayın, önizleyin ve yayınlayın."
        action={
          <AdminButton href="/admin/news/new">
            <Plus className="size-4" aria-hidden="true" />
            Yeni haber
          </AdminButton>
        }
      />
      <AdminCard className="admin-table-card">
        <AdminListToolbar
          search={first(params.q)}
          searchPlaceholder="Haber başlığında veya adresinde ara…"
          status={state}
          statusOptions={[
            { value: "all", label: "Tüm durumlar" },
            { value: "published", label: "Yayında" },
            { value: "draft", label: "Taslak" },
            { value: "archived", label: "Arşivlendi" },
          ]}
          sort={sort}
          sortOptions={[
            { value: "updated", label: "Son güncellenen" },
            { value: "published", label: "Yayın tarihine göre" },
            { value: "title", label: "Ada göre" },
          ]}
        />

        {rows.length ? (
          <>
            <div className="admin-table-scroll">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Haber</th>
                    <th>Yayın durumu</th>
                    <th>Yayın tarihi</th>
                    <th>Son güncelleme</th>
                    <th><span className="sr-only">İşlemler</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <div className="admin-table-media">
                          {article.imageUrl ? (
                            <img src={article.imageUrl} alt="" className="admin-table-thumb" />
                          ) : (
                            <span className="admin-table-thumb grid place-items-center text-azure"><Newspaper className="size-4" aria-hidden="true" /></span>
                          )}
                          <span>
                            <span className="admin-table-primary block">{getTitle(article)}</span>
                            <span className="admin-table-secondary">/news/{article.slug}</span>
                          </span>
                        </div>
                      </td>
                      <td><StatusBadge state={article.state} /></td>
                      <td>{article.publishedAt?.toLocaleDateString("tr-TR") ?? "Henüz yayınlanmadı"}</td>
                      <td>{article.updatedAt.toLocaleDateString("tr-TR")}</td>
                      <td>
                        <div className="admin-table-actions">
                          {article.state === "published" && (
                            <Link href={`/news/${article.slug}`} target="_blank" className="admin-table-action" aria-label={`${getTitle(article)} haberini görüntüle`}>
                              <Eye className="size-3.5" aria-hidden="true" /> Görüntüle
                            </Link>
                          )}
                          <Link href={`/admin/news/${article.id}`} className="admin-table-action">
                            Düzenle <ArrowRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-pagination">
              <span className="admin-pagination-copy">
                {filtered.length} haberden {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} gösteriliyor
              </span>
              <div className="admin-pagination-actions">
                <Link href={queryLink({ q: first(params.q), state, sort, page: page - 1 })} className={`admin-pagination-link ${page <= 1 ? "is-disabled" : ""}`} aria-disabled={page <= 1}>
                  <ArrowLeft className="size-3.5" aria-hidden="true" /> Önceki
                </Link>
                <Link href={queryLink({ q: first(params.q), state, sort, page: page + 1 })} className={`admin-pagination-link ${page >= pageCount ? "is-disabled" : ""}`} aria-disabled={page >= pageCount}>
                  Sonraki <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={q || state !== "all" ? Search : Newspaper}
            title={q || state !== "all" ? "Sonuç bulunamadı" : "Henüz haber yok"}
            description={q || state !== "all" ? "Arama veya filtreleri değiştirip tekrar deneyin." : "İlk haberinizi taslak olarak oluşturun."}
            action={
              q || state !== "all" ? (
                <AdminButton href="/admin/news" variant="secondary">Filtreleri temizle</AdminButton>
              ) : (
                <AdminButton href="/admin/news/new"><Plus className="size-4" aria-hidden="true" /> Yeni haber</AdminButton>
              )
            }
          />
        )}
      </AdminCard>
    </>
  );
}
