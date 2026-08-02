import { Archive, FileText, FolderKanban, GalleryHorizontalEnd, Inbox, Mail, SlidersHorizontal, UsersRound } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import {
  permanentlyDeleteBoardMember,
  permanentlyDeleteContactMessage,
  permanentlyDeleteGalleryItem,
  permanentlyDeleteHeroSlide,
  permanentlyDeleteNews,
  permanentlyDeleteProject,
  restoreBoardMember,
  restoreContactMessage,
  restoreGalleryItem,
  restoreHeroSlide,
  restoreNews,
  restoreProject,
} from "@/app/admin/actions";
import { AdminCard, AdminPageHeader, EmptyState, StatusBadge } from "@/app/admin/components/AdminUi";
import { TrashActionButton } from "@/app/admin/components/TrashActionButton";
import { db } from "@/lib/db/client";
import { boardMembers, contactSubmissions, galleryItems, newsArticles, projects, siteContent } from "@/lib/db/schema";

function sliderTrashItems(rows: Array<{ locale: string; document: unknown }>) {
  return rows.flatMap((row) => {
    if (!row.document || typeof row.document !== "object") return [];
    const raw = (row.document as { heroSlidesTrash?: unknown }).heroSlidesTrash;
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((value) => {
    if (!value || typeof value !== "object") return [];
    const item = value as { id?: unknown; headline?: { pre?: unknown; highlight?: unknown; post?: unknown }; deletedAt?: unknown };
    const id = typeof item.id === "string" ? item.id : "";
    const deletedAt = typeof item.deletedAt === "string" ? item.deletedAt : "";
    if (!id || !deletedAt) return [];
    const headline = item.headline ?? {};
    return [{
      id,
      title: [headline.pre, headline.highlight, headline.post].filter((part): part is string => typeof part === "string").join("").trim() || "Başlıksız banner",
      deletedAt,
      locale: row.locale === "en" ? "en" : "tr",
    }];
    });
  });
}

