/**
 * The destinations an editor may point a button at.
 *
 * Button targets used to be free-text inputs, which meant a typo like
 * `/projeler` produced a silent 404 with nothing in the admin to warn anyone.
 * The admin now offers this list as a dropdown; `CUSTOM_LINK` is the escape
 * hatch for campaign pages and external addresses, which still get validated.
 */
export type SiteLink = {
  href: string;
  /** Turkish label — the admin panel is Turkish throughout. */
  label: string;
  /** Groups the options inside the select. */
  group: string;
};

export const CUSTOM_LINK = "__custom__";

export const siteLinks: SiteLink[] = [
  { href: "/", label: "Anasayfa", group: "Ana bölümler" },
  { href: "/about", label: "Hakkımızda", group: "Ana bölümler" },
  { href: "/areas-of-work", label: "Faaliyet alanları", group: "Ana bölümler" },
  { href: "/projects", label: "Projeler", group: "Ana bölümler" },
  { href: "/news", label: "Haberler", group: "Ana bölümler" },
  { href: "/gallery", label: "Galeri", group: "Ana bölümler" },

  { href: "/donate", label: "Bağış yap", group: "Katılım" },
  { href: "/volunteer", label: "Gönüllü ol", group: "Katılım" },
  { href: "/contact", label: "İletişim", group: "Katılım" },

  { href: "/president", label: "Başkanın mesajı", group: "Kurum" },
  { href: "/board", label: "Yönetim kurulu", group: "Kurum" },

  { href: "/kvkk", label: "KVKK aydınlatma metni", group: "Yasal" },
  { href: "/privacy-policy", label: "Gizlilik politikası", group: "Yasal" },
  { href: "/cookie-policy", label: "Çerez politikası", group: "Yasal" },
];

export const siteLinkGroups = siteLinks.reduce<Record<string, SiteLink[]>>(
  (groups, link) => {
    (groups[link.group] ??= []).push(link);
    return groups;
  },
  {},
);

export function isKnownSiteLink(href: string) {
  return siteLinks.some((link) => link.href === href);
}

/** Human-readable name for a saved href, for summaries and change records. */
export function siteLinkLabel(href: string) {
  return siteLinks.find((link) => link.href === href)?.label ?? href;
}

/**
 * Accepts the internal routes above, any other site-relative path, and
 * absolute http(s) addresses. Anything else — `javascript:` in particular —
 * is rejected so a pasted string cannot become an executable link.
 */
export function isValidLinkTarget(href: string) {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return value.length > 8;
  return /^https?:\/\/[^\s]+$/i.test(value);
}
