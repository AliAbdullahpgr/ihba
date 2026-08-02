import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { content } from "@/lib/content";
import { dict } from "@/lib/i18n";
import { siteContent } from "@/lib/db/schema";
import { mergeContentDefaults } from "@/lib/merge-content";

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
