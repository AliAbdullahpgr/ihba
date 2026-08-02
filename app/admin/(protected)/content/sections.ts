/**
 * One editable content area per screen.
 *
 * The content editor used to render every top-level key of the site document
 * on a single page, which meant thirty collapsed sections and a lot of
 * scrolling before you found the one you wanted. Each entry here becomes its
 * own page under /admin/content/[locale]/[section], reached by clicking a card
 * on the locale index — so staff pick the thing they want to change first and
 * only then see fields.
 */
import {
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  Compass,
  FileQuestion,
  FileText,
  Files,
  Flag,
  Footprints,
  HandHeart,
  Handshake,
  Globe2,
  HeartHandshake,
  Home,
  Images,
  Info,
  Landmark,
  LayoutList,
  Mail,
  MailPlus,
  Megaphone,
  MessageSquareQuote,
  MousePointerClick,
  Navigation,
  Newspaper,
  PanelBottom,
  PanelTop,
  Quote,
  Share2,
  Sparkles,
  Type,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ContentSectionGroup = "homepage" | "pages" | "global";

export interface ContentSection {
  /** URL slug, and the top-level key of the site content document. */
  key: string;
  group: ContentSectionGroup;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Where the copy shows up on the public site, for the "view" link. */
  preview?: string;
  /**
   * Keys suppressed globally by `hiddenKeys` that this screen should show
   * anyway, because nothing else edits them.
   */
  reveal?: string[];
}

/**
 * Each group is its own page too. Listing all thirty section cards on one
 * index just moved the wall of choices up a level; the index now offers three
 * cards and the sections appear once you have picked one.
 */
export const contentGroups: Array<{
  key: ContentSectionGroup;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    key: "homepage",
    title: "Anasayfa bölümleri",
    description: "Ziyaretçilerin ilk gördüğü sayfadaki bölümler, yukarıdan aşağıya.",
    icon: Home,
  },
  {
    key: "pages",
    title: "İç sayfalar",
    description: "Menüden ulaşılan sayfaların başlık ve metinleri.",
    icon: Files,
  },
  {
    key: "global",
    title: "Her sayfada görünenler",
    description: "Menü, footer, form etiketleri gibi website genelinde tekrarlanan metinler.",
    icon: Globe2,
  },
];

export const contentGroupByKey = new Map<string, (typeof contentGroups)[number]>(
  contentGroups.map((group) => [group.key, group]),
);

