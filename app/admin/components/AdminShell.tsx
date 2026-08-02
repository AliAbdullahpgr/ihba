"use client";

import {
  Building2,
  CircleHelp,
  FileText,
  FolderKanban,
  GalleryHorizontalEnd,
  History,
  ImagePlus,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

type NavItem = {
  href: string;
  label: string;
  description?: string;
  icon: typeof LayoutDashboard;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    label: "Genel",
    items: [
      {
        href: "/admin",
        label: "Genel bakış",
        description: "Yayın durumu ve yapılacaklar",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Website içeriği",
    items: [
      {
        href: "/admin/homepage",
        label: "Anasayfa düzeni",
        description: "Anasayfa bölümlerini sırayla görün ve düzenleyin",
        icon: LayoutTemplate,
      },
      {
        href: "/admin/slider",
        label: "Anasayfa bannerı",
        description: "Slider görsellerini ve sırasını yönetin",
        icon: GalleryHorizontalEnd,
      },
      {
        href: "/admin/content",
        label: "Diğer sayfa metinleri",
        description: "Website'de görünen metinleri yönetin",
        icon: FileText,
      },
      {
        href: "/admin/president",
        label: "Başkan mesajı",
        description: "Başkanın mesajını düzenleyin",
        icon: UserRound,
      },
      {
        href: "/admin/social",
        label: "Sosyal medya hesapları",
        description: "Website bağlantılarını yönetin",
        icon: SlidersHorizontal,
      },
      {
        href: "/admin/donation",
        label: "Bağış sayfası metni",
        description: "Bağış sayfasındaki açıklamalar",
        icon: ShieldCheck,
      },
      {
        href: "/admin/legal",
        label: "Yasal metinler",
        description: "KVKK, gizlilik ve çerez metinleri",
        icon: FileText,
      },
    ],
  },
  {
    label: "İçerik yönetimi",
    items: [
      {
        href: "/admin/projects",
        label: "Projeler",
        description: "Projeleri ve yayın durumunu yönetin",
        icon: FolderKanban,
      },
      {
        href: "/admin/news",
        label: "Haberler",
        description: "Haber ve duyuruları yayınlayın",
        icon: Newspaper,
      },
      {
        href: "/admin/gallery",
        label: "Galeri",
        description: "Fotoğrafları ve açıklamaları yönetin",
        icon: ImagePlus,
      },
    ],
  },
  {
    label: "Kurum",
    items: [
      {
        href: "/admin/organisation",
        label: "Kurum bilgileri",
        description: "İletişim, kayıt numaraları ve IBAN",
        icon: Building2,
      },
      {
        href: "/admin/board",
        label: "Yönetim kurulu",
        description: "Kurul üyelerini yönetin",
        icon: UsersRound,
      },
      {
        href: "/admin/activity",
        label: "Değişiklik kaydı",
        description: "Kim neyi ne zaman değiştirdi",
        icon: History,
      },
    ],
  },
  {
    label: "İletişim",
    items: [
      {
        href: "/admin/messages",
        label: "Mesajlar",
        description: "Website iletişim mesajları",
        icon: Mail,
      },
      {
        href: "/admin/submissions",
        label: "Form başvuruları",
        description: "Gönüllü ve bülten kayıtları",
        icon: FolderKanban,
      },
    ],
  },
  {
    label: "Sistem",
    items: [
      {
        href: "/admin/media",
        label: "Medya kütüphanesi",
        description: "Tekrar kullanılabilir görseller",
        icon: ImagePlus,
      },
      {
        href: "/admin/trash",
        label: "Çöp kutusu",
        description: "Silinen içerikleri geri yükleyin",
        icon: Trash2,
      },
      {
        href: "/admin/account",
        label: "Hesap",
        description: "Hesap ve güvenlik ayarları",
        icon: Settings,
      },
    ],
  },
];

function isItemActive(pathname: string, href: string, search = "") {
  const [baseHref, query] = href.split("?");
  if (query && pathname === baseHref) {
    return new URLSearchParams(query).get("section") === search;
  }
  if (baseHref === "/admin/content" && pathname === baseHref) {
    return search === "";
  }
  if (baseHref === "/admin") return pathname === baseHref;
  return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}

function getCurrentLabel(pathname: string, search: string) {
  for (const group of navigation) {
    const item = group.items.find((candidate) =>
      isItemActive(pathname, candidate.href, search),
    );
    if (item) return { group: group.label, label: item.label };
  }
  return { group: "IHBA", label: "Yönetim paneli" };
}

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasDrawerOpen = useRef(false);
  const section = searchParams.get("section") ?? "";
  const current = useMemo(
    () => getCurrentLabel(pathname, section),
    [pathname, section],
  );

  useEffect(() => {
    if (!drawerOpen) {
      if (wasDrawerOpen.current) menuButtonRef.current?.focus({ preventScroll: true });
      wasDrawerOpen.current = false;
      return;
    }
    wasDrawerOpen.current = true;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  async function signOut() {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const renderNavigation = (mobile = false) => (
    <>
      <div className="admin-brand">
        <Link
          href="/admin"
          onClick={() => setDrawerOpen(false)}
          className="admin-brand-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <img src="/brand/logo-white.png" alt="IHBA" className="admin-brand-logo" />
          <span className="admin-brand-tag">ADMIN</span>
        </Link>
        {mobile && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="admin-icon-button admin-icon-button-dark"
            aria-label="Menüyü kapat"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Yönetim paneli navigasyonu" className="admin-nav">
        {navigation.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <p className="admin-nav-label">{group.label}</p>
            <ul className="admin-nav-list">
              {group.items.map(({ href, label, description, icon: Icon }) => {
                const active = isItemActive(pathname, href, section);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      title={collapsed && !mobile ? description : undefined}
                      onClick={() => setDrawerOpen(false)}
                      className={`admin-nav-link ${active ? "is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="admin-nav-icon" aria-hidden="true" />
                      <span className="admin-nav-text">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-card">
          <span className="admin-user-avatar" aria-hidden="true">
            {userName.slice(0, 1).toUpperCase()}
          </span>
          <span className="admin-user-copy">
            <span className="admin-user-name">{userName}</span>
            <span className="admin-user-role">Yönetici</span>
          </span>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="admin-nav-link admin-signout"
          title={collapsed && !mobile ? "Oturumu kapat" : undefined}
        >
          <LogOut className="admin-nav-icon" aria-hidden="true" />
          <span className="admin-nav-text">Oturumu kapat</span>
        </button>
      </div>
    </>
  );

  return (
    <div className={`admin-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="admin-sidebar admin-sidebar-desktop">
        {renderNavigation()}
        <button
          type="button"
          className="admin-sidebar-collapse"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
          aria-pressed={collapsed}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-4" aria-hidden="true" />
          )}
          <span>{collapsed ? "Genişlet" : "Daralt"}</span>
        </button>
      </aside>

      {drawerOpen && (
        <div className="admin-mobile-overlay" role="presentation">
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="admin-mobile-backdrop"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="admin-sidebar admin-sidebar-mobile">
            {renderNavigation(true)}
          </aside>
        </div>
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="admin-icon-button admin-menu-button"
              aria-label="Navigasyon menüsünü aç"
              aria-expanded={drawerOpen}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <div className="admin-breadcrumbs" aria-label="Sayfa yolu">
              <span>{current.group}</span>
              <span aria-hidden="true">/</span>
              <strong>{current.label}</strong>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-topbar-link"
            >
              Website'i görüntüle
              <span aria-hidden="true">↗</span>
            </Link>
            <div className="admin-help" title="Yardım için IHBA ekip sorumlusuna ulaşın">
              <CircleHelp className="size-4" aria-hidden="true" />
              <span className="sr-only">Yardım</span>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
