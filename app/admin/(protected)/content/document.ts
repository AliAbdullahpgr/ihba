import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { content } from "@/lib/content";
import { flattenContentFields } from "@/lib/content-fields";
import { dict } from "@/lib/i18n";
import { siteContent } from "@/lib/db/schema";
import { mergeContentDefaults } from "@/lib/merge-content";
import type { ContentCardItem } from "./ContentCards";
import { contentGroups, contentSections, type ContentSection } from "./sections";

export type ContentLocale = "tr" | "en";

export function isContentLocale(value: string): value is ContentLocale {
  return value === "tr" || value === "en";
}

/**
 * The saved document for a locale, with the shipped defaults filled in so a
 * key that has never been edited still shows its current live text.
 * Returns null when the locale row is missing, so callers can `notFound()`.
 */
export async function loadContentDocument(locale: ContentLocale) {
  const row = await db.query.siteContent.findFirst({
    where: eq(siteContent.locale, locale),
  });
  if (!row) return null;
  return mergeContentDefaults(
    { ...dict[locale], ...content[locale] },
    row.document,
  ) as Record<string, unknown>;
}

/**
 * Sections that actually have something to edit, with their field counts.
 * A section with no fields would otherwise be a card that opens a blank page.
 */
export function countSections(
  document: Record<string, unknown>,
): Array<ContentSection & { count: number }> {
  return contentSections
    .map((section) => ({
      ...section,
      count: flattenContentFields(
        document[section.key],
        [section.key],
        new Set(section.reveal ?? []),
      ).length,
    }))
    .filter((section) => section.count > 0);
}

/**
 * The three group cards, with their section counts. Rendered both on the
 * content overview and on the per-language index, so they are built once here.
 */
export async function loadGroupCards(locale: ContentLocale): Promise<ContentCardItem[]> {
  const document = await loadContentDocument(locale);
  if (!document) return [];
  const counted = countSections(document);
  return contentGroups
    .map((group) => ({
      key: group.key,
      href: `/admin/content/${locale}/group/${group.key}`,
      title: group.title,
      description: group.description,
      icon: group.icon,
      count: counted.filter((section) => section.group === group.key).length,
    }))
    .filter((group) => group.count > 0)
    .map(({ count, ...card }) => ({ ...card, meta: `${count} bölüm` }));
}