export default async function AdminTrashPage() {
  const [projectRows, newsRows, galleryRows, boardRows, messageRows, siteContentRows] = await Promise.all([
    db.query.projects.findMany({ where: eq(projects.state, "archived"), with: { projectTranslations: true }, orderBy: desc(projects.updatedAt) }),
    db.query.newsArticles.findMany({ where: eq(newsArticles.state, "archived"), with: { newsTranslations: true }, orderBy: desc(newsArticles.updatedAt) }),
    db.query.galleryItems.findMany({ where: eq(galleryItems.state, "archived"), with: { galleryTranslations: true }, orderBy: desc(galleryItems.updatedAt) }),
    db.select().from(boardMembers).where(eq(boardMembers.visible, false)).orderBy(desc(boardMembers.updatedAt)),
    db.select().from(contactSubmissions).where(eq(contactSubmissions.status, "archived")).orderBy(desc(contactSubmissions.createdAt)),
    db.select({ locale: siteContent.locale, document: siteContent.document }).from(siteContent),
  ]);
  const sliderRows = sliderTrashItems(siteContentRows);
  const total = projectRows.length + newsRows.length + galleryRows.length + boardRows.length + messageRows.length + sliderRows.length;

  return (
    <>
      <AdminPageHeader eyebrow="Sistem" title="Çöp kutusu" description="Website'den kaldırdığınız önemli içerikler burada saklanır. Geri yükleyebilir veya yalnızca buradan kalıcı olarak silebilirsiniz." />
      <div className="admin-feedback admin-feedback-warning" role="note">
        <Archive className="size-4" aria-hidden="true" />
        Çöp kutusundaki içerikler public website'de görünmez. Kalıcı silme geri alınamaz.
      </div>

      {total === 0 ? (
        <AdminCard>
          <EmptyState icon={Inbox} title="Çöp kutusu boş" description="Kaldırılan içerikler burada görünür ve daha sonra geri yüklenebilir." />
        </AdminCard>
      ) : (
        <div className="admin-trash-grid">
          <AdminCard eyebrow={`${sliderRows.length} kayıt`} title="Anasayfa bannerları" description="Kaldırılan bannerlar; geri yüklediğinizde tekrar sıraya eklenir.">
            {sliderRows.length ? (
              <div className="admin-trash-list">
                {sliderRows.map((item) => (
                  <div className="admin-trash-row" key={item.id}>
                    <span className="admin-trash-icon"><SlidersHorizontal className="size-4" aria-hidden="true" /></span>
                    <span className="admin-trash-copy"><strong>{item.title}</strong><small>{new Date(item.deletedAt).toLocaleDateString("tr-TR")} tarihinde kaldırıldı · {item.locale === "en" ? "English" : "Türkçe"}</small></span>
                    <StatusBadge state="trash" />
                    <div className="admin-trash-actions"><TrashActionButton action={restoreHeroSlide} id={item.id} itemName={item.title} kind="restore" fields={{ locale: item.locale }} /><TrashActionButton action={permanentlyDeleteHeroSlide} id={item.id} itemName={item.title} kind="permanent" fields={{ locale: item.locale }} /></div>
                  </div>
                ))}
              </div>
            ) : <p className="admin-trash-empty">Kaldırılmış banner yok.</p>}
          </AdminCard>

          <AdminCard eyebrow={`${projectRows.length} kayıt`} title="Projeler" description="Kaldırılan proje sayfaları.">
            {projectRows.length ? (
              <div className="admin-trash-list">
                {projectRows.map((item) => {
                  const title = item.projectTranslations.find((t) => t.locale === "tr")?.title ?? item.projectTranslations[0]?.title ?? item.slug;
                  return (
                    <div className="admin-trash-row" key={item.id}>
                      <span className="admin-trash-icon"><FolderKanban className="size-4" aria-hidden="true" /></span>
                      <span className="admin-trash-copy"><strong>{title}</strong><small>{item.updatedAt.toLocaleDateString("tr-TR")} tarihinde kaldırıldı</small></span>
                      <StatusBadge state="trash" />
                      <div className="admin-trash-actions"><TrashActionButton action={restoreProject} id={item.id} itemName={title} kind="restore" state="draft" /><TrashActionButton action={permanentlyDeleteProject} id={item.id} itemName={title} kind="permanent" /></div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="admin-trash-empty">Kaldırılmış proje yok.</p>}
          </AdminCard>

          <AdminCard eyebrow={`${newsRows.length} kayıt`} title="Haberler" description="Kaldırılan haber ve duyurular.">
            {newsRows.length ? (
              <div className="admin-trash-list">
                {newsRows.map((item) => {
                  const title = item.newsTranslations.find((t) => t.locale === "tr")?.title ?? item.newsTranslations[0]?.title ?? item.slug;
                  return (
                    <div className="admin-trash-row" key={item.id}>
                      <span className="admin-trash-icon"><FileText className="size-4" aria-hidden="true" /></span>
                      <span className="admin-trash-copy"><strong>{title}</strong><small>{item.updatedAt.toLocaleDateString("tr-TR")} tarihinde kaldırıldı</small></span>
                      <StatusBadge state="trash" />
                      <div className="admin-trash-actions"><TrashActionButton action={restoreNews} id={item.id} itemName={title} kind="restore" state="draft" /><TrashActionButton action={permanentlyDeleteNews} id={item.id} itemName={title} kind="permanent" /></div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="admin-trash-empty">Kaldırılmış haber yok.</p>}
          </AdminCard>

          <AdminCard eyebrow={`${galleryRows.length} kayıt`} title="Galeri" description="Kaldırılan fotoğraflar.">
            {galleryRows.length ? (
              <div className="admin-trash-list">
                {galleryRows.map((item) => {
                  const title = item.galleryTranslations.find((t) => t.locale === "tr")?.category ?? item.galleryTranslations[0]?.category ?? "Başlıksız fotoğraf";
                  return (
                    <div className="admin-trash-row" key={item.id}>
                      <span className="admin-trash-icon"><GalleryHorizontalEnd className="size-4" aria-hidden="true" /></span>
                      <span className="admin-trash-copy"><strong>{title}</strong><small>{item.updatedAt.toLocaleDateString("tr-TR")} tarihinde kaldırıldı</small></span>
                      <StatusBadge state="trash" />
                      <div className="admin-trash-actions"><TrashActionButton action={restoreGalleryItem} id={item.id} itemName={title} kind="restore" state="draft" /><TrashActionButton action={permanentlyDeleteGalleryItem} id={item.id} itemName={title} kind="permanent" /></div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="admin-trash-empty">Kaldırılmış galeri görseli yok.</p>}
          </AdminCard>

          <AdminCard eyebrow={`${boardRows.length} kayıt`} title="Yönetim kurulu" description="Website'den kaldırılan üyeler.">
            {boardRows.length ? (
              <div className="admin-trash-list">
                {boardRows.map((item) => (
                  <div className="admin-trash-row" key={item.id}>
                    <span className="admin-trash-icon"><UsersRound className="size-4" aria-hidden="true" /></span>
                    <span className="admin-trash-copy"><strong>{item.name}</strong><small>{item.updatedAt.toLocaleDateString("tr-TR")} tarihinde kaldırıldı</small></span>
                    <StatusBadge state="trash" />
                    <div className="admin-trash-actions"><TrashActionButton action={restoreBoardMember} id={item.id} itemName={item.name} kind="restore" /><TrashActionButton action={permanentlyDeleteBoardMember} id={item.id} itemName={item.name} kind="permanent" /></div>
                  </div>
                ))}
              </div>
            ) : <p className="admin-trash-empty">Kaldırılmış kurul üyesi yok.</p>}
          </AdminCard>

          <AdminCard eyebrow={`${messageRows.length} kayıt`} title="Mesajlar" description="Çöp kutusuna taşınan iletişim mesajları.">
            {messageRows.length ? (
              <div className="admin-trash-list">
                {messageRows.map((item) => {
                  const title = item.subject || item.fullName;
                  return (
                    <div className="admin-trash-row" key={item.id}>
                      <span className="admin-trash-icon"><Mail className="size-4" aria-hidden="true" /></span>
                      <span className="admin-trash-copy"><strong>{title}</strong><small>{item.fullName} · {item.createdAt.toLocaleDateString("tr-TR")}</small></span>
                      <StatusBadge state="trash" />
                      <div className="admin-trash-actions"><TrashActionButton action={restoreContactMessage} id={item.id} itemName={title} kind="restore" /><TrashActionButton action={permanentlyDeleteContactMessage} id={item.id} itemName={title} kind="permanent" /></div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="admin-trash-empty">Kaldırılmış mesaj yok.</p>}
          </AdminCard>
        </div>
      )}
    </>
  );
}
