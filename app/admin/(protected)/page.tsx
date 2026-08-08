import { count, desc, eq, ne } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/lib/db/client";
import {
  auditLogs,
  boardMembers,
  contactSubmissions,
  galleryItems,
  newsArticles,
  newsletterSubscribers,
  projects,
  volunteerApplications,
} from "@/lib/db/schema";

/**
 * Payload's dashboard: nothing but the collections, grouped exactly as the nav
 * groups them, each a card that opens the list with a "create" action beside
 * it. No stat tiles, no shortcut grid — the card list *is* the shortcut grid.
 */

function formatActivity(action: string, entityType: string) {
  const actionLabel: Record<string, string> = {
    create: "oluşturuldu",
    update: "güncellendi",
    publish: "yayınlandı",
    archive: "arşivlendi",
    delete: "silindi",
    save: "kaydedildi",
    trash: "çöp kutusuna taşındı",
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

type DashboardCard = {
  title: string;
  href: string;
  createHref?: string;
  meta: string;
};

export default async function AdminDashboardPage() {
  const [
    [projectCount],
    [newsCount],
    [galleryCount],
    [boardCount],
    [newMessages],
    [newApplications],
    [subscriberCount],
    activity,
  ] = await Promise.all([
    db.select({ value: count() }).from(projects).where(ne(projects.state, "archived")),
    db.select({ value: count() }).from(newsArticles).where(ne(newsArticles.state, "archived")),
    db.select({ value: count() }).from(galleryItems).where(ne(galleryItems.state, "archived")),
    db.select({ value: count() }).from(boardMembers),
    db.select({ value: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, "new")),
    db.select({ value: count() }).from(volunteerApplications).where(eq(volunteerApplications.status, "new")),
    db.select({ value: count() }).from(newsletterSubscribers),
    db
      .select({
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(8),
  ]);

  const groups: Array<{ label: string; cards: DashboardCard[] }> = [
    {
      label: "İçerik yönetimi",
      cards: [
        {
          title: "Projeler",
          href: "/admin/projects",
          createHref: "/admin/projects/new",
          meta: `${projectCount.value} kayıt`,
        },
        {
          title: "Haberler",
          href: "/admin/news",
          createHref: "/admin/news/new",
          meta: `${newsCount.value} kayıt`,
        },
        {
          title: "Galeri",
          href: "/admin/gallery",
          createHref: "/admin/gallery/new",
          meta: `${galleryCount.value} görsel`,
        },
      ],
    },
    {
      label: "Website içeriği",
      cards: [
        { title: "Anasayfa düzeni", href: "/admin/homepage", meta: "Bölümler ve sıralama" },
        { title: "Anasayfa bannerı", href: "/admin/slider", meta: "Slider görselleri" },
        { title: "Diğer sayfa metinleri", href: "/admin/content", meta: "Türkçe ve İngilizce" },
        { title: "Başkan mesajı", href: "/admin/president", meta: "Tek sayfa" },
        { title: "Bağış sayfası metni", href: "/admin/donation", meta: "Açıklamalar ve hesaplar" },
        { title: "Yasal metinler", href: "/admin/legal", meta: "KVKK, gizlilik, çerez" },
      ],
    },
    {
      label: "Kurum",
      cards: [
        { title: "Kurum bilgileri", href: "/admin/organisation", meta: "İletişim ve kayıt bilgileri" },
        { title: "Yönetim kurulu", href: "/admin/board", meta: `${boardCount.value} üye` },
        { title: "Sosyal medya hesapları", href: "/admin/social", meta: "Website bağlantıları" },
      ],
    },
    {
      label: "İletişim",
      cards: [
        {
          title: "Mesajlar",
          href: "/admin/messages",
          meta: newMessages.value ? `${newMessages.value} okunmamış` : "Okunmamış mesaj yok",
        },
        {
          title: "Form başvuruları",
          href: "/admin/submissions",
          meta: newApplications.value
            ? `${newApplications.value} yeni başvuru`
            : `${subscriberCount.value} bülten kaydı`,
        },
      ],
    },
    {
      label: "Sistem",
      cards: [
        { title: "Medya kütüphanesi", href: "/admin/media", meta: "Tekrar kullanılabilir görseller" },
        { title: "Çöp kutusu", href: "/admin/trash", meta: "Silinen içerikler" },
        { title: "Değişiklik kaydı", href: "/admin/activity", meta: "Kim neyi değiştirdi" },
        { title: "Hesap", href: "/admin/account", meta: "Hesap ve güvenlik" },
      ],
    },
  ];

  return (
    <div className="pl-dashboard">
      <h1 className="pl-dashboard__title">Genel bakış</h1>

      {groups.map((group) => (
        <section className="pl-dashboard__group" key={group.label}>
          <h2 className="pl-dashboard__group-label">{group.label}</h2>
          <div className="pl-card-list">
            {group.cards.map((card) => (
              <div className="pl-card" key={card.href}>
                <Link href={card.href} className="pl-card__click" aria-label={card.title} />
                <div className="pl-card__copy">
                  <h3 className="pl-card__title">{card.title}</h3>
                  <p className="pl-card__meta">{card.meta}</p>
                </div>
                {card.createHref && (
                  <Link href={card.createHref} className="pl-card__action" aria-label={`${card.title} — yeni ekle`}>
                    +
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="pl-dashboard__group">
        <h2 className="pl-dashboard__group-label">Son değişiklikler</h2>
        {activity.length ? (
          <ul className="pl-activity">
            {activity.map((entry, index) => (
              <li key={`${entry.createdAt.toISOString()}-${index}`}>
                <span>{formatActivity(entry.action, entry.entityType)}</span>
                <time dateTime={entry.createdAt.toISOString()}>
                  {entry.createdAt.toLocaleString("tr-TR")}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pl-dashboard__empty">Henüz kaydedilmiş bir değişiklik görünmüyor.</p>
        )}
      </section>
    </div>
  );
}
