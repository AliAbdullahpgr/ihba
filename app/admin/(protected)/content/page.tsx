import {
  ArrowRight,
  Building2,
  FileText,
  Globe2,
  Landmark,
  Languages,
  Mail,
  MessageSquareText,
  Share2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/app/admin/components/AdminUi";
import { ContentCards } from "./ContentCards";
import { loadGroupCards, type ContentLocale } from "./document";

/**
 * Shortcuts to the purpose-built screens. `href` may be a function of the
 * chosen language: the ones pointing into the content editor have to follow
 * the switcher, while the dedicated screens handle both languages themselves.
 */
const sections = [
  {
    key: "homepage",
    title: "Anasayfa",
    description: "Banner, etki istatistikleri, hakkımızda önizlemesi ve bağış çağrısı.",
    // The group page, not `/hero` — this card names four sections, and each
    // one now has its own page.
    href: (locale: ContentLocale) => `/admin/content/${locale}/group/homepage`,
    icon: Globe2,
    status: "published",
  },
  {
    key: "about",
    title: "Hakkımızda",
    description: "Kurumun hikâyesi, yaklaşımı ve çalışma alanlarını anlatan metinler.",
    href: (locale: ContentLocale) => `/admin/content/${locale}/aboutPage`,
    icon: Building2,
    status: "published",
  },
  {
    key: "contact",
    title: "İletişim bilgileri",
    description: "E-posta, telefon ve adres bilgileri footer ve iletişim sayfasında görünür.",
    href: "/admin/organisation",
    icon: Mail,
    status: "published",
  },
  {
    key: "social",
    title: "Sosyal medya hesapları",
    description: "Instagram, Facebook, YouTube, X ve LinkedIn bağlantıları.",
    href: "/admin/social",
    icon: Share2,
    status: "draft",
  },
  {
    key: "donation",
    title: "Bağış ve IBAN bilgileri",
    description: "Bağış sayfasında görünen hesap ve yönlendirme metinleri.",
    href: "/admin/donation",
    icon: Landmark,
    status: "draft",
  },
  {
    key: "president",
    title: "Başkan mesajı",
    description: "Başkanın fotoğrafı, mesajı ve yayın önizlemesi.",
    href: "/admin/president",
    icon: MessageSquareText,
    status: "published",
  },
  {
    key: "legal",
    title: "Yasal metinler",
    description: "KVKK, gizlilik ve çerez politikası metinleri.",
    href: "/admin/legal",
    icon: ShieldCheck,
    status: "published",
  },
] as const;

type SearchParams = Promise<{ locale?: string }>;

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  /*
    The language is a parameter of this page rather than a different page.
    Switching used to navigate to /admin/content/en, which had the group cards
    but none of the shortcuts below — so changing language looked like half the
    screen had disappeared.
  */
  const locale: ContentLocale = (await searchParams).locale === "en" ? "en" : "tr";
  const groupCards = await loadGroupCards(locale);

  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Website içeriği"
        description="Ziyaretçilerin website'de gördüğü bilgileri, nerede göründüğünü bilerek bölüm bölüm yönetin."
        action={
          <div className="admin-language-switcher" aria-label="Dil seçimi">
            <Languages className="size-4" aria-hidden="true" />
            <Link
              href="/admin/content?locale=tr"
              className={locale === "tr" ? "admin-language-link is-active" : "admin-language-link"}
            >
              Türkçe
            </Link>
            <Link
              href="/admin/content?locale=en"
              className={locale === "en" ? "admin-language-link is-active" : "admin-language-link"}
            >
              English
            </Link>
          </div>
        }
      />

      {/*
        The website's own text, grouped by where it appears. These sit above
        the shortcut cards below, which lead to purpose-built screens rather
        than to the generic field editor.
      */}
      <ContentCards items={groupCards} />

      <AdminCard
        eyebrow="Bölümler"
        title="Neyi düzenlemek istiyorsunuz?"
        description="Her kart, içeriğin website'de nerede göründüğünü ve mevcut yayın durumunu açıklar."
      >
        <div className="admin-content-card-grid">
          {sections.map(({ key, title, description, href, icon: Icon, status }) => (
            <Link
              href={typeof href === "function" ? href(locale) : href}
              className="admin-content-card"
              key={key}
            >
              <span className="admin-content-card-icon"><Icon className="size-5" aria-hidden="true" /></span>
              <span className="admin-content-card-copy">
                <span className="admin-content-card-title">{title}</span>
                <span className="admin-content-card-description">{description}</span>
                <span className="admin-content-card-status"><StatusBadge state={status} /></span>
              </span>
              <ArrowRight className="admin-content-card-arrow" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </AdminCard>

      <div className="admin-content-language-note">
        <FileText className="size-4" aria-hidden="true" />
        <p><strong>Türkçe içerik ana kaynaktır.</strong> İngilizce alanları boş bırakırsanız website otomatik olarak Türkçe metni kullanır.</p>
      </div>
    </>
  );
}
