"use client";

import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  contentGroupByKey,
  contentSections,
} from "@/app/admin/(protected)/content/sections";
import { authClient } from "@/lib/auth-client";

/**
 * Structured after Payload 3's admin shell (`.template-default`): a sticky
 * full-height nav column beside a content column whose own header carries the
 * breadcrumb trail. Payload's nav is text-only — no icons, no pills, no
 * accent fills — so the current page is marked with weight plus a 2px
 * indicator bar bled into the nav gutter.
 */

type NavItem = {
  href: string;
  label: string;
  description?: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navigation: NavGroup[] = [
  {
    label: "Genel",
    items: [{ href: "/admin", label: "Genel bakış", description: "Yayın durumu ve yapılacaklar" }],
  },
  {
    label: "Website içeriği",
    items: [
      { href: "/admin/homepage", label: "Anasayfa düzeni", description: "Anasayfa bölümleri" },
      { href: "/admin/slider", label: "Anasayfa bannerı", description: "Slider görselleri ve sırası" },
      { href: "/admin/content", label: "Diğer sayfa metinleri", description: "Website'de görünen metinler" },
      { href: "/admin/president", label: "Başkan mesajı", description: "Başkanın mesajı" },
      { href: "/admin/social", label: "Sosyal medya hesapları", description: "Website bağlantıları" },
      { href: "/admin/donation", label: "Bağış sayfası metni", description: "Bağış açıklamaları" },
      { href: "/admin/legal", label: "Yasal metinler", description: "KVKK, gizlilik, çerez" },
    ],
  },
  {
    label: "İçerik yönetimi",
    items: [
      { href: "/admin/projects", label: "Projeler", description: "Projeler ve yayın durumu" },
      { href: "/admin/news", label: "Haberler", description: "Haber ve duyurular" },
      { href: "/admin/gallery", label: "Galeri", description: "Fotoğraflar ve açıklamalar" },
    ],
  },
  {
    label: "Kurum",
    items: [
      { href: "/admin/organisation", label: "Kurum bilgileri", description: "İletişim, kayıt, IBAN" },
      { href: "/admin/board", label: "Yönetim kurulu", description: "Kurul üyeleri" },
      { href: "/admin/activity", label: "Değişiklik kaydı", description: "Kim neyi ne zaman değiştirdi" },
    ],
  },
  {
    label: "İletişim",
    items: [
      { href: "/admin/messages", label: "Mesajlar", description: "Website iletişim mesajları" },
      { href: "/admin/submissions", label: "Form başvuruları", description: "Gönüllü ve bülten kayıtları" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { href: "/admin/media", label: "Medya kütüphanesi", description: "Tekrar kullanılabilir görseller" },
      { href: "/admin/trash", label: "Çöp kutusu", description: "Silinen içerikler" },
      { href: "/admin/account", label: "Hesap", description: "Hesap ve güvenlik ayarları" },
    ],
  },
];

const NAV_GROUPS_STORAGE_KEY = "ihba-admin-nav-groups";

const localeLabels: Record<string, string> = {
  tr: "Türkçe",
  en: "İngilizce",
};

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

function isItemActive(pathname: string, href: string, search = "") {
  const [baseHref, query] = href.split("?");
  if (query && pathname === baseHref) {
    return new URLSearchParams(query).get("section") === search;
  }
  if (baseHref === "/admin/content" && pathname === baseHref) return search === "";
  if (baseHref === "/admin") return pathname === baseHref;
  return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}

function findActive(pathname: string, search: string) {
  for (const group of navigation) {
    const item = group.items.find((candidate) => isItemActive(pathname, candidate.href, search));
    if (item) return { group, item };
  }
  return null;
}

type Crumb = { label: string; href?: string };

function buildCrumbs(pathname: string, search: string): Crumb[] {
  const active = findActive(pathname, search);
  if (!active) return [{ label: "Yönetim paneli" }];

  const { group, item } = active;
  const crumbs: Crumb[] = [{ label: group.label }, { label: item.label, href: item.href }];

  const base = item.href.split("?")[0];
  if (base === "/admin") return crumbs;

  const extras = pathname.slice(base.length).split("/").filter(Boolean);
  let walked = base;

  for (const segment of extras) {
    walked += `/${segment}`;
    if (segment === "group") continue;

    if (segment === "new") {
      crumbs.push({ label: "Yeni" });
      continue;
    }
    if (localeLabels[segment] && base === "/admin/content") {
      crumbs.push({ label: localeLabels[segment], href: walked });
      continue;
    }
    if (base === "/admin/content") {
      const label =
        contentGroupByKey.get(segment)?.title ??
        contentSections.find((section) => section.key === segment)?.title;
      crumbs.push({ label: label ?? "Düzenle" });
      continue;
    }
    crumbs.push({ label: "Düzenle" });
  }

  return crumbs.map((crumb, index) =>
    index === crumbs.length - 1 ? { label: crumb.label } : crumb,
  );
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
  const [navOpen, setNavOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasNavOpen = useRef(false);
  const section = searchParams.get("section") ?? "";
  const crumbs = useMemo(() => buildCrumbs(pathname, section), [pathname, section]);
  const activeGroupLabel = useMemo(
    () => findActive(pathname, section)?.group.label ?? "",
    [pathname, section],
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(NAV_GROUPS_STORAGE_KEY);
      if (stored) setClosedGroups(JSON.parse(stored) as Record<string, boolean>);
    } catch {
      // Blocked or corrupt storage just means every group starts open.
    }
  }, []);

  useEffect(() => {
    if (!navOpen) {
      if (wasNavOpen.current) menuButtonRef.current?.focus({ preventScroll: true });
      wasNavOpen.current = false;
      return;
    }
    wasNavOpen.current = true;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  useEffect(() => {
    setNavOpen(false);
    setNavQuery("");
  }, [pathname]);

  function toggleGroup(label: string) {
    setClosedGroups((current) => {
      const next = { ...current, [label]: !current[label] };
      try {
        window.localStorage.setItem(NAV_GROUPS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Persisting is a convenience; the toggle still works this session.
      }
      return next;
    });
  }

  async function signOut() {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const query = normalize(navQuery.trim());
  const filteredGroups = useMemo(() => {
    if (!query) return navigation;
    return navigation
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            normalize(item.label).includes(query) ||
            normalize(item.description ?? "").includes(query) ||
            normalize(group.label).includes(query),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div className={`pl-shell ${navOpen ? "nav-open" : ""}`}>
      <nav className="pl-nav" aria-label="Yönetim paneli navigasyonu">
        <div className="pl-nav__header">
          <Link href="/admin" className="pl-nav__brand" onClick={() => setNavOpen(false)}>
            <img src="/brand/logo-horizontal.png" alt="IHBA" />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="pl-nav__close"
            onClick={() => setNavOpen(false)}
            aria-label="Menüyü kapat"
          >
            <X className="pl-icon" aria-hidden="true" />
          </button>
        </div>

        <div className="pl-nav__scroll">
          <div className="pl-nav__search">
            <Search className="pl-icon" aria-hidden="true" />
            <label className="sr-only" htmlFor="pl-nav-search">
              Menüde ara
            </label>
            <input
              id="pl-nav-search"
              type="search"
              value={navQuery}
              onChange={(event) => setNavQuery(event.target.value)}
              placeholder="Menüde ara…"
              autoComplete="off"
            />
            {navQuery && (
              <button type="button" onClick={() => setNavQuery("")} aria-label="Aramayı temizle">
                <X className="pl-icon-sm" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="pl-nav__wrap">
            {filteredGroups.map((group) => {
              const groupId = `pl-nav-${group.label.replace(/\s+/g, "-")}`;
              const open =
                Boolean(query) ||
                group.label === activeGroupLabel ||
                !closedGroups[group.label];
              return (
                <div className="pl-nav-group" key={group.label}>
                  <button
                    type="button"
                    className="pl-nav-group__toggle"
                    onClick={() => toggleGroup(group.label)}
                    aria-expanded={open}
                    aria-controls={groupId}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`pl-nav-group__indicator ${open ? "" : "is-closed"}`}
                      aria-hidden="true"
                    />
                  </button>
                  {open && (
                    <div className="pl-nav-group__content" id={groupId}>
                      {group.items.map(({ href, label }) => {
                        const active = isItemActive(pathname, href, section);
                        return (
                          <Link
                            key={href}
                            href={href}
                            className={`pl-nav__link ${active ? "active" : ""}`}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setNavOpen(false)}
                          >
                            {active && <span className="pl-nav__link-indicator" aria-hidden="true" />}
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {query && filteredGroups.length === 0 && (
              <p className="pl-nav__empty">“{navQuery}” için sonuç yok.</p>
            )}
          </div>

          <div className="pl-nav__controls">
            <Link href="/admin/account" className="pl-nav__link">
              {userName}
            </Link>
            <button type="button" onClick={signOut} className="pl-nav__link pl-nav__logout">
              Oturumu kapat
            </button>
          </div>
        </div>
      </nav>

      {navOpen && (
        <button
          type="button"
          className="pl-nav__backdrop"
          aria-label="Menüyü kapat"
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="pl-wrap">
        <header className="pl-app-header">
          <button
            ref={menuButtonRef}
            type="button"
            className="pl-app-header__toggler"
            onClick={() => setNavOpen(true)}
            aria-label="Navigasyon menüsünü aç"
            aria-expanded={navOpen}
          >
            <Menu className="pl-icon" aria-hidden="true" />
          </button>

          <nav className="pl-step-nav" aria-label="Sayfa yolu">
            {crumbs.map((crumb, index) => (
              <span className="pl-step-nav__step" key={`${crumb.label}-${index}`}>
                {index > 0 && <span className="pl-step-nav__sep" aria-hidden="true">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : index === crumbs.length - 1 ? (
                  <span className="pl-step-nav__current" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="pl-app-header__actions">
            <Link href="/" target="_blank" rel="noreferrer" className="pl-btn pl-btn--subtle">
              Website'i görüntüle
            </Link>
          </div>
        </header>

        <main className="pl-main">{children}</main>
      </div>
    </div>
  );
}
