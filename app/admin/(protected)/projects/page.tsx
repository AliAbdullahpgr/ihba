import { ArrowLeft, ArrowRight, Eye, FolderKanban, Plus, Search, SlidersHorizontal } from "lucide-react";
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
import { projects } from "@/lib/db/schema";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

function getTitle(project: Awaited<ReturnType<typeof getProjects>>[number]) {
  return (
    project.projectTranslations.find((item) => item.locale === "tr")?.title ??
    project.projectTranslations.find((item) => item.locale === "en")?.title ??
    project.slug
  );
}

async function getProjects() {
  return db.query.projects.findMany({
    with: { projectTranslations: true },
  });
}

function queryLink({ q, state, sort, page }: { q: string; state: string; sort: string; page: number }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (state !== "all") params.set("state", state);
  if (sort !== "updated") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/projects?${query}` : "/admin/projects";
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = first(params.q).trim().toLocaleLowerCase("tr-TR");
  const state = first(params.state, "all");
  const sort = first(params.sort, "updated");
  const requestedPage = Math.max(1, Number(first(params.page, "1")) || 1);
  const allRows = await getProjects();
  const filtered = allRows
    .filter((project) => {
      if (state !== "all" && project.state !== state) return false;
      if (!q) return true;
      const title = getTitle(project).toLocaleLowerCase("tr-TR");
      return title.includes(q) || project.slug.toLocaleLowerCase("tr-TR").includes(q);
    })
    .sort((a, b) => {
      if (sort === "title") return getTitle(a).localeCompare(getTitle(b), "tr");
      if (sort === "order") return a.sortOrder - b.sortOrder;
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
        title="Projeler"
        description="Projelerin website'de nasıl göründüğünü, yayın durumunu ve kapak görselini yönetin."
        action={
          <AdminButton href="/admin/projects/new">
            <Plus className="size-4" aria-hidden="true" />
            Yeni proje
          </AdminButton>
        }
      />

      <AdminCard className="admin-table-card">
        <AdminListToolbar
          search={first(params.q)}
          searchPlaceholder="Proje adı veya website adresinde ara…"
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
            { value: "order", label: "Website sırası" },
            { value: "title", label: "Ada göre" },
          ]}
        />

        {rows.length ? (
          <>
            <div className="admin-table-scroll">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Proje</th>
                    <th>Yayın durumu</th>
                    <th>Website sırası</th>
                    <th>Son güncelleme</th>
                    <th><span className="sr-only">İşlemler</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div className="admin-table-media">
                          {project.imageUrl ? (
                            <img src={project.imageUrl} alt="" className="admin-table-thumb" />
                          ) : (
                            <span className="admin-table-thumb grid place-items-center text-azure"><FolderKanban className="size-4" aria-hidden="true" /></span>
                          )}
                          <span>
                            <span className="admin-table-primary block">{getTitle(project)}</span>
                            <span className="admin-table-secondary">/projects/{project.slug}</span>
                          </span>
                        </div>
                      </td>
                      <td><StatusBadge state={project.state} /></td>
                      <td>{project.sortOrder}</td>
                      <td>{project.updatedAt.toLocaleDateString("tr-TR")}</td>
                      <td>
                        <div className="admin-table-actions">
                          {project.state === "published" && (
                            <Link href={`/projects/${project.slug}`} target="_blank" className="admin-table-action" aria-label={`${getTitle(project)} projesini görüntüle`}>
                              <Eye className="size-3.5" aria-hidden="true" />
                              Görüntüle
                            </Link>
                          )}
                          <Link href={`/admin/projects/${project.id}`} className="admin-table-action">
                            Düzenle
                            <ArrowRight className="size-3.5" aria-hidden="true" />
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
                {filtered.length} projeden {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} gösteriliyor
              </span>
              <div className="admin-pagination-actions">
                <Link
                  href={queryLink({ q: first(params.q), state, sort, page: page - 1 })}
                  className={`admin-pagination-link ${page <= 1 ? "is-disabled" : ""}`}
                  aria-disabled={page <= 1}
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" /> Önceki
                </Link>
                <Link
                  href={queryLink({ q: first(params.q), state, sort, page: page + 1 })}
                  className={`admin-pagination-link ${page >= pageCount ? "is-disabled" : ""}`}
                  aria-disabled={page >= pageCount}
                >
                  Sonraki <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={q || state !== "all" ? Search : FolderKanban}
            title={q || state !== "all" ? "Sonuç bulunamadı" : "Henüz proje yok"}
            description={q || state !== "all" ? "Arama veya filtreleri değiştirip tekrar deneyin." : "İlk proje sayfanızı ekleyerek başlayın."}
            action={
              q || state !== "all" ? (
                <AdminButton href="/admin/projects" variant="secondary">Filtreleri temizle</AdminButton>
              ) : (
                <AdminButton href="/admin/projects/new"><Plus className="size-4" aria-hidden="true" /> Yeni proje</AdminButton>
              )
            }
          />
        )}
      </AdminCard>
    </>
  );
}
