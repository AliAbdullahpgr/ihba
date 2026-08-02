/**
 * Turns a slice of the site content document into a flat list of editable
 * fields, and back again via the `field:`/`rich:` input names that
 * `saveSiteContent` understands.
 *
 * Extracted from the generic content screen so the homepage layout editor can
 * present the same fields inside a focus panel, rather than sending the
 * operator off to a different page to find them.
 */
export type ContentField =
  | { kind: "text"; path: Array<string | number>; value: string; label: string }
  | { kind: "rich"; path: Array<string | number>; blocks: string[]; label: string };

/**
 * Keys whose string arrays are body copy rather than a list of separate
 * values. Flattening these produced one numbered input per paragraph — fine
 * for a developer, bewildering for the staff actually writing the text — so
 * they collapse into a single rich text editor instead.
 */
export const richTextKeys = new Set(["paragraphs", "body", "message", "intro", "answer"]);

export const fieldLabels: Record<string, string> = {
  paragraphs: "Metin",
  body: "Metin",
  message: "Mesaj",
  intro: "Giriş metni",
  answer: "Cevap",
  question: "Soru",
};

export const hiddenKeys = new Set([
  // Each of these has a purpose-built screen; editing them here as well would
  // mean two places to look and two places to get out of sync.
  "legalPages",
  "key",
  "categoryKey",
  "badgeKey",
  "details",
  "members",
  "items",
  "imageKey",
  "heroSlides",
  "heroSlidesTrash",
  "homepage",
  "socialLinks",
  "email",
  "phone",
  "address",
  "iban",
  "accountName",
  "bankName",
]);

export function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export function flattenContentFields(
  value: unknown,
  path: Array<string | number> = [],
  /**
   * Keys to show even though they are hidden globally. The FAQ editor needs
   * `items`, which is suppressed elsewhere because it also names things like
   * the ticker strip that are not free text.
   */
  reveal: Set<string> = new Set(),
): ContentField[] {
  if (typeof value === "string") {
    const last = path.at(-1);
    const parent = path.at(-2);
    const label =
      typeof last === "number"
        ? `${humanize(String(parent ?? "Alan"))} ${last + 1}`
        : fieldLabels[String(last ?? "")] ?? humanize(String(last ?? "Alan"));
    return [{ kind: "text", path, value, label }];
  }
  if (Array.isArray(value)) {
    const key = String(path.at(-1) ?? "");
    if (
      richTextKeys.has(key) &&
      value.every((item): item is string => typeof item === "string")
    ) {
      return [{ kind: "rich", path, blocks: value, label: fieldLabels[key] ?? humanize(key) }];
    }
    return value.flatMap((item, index) => flattenContentFields(item, [...path, index], reveal));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      hiddenKeys.has(key) && !reveal.has(key)
        ? []
        : flattenContentFields(child, [...path, key], reveal),
    );
  }
  return [];
}

/** Form input name for a field, matching what `saveSiteContent` expects. */
export function contentFieldName(field: ContentField) {
  const encodedPath = encodeURIComponent(JSON.stringify(field.path));
  return field.kind === "rich" ? `rich:${encodedPath}` : `field:${encodedPath}`;
}

/**
 * Reads the fields under a set of document paths — `["about", "lede"]` picks
 * one field, `["campaign"]` picks the whole block. Used by the homepage editor
 * to gather exactly the fields one homepage section renders, which is often a
 * subset of a content key rather than all of it.
 */
export function fieldsAtPaths(
  document: Record<string, unknown>,
  paths: Array<Array<string>>,
  reveal?: Set<string>,
): ContentField[] {
  return paths.flatMap((path) => {
    let cursor: unknown = document;
    for (const step of path) {
      if (!cursor || typeof cursor !== "object") return [];
      cursor = (cursor as Record<string, unknown>)[step];
    }
    return cursor === undefined ? [] : flattenContentFields(cursor, path, reveal);
  });
}