export const contentSections: ContentSection[] = [
  // Anasayfa, yukarıdan aşağıya.
  {
    key: "hero",
    group: "homepage",
    title: "Giriş alanı (banner)",
    description: "Anasayfanın ilk ekranındaki başlık, açıklama ve çağrı butonları.",
    icon: PanelTop,
    preview: "/",
  },
  {
    key: "ticker",
    group: "homepage",
    title: "Kayan yazı şeridi",
    description: "Banner'ın hemen altında soldan sağa kayan kısa ifadeler.",
    icon: Type,
    preview: "/",
  },
  {
    key: "facts",
    group: "homepage",
    title: "Etki istatistikleri",
    description: "Çalışmalarımızın etkisini özetleyen rakamlar ve etiketleri.",
    icon: Award,
    preview: "/",
  },
  {
    key: "about",
    group: "homepage",
    title: "Hakkımızda önizlemesi",
    description: "Anasayfada kurumu kısaca anlatan bölüm; misyon, vizyon ve değerler.",
    icon: Info,
    preview: "/",
  },
  {
    key: "programs",
    group: "homepage",
    title: "Çalışma alanları bölümü",
    description: "Anasayfadaki çalışma alanı kartları, filtre etiketleri ve yönlendirmeler.",
    icon: Compass,
    preview: "/",
  },
  {
    key: "projects",
    group: "homepage",
    title: "Projeler bölümü",
    description: "Anasayfada projeleri tanıtan başlık ve açıklama metinleri.",
    icon: LayoutList,
    preview: "/",
  },
  {
    key: "approach",
    group: "homepage",
    title: "Yaklaşımımız adımları",
    description: "Çalışma yöntemimizi anlatan numaralı adımlar.",
    icon: Footprints,
    preview: "/",
  },
  {
    key: "presidentQuote",
    group: "homepage",
    title: "Başkan alıntısı",
    description: "Anasayfada görünen kısa başkan sözü, isim ve unvan.",
    icon: Quote,
    preview: "/",
  },
  {
    key: "campaign",
    group: "homepage",
    title: "Bağış çağrısı",
    description: "Anasayfadaki öne çıkan bağış kampanyası metinleri ve hedefi.",
    icon: HandHeart,
    preview: "/",
  },
  {
    key: "volunteer",
    group: "homepage",
    title: "Gönüllülük çağrısı",
    description: "Gönüllü olmaya davet eden anasayfa bölümü.",
    icon: Handshake,
    preview: "/",
  },
  {
    key: "faq",
    group: "homepage",
    title: "Sıkça sorulan sorular",
    description: "Anasayfadaki açılır soru-cevap listesi.",
    icon: FileQuestion,
    preview: "/",
    // The soru/cevap pairs live under `items`, hidden elsewhere because the
    // same key names things that are not free text.
    reveal: ["items"],
  },
  {
    key: "latestNews",
    group: "homepage",
    title: "Son haberler başlığı",
    description: "Anasayfadaki haber listesinin başlığı ve 'tümünü gör' bağlantısı.",
    icon: Newspaper,
    preview: "/",
  },
  {
    key: "newsletter",
    group: "homepage",
    title: "Bülten kaydı",
    description: "E-bülten formunun başlığı, açıklaması ve teşekkür mesajı.",
    icon: MailPlus,
    preview: "/",
  },
  {
    key: "contactSection",
    group: "homepage",
    title: "Anasayfa iletişim bölümü",
    description: "Footer'dan önce görünen kısa iletişim çağrısı.",
    icon: Megaphone,
    preview: "/",
  },

  // İç sayfalar.
  {
    key: "aboutPage",
    group: "pages",
    title: "Hakkımızda sayfası",
    description: "Kurumun hikâyesi, yaklaşımı ve çalışma ilkeleri panelleri.",
    icon: Building2,
    preview: "/about",
  },
  {
    key: "boardPage",
    group: "pages",
    title: "Yönetim kurulu sayfası",
    description: "Sayfa başlığı ve tablo etiketleri. Üye listesi Yönetim kurulu ekranından yönetilir.",
    icon: Users,
    preview: "/board",
  },
  {
    key: "presidentPage",
    group: "pages",
    title: "Başkan mesajı sayfası",
    description: "Sayfa başlığı ve giriş metni. Mesajın kendisi Başkan mesajı ekranından yazılır.",
    icon: MessageSquareQuote,
    preview: "/president",
  },
  {
    key: "areasPage",
    group: "pages",
    title: "Çalışma alanları sayfası",
    description: "Çalışma alanlarını ayrıntılı anlatan sayfanın metinleri.",
    icon: Flag,
    preview: "/areas-of-work",
  },
  {
    key: "projectsPage",
    group: "pages",
    title: "Projeler sayfası",
    description: "Proje listesi sayfasının başlık ve açıklama metinleri.",
    icon: CalendarDays,
    preview: "/projects",
  },
  {
    key: "newsPage",
    group: "pages",
    title: "Haberler sayfası",
    description: "Haber listesi sayfasının başlığı ve haber yokken görünen metin.",
    icon: Newspaper,
    preview: "/news",
  },
  {
    key: "galleryPage",
    group: "pages",
    title: "Galeri sayfası",
    description: "Fotoğraf galerisi sayfasının başlık ve açıklaması.",
    icon: Images,
    preview: "/gallery",
  },
  {
    key: "donatePage",
    group: "pages",
    title: "Bağış sayfası",
    description: "Bağış sayfasının metinleri. IBAN bilgileri Bağış bilgileri ekranındadır.",
    icon: Landmark,
    preview: "/donate",
  },
  {
    key: "volunteerPage",
    group: "pages",
    title: "Gönüllü ol sayfası",
    description: "Gönüllü başvuru sayfasının açıklama ve form yönlendirme metinleri.",
    icon: HeartHandshake,
    preview: "/volunteer",
  },
  {
    key: "contactPage",
    group: "pages",
    title: "İletişim sayfası",
    description: "İletişim sayfasının başlığı, adres etiketleri ve form başlığı.",
    icon: Mail,
    preview: "/contact",
  },
  {
    key: "identity",
    group: "pages",
    title: "Kurumsal kimlik bilgileri",
    description: "Resmî ad, kuruluş yılı, vergi bilgileri gibi künye satırları.",
    icon: BookOpen,
    preview: "/about",
  },

  // Website geneli.
  {
    key: "nav",
    group: "global",
    title: "Menü etiketleri",
    description: "Üst menüde ve footer'da görünen sayfa adları.",
    icon: Navigation,
  },
  {
    key: "utility",
    group: "global",
    title: "Slogan ve iletişim satırı",
    description: "Header ve footer'da görünen kısa slogan.",
    icon: Sparkles,
  },
  {
    key: "footer",
    group: "global",
    title: "Footer",
    description: "Adres satırı, bağlantı sütunları, şeffaflık notu ve telif metni.",
    icon: PanelBottom,
  },
  {
    key: "social",
    group: "global",
    title: "Sosyal medya etiketleri",
    description: "Sosyal medya bağlantılarının görünen adları. Adresler Sosyal medya ekranındadır.",
    icon: Share2,
  },
  {
    key: "forms",
    group: "global",
    title: "Form etiketleri ve uyarılar",
    description: "İletişim ve gönüllü formlarındaki alan adları, hata ve teşekkür mesajları.",
    icon: FileText,
  },
  {
    key: "common",
    group: "global",
    title: "Ortak butonlar",
    description: "Paylaş, kapat, ileri/geri gibi website genelinde tekrarlanan küçük metinler.",
    icon: MousePointerClick,
  },
];

export const contentSectionByKey = new Map(contentSections.map((s) => [s.key, s]));
