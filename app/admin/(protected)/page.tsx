import { and, count, desc, eq, ne } from "drizzle-orm";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ContactRound,
  FilePenLine,
  FolderKanban,
  ImagePlus,
  Newspaper,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
  StatusBadge,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import {
  auditLogs,
  contactSubmissions,
  galleryItems,
  newsArticles,
  projects,
  siteContent,
  volunteerApplications,
} from "@/lib/db/schema";

function readContentValue(document: Record<string, unknown> | undefined, path: string[]) {
  let current: unknown = document;
  for (const segment of path) {
    if (!current || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === "string" ? current.trim() : "";
}

function formatActivity(action: string, entityType: string) {
  const actionLabel: Record<string, string> = {
    create: "oluşturuldu",
    update: "güncellendi",
    publish: "yayınlandı",
    archive: "arşivlendi",
    delete: "silindi",
    save: "kaydedildi",
    trash: "Çöp kutusuna taşındı",
    restore: "geri yüklendi",
    permanent_delete: "kalıcı olarak silindi",
    status: "durumu güncellendi",
    remove: "kaldırıldı",
  };
  const entityLabel: Record<string, string> = {
    project: "Proje",
    news: "Haber",
    gallery: "Galeri görseli",
    gallery_item: "Galeri görseli",
    content: "Website içeriği",
    site_content: "Website içeriği",
    president: "Başkan mesajı",
    board: "Yönetim kurulu üyesi",
    hero_slider: "Anasayfa bannerı",
    social_accounts: "Sosyal medya hesapları",
    contact_settings: "İletişim bilgileri",
    donation_settings: "Bağış bilgileri",
    contact_submission: "İletişim mesajı",
  };
  return `${entityLabel[entityType] ?? entityType} ${actionLabel[action] ?? action}`;
}

export default async function AdminOverviewPage() {
  const [
    [publishedProjects],
    [draftProjects],
    [publishedNews],
    [draftNews],
    [newMessages],
    [newApplications],
    [galleryCount],
    [turkishCopy],
    activity,
  ] = await Promise.all([
    db.select({ value: count() }).from(projects).where(eq(projects.state, "published")),
    db.select({ value: count() }).from(projects).where(eq(projects.state, "draft")),
    db.select({ value: count() }).from(newsArticles).where(eq(newsArticles.state, "published")),
    db.select({ value: count() }).from(newsArticles).where(eq(newsArticles.state, "draft")),
    db.select({ value: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "new")),
    db.select({ value: count() }).from(volunteerApplications).where(eq(volunteerApplications.status, "new")),
    db.select({ value: count() }).from(galleryItems).where(ne(galleryItems.state, "archived")),
    db.select({ document: siteContent.document }).from(siteContent).where(eq(siteContent.locale, "tr")).limit(1),
    db.select({ action: auditLogs.action, entityType: auditLogs.entityType, createdAt: auditLogs.createdAt })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(6),
  ]);

  const document = turkishCopy?.document;
  const requiredContent = [
    { label: "E-posta adresi", path: ["utility", "email"], href: "/admin/contact" },
    { label: "Telefon numarası", path: ["utility", "phone"], href: "/admin/contact" },
    { label: "Hakkımızda başlığı", path: ["about", "title"], href: "/admin/content?section=about" },
    { label: "Bağış açıklaması", path: ["donatePage", "accountsNote"], href: "/admin/donation" },
  ];
  const missingContent = requiredContent.filter(
    (item) => !readContentValue(document, item.path),
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="IHBA içerik çalışma alanı"
        title="Genel bakış"
        description="Website'in yayın durumunu ve bugün ilgilenmeniz gereken işleri tek yerde görün."
        action={
          <AdminButton href="/" variant="secondary">
            Website'i görüntüle
            <ArrowRight className="size-4" aria-hidden="true" />
          </AdminButton>
        }
      />

      <section className="admin-stat-grid" aria-label="İçerik özeti">
        <AdminStatCard
          label="Yayındaki projeler"
          value={publishedProjects.value}
          detail={`${draftProjects.value} taslak bekliyor`}
          href="/admin/projects"
          icon={FolderKanban}
          tone="blue"
        />
        <AdminStatCard
          label="Yayındaki haberler"
          value={publishedNews.value}
          detail={`${draftNews.value} taslak bekliyor`}
          href="/admin/news"
          icon={Newspaper}
          tone="green"
        />
        <AdminStatCard
          label="Okunmamış mesajlar"
          value={newMessages.value}
          detail="Yanıt bekleyen iletişim mesajları"
          href="/admin/messages"
          icon={ContactRound}
          tone="amber"
        />
        <AdminStatCard
          label="Yeni başvurular"
          value={newApplications.value}
          detail={`${galleryCount.value} galeri görseli aktif`}
          href="/admin/submissions"
          icon={UserRoundPlus}
          tone="navy"
        />
      </section>

      <div className="admin-overview-grid">
        <AdminCard
          eyebrow="Kontrol listesi"
          title="Website içerik sağlığı"
          description="Ziyaretçilerin doğru ve eksiksiz bilgi görmesi için bu alanları kontrol edin."
        >
          <div className="admin-overview-list">
            {requiredContent.map((item) => {
              const complete = !missingContent.includes(item);
              return (
                <Link key={item.label} href={item.href} className="admin-overview-row">
                  <span className={`admin-overview-check ${complete ? "is-complete" : ""}`}>
                    {complete ? (
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    ) : (
                      <FilePenLine className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <span className="admin-overview-row-copy">
                    <strong>{item.label}</strong>
                    <span>{complete ? "Bilgi girilmiş" : "Bilgi eklenmesi gerekiyor"}</span>
                  </span>
                  <ArrowRight className="admin-overview-row-arrow" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard
          eyebrow="Gelen işler"
          title="Bugün neye bakmalı?"
          description="İşinizi hızlandıracak kısa yollar."
        >
          <div className="admin-overview-actions">
            <Link href="/admin/messages" className="admin-action-tile">
              <span className="admin-action-tile-icon"><ContactRound className="size-4" aria-hidden="true" /></span>
              <span><strong>Mesajları kontrol et</strong><small>{newMessages.value} yeni mesaj</small></span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/admin/projects/new" className="admin-action-tile">
              <span className="admin-action-tile-icon"><FolderKanban className="size-4" aria-hidden="true" /></span>
              <span><strong>Yeni proje ekle</strong><small>Proje sayfası oluştur</small></span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/admin/gallery" className="admin-action-tile">
              <span className="admin-action-tile-icon"><ImagePlus className="size-4" aria-hidden="true" /></span>
              <span><strong>Galeriyi güncelle</strong><small>Yeni fotoğraf ekle veya sırala</small></span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/admin/content" className="admin-action-tile">
              <span className="admin-action-tile-icon"><ClipboardList className="size-4" aria-hidden="true" /></span>
              <span><strong>Website metinlerini düzenle</strong><small>Anasayfa ve kurumsal bilgiler</small></span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </AdminCard>
      </div>

      <AdminCard
        className="admin-recent-card"
        eyebrow="Kayıt"
        title="Son değişiklikler"
        description="Panelde yapılan son içerik güncellemeleri."
        action={
          <Link href="/admin/trash" className="admin-inline-link">
            Çöp kutusunu aç <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
      >
        {activity.length ? (
          <div className="admin-activity-list">
            {activity.map((entry, index) => (
              <div className="admin-activity-row" key={`${entry.createdAt.toISOString()}-${index}`}>
                <span className="admin-activity-icon"><FilePenLine className="size-4" aria-hidden="true" /></span>
                <span className="admin-activity-copy">
                  <strong>{formatActivity(entry.action, entry.entityType)}</strong>
                  <span>{entry.createdAt.toLocaleString("tr-TR")}</span>
                </span>
                <StatusBadge state={entry.action === "trash" ? "trash" : entry.action === "restore" ? "restored" : entry.action === "permanent_delete" ? "permanent_delete" : "saved"} />
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-activity-empty">
            <p>Henüz kaydedilmiş bir değişiklik görünmüyor.</p>
          </div>
        )}
      </AdminCard>
    </>
  );
}
