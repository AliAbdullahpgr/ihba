import {
  ArrowRight,
  Building2,
  FileText,
  Globe2,
  HeartHandshake,
  Landmark,
  Languages,
  Mail,
  MessageSquareText,
  Share2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/app/admin/components/AdminUi";

const sections = [
  {
    key: "homepage",
    title: "Anasayfa",
    description: "Banner, etki istatistikleri, hakkımızda önizlemesi ve bağış çağrısı.",
    href: "/admin/content/tr#hero",
    icon: Globe2,
    status: "published",
  },
  {
    key: "about",
    title: "Hakkımızda",
    description: "Kurumun hikâyesi, yaklaşımı ve çalışma alanlarını anlatan metinler.",
    href: "/admin/content/tr#aboutPage",
    icon: Building2,
    status: "published",
  },
  {
    key: "contact",
    title: "İletişim bilgileri",
    description: "E-posta, telefon ve adres bilgileri footer ve iletişim sayfasında görünür.",
    href: "/admin/contact",
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
    href: "/admin/content/tr#legalPages",
    icon: ShieldCheck,
    status: "published",
  },
] as const;

export default function AdminContentPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Website içeriği"
        title="Website içeriği"
        description="Ziyaretçilerin website'de gördüğü bilgileri, nerede göründüğünü bilerek bölüm bölüm yönetin."
        action={
          <div className="admin-language-switcher" aria-label="Dil seçimi">
            <Languages className="size-4" aria-hidden="true" />
            <Link href="/admin/content/tr" className="admin-language-link is-active">Türkçe</Link>
            <Link href="/admin/content/en" className="admin-language-link">English</Link>
          </div>
        }
      />

      <AdminCard
        eyebrow="Bölümler"
        title="Neyi düzenlemek istiyorsunuz?"
        description="Her kart, içeriğin website'de nerede göründüğünü ve mevcut yayın durumunu açıklar."
      >
        <div className="admin-content-card-grid">
          {sections.map(({ key, title, description, href, icon: Icon, status }) => (
            <Link href={href} className="admin-content-card" key={key}>
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
