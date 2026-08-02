import { ArrowRight, Eye, GalleryHorizontalEnd, ImagePlus, Plus, Search } from "lucide-react";
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
import { galleryItems } from "@/lib/db/schema";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

async function getGallery() {
  return db.query.galleryItems.findMany({
    with: { galleryTranslations: true },
  });
}

type GalleryItem = Awaited<ReturnType<typeof getGallery>>[number];

function getTranslation(item: GalleryItem) {
  return (
    item.galleryTranslations.find((candidate) => candidate.locale === "tr") ??
    item.galleryTranslations.find((candidate) => candidate.locale === "en") ??
    item.galleryTranslations[0]
  );
}

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = first(params.q).trim().toLocaleLowerCase("tr-TR");
  const state = first(params.state, "all");
  const allRows = await getGallery();
  const rows = allRows
    .filter((item) => {
      if (state !== "all" && item.state !== state) return false;
      if (!q) return true;
      const translation = getTranslation(item);
      return [translation?.category, translation?.place, translation?.caption]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase("tr-TR").includes(q));
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.getTime() - b.createdAt.getTime());

  return (
    <>
      <AdminPageHeader
        eyebrow="İçerik yönetimi"
        title="Galeri"
        description="Saha fotoğraflarını görsel olarak yönetin, açıklamalarını ekleyin ve website sırasını belirleyin."
        action={
          <AdminButton href="/admin/gallery/new">
            <Plus className="size-4" aria-hidden="true" />
            Fotoğraf ekle
          </AdminButton>
        }
      />
      <AdminCard className="admin-gallery-card">
        <AdminListToolbar
          search={first(params.q)}
          searchPlaceholder="Galeri açıklaması veya konumunda ara…"
          status={state}
          statusOptions={[
            { value: "all", label: "Tüm durumlar" },
            { value: "published", label: "Yayında" },
            { value: "draft", label: "Taslak" },
            { value: "archived", label: "Arşivlendi" },
          ]}
        />
        {rows.length ? (
          <div className="admin-gallery-grid">
            {rows.map((item) => {
              const translation = getTranslation(item);
              return (
                <article className="admin-gallery-item" key={item.id}>
                  <Link href={`/admin/gallery/${item.id}`} className="admin-gallery-image-link">
                    <img src={item.imageUrl} alt={translation?.imageAlt ?? ""} className="admin-gallery-image" />
                    <span className="admin-gallery-order">#{item.sortOrder + 1}</span>
                  </Link>
                  <div className="admin-gallery-body">
                    <div className="admin-gallery-meta">
                      <StatusBadge state={item.state} />
                      <span>{item.layout === "wide" ? "Geniş" : item.layout === "portrait" ? "Dikey" : "Yatay"}</span>
                    </div>
                    <h2>{translation?.category || "Başlıksız fotoğraf"}</h2>
                    <p>{translation?.place || "Konum eklenmemiş"}</p>
                    <div className="admin-gallery-actions">
                      {item.state === "published" && (
                        <Link href="/gallery" target="_blank" className="admin-table-action" aria-label="Galeriyi website'de görüntüle">
                          <Eye className="size-3.5" aria-hidden="true" /> Görüntüle
                        </Link>
                      )}
                      <Link href={`/admin/gallery/${item.id}`} className="admin-table-action">
                        Düzenle <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={q || state !== "all" ? Search : GalleryHorizontalEnd}
            title={q || state !== "all" ? "Sonuç bulunamadı" : "Galeride henüz fotoğraf yok"}
            description={q || state !== "all" ? "Arama veya filtreleri değiştirip tekrar deneyin." : "İlk saha fotoğrafınızı ekleyerek başlayın."}
            action={
              q || state !== "all" ? (
                <AdminButton href="/admin/gallery" variant="secondary">Filtreleri temizle</AdminButton>
              ) : (
                <AdminButton href="/admin/gallery/new"><ImagePlus className="size-4" aria-hidden="true" /> Fotoğraf ekle</AdminButton>
              )
            }
          />
        )}
      </AdminCard>
    </>
  );
}
