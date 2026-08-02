/**
 * Adds newly bundled fields to an older saved CMS document while preserving
 * every value the editor has already changed.
 */
export function mergeContentDefaults<T>(defaults: T, saved: unknown): T {
  /*
    Merge item by item rather than taking the saved array wholesale. The
    bundled array supplies defaults for known positions, while saved items
    beyond that shape are preserved. The latter matters for repeatable content
    such as homepage banners: adding a slide must not disappear on the next
    public read simply because the original bundled copy had two examples.
  */
  if (Array.isArray(defaults)) {
    const savedItems = Array.isArray(saved) ? saved : [];
    return Array.from({ length: Math.max(defaults.length, savedItems.length) }, (_, index) =>
      index < defaults.length
        ? mergeContentDefaults(defaults[index], savedItems[index])
        : savedItems[index]
    ) as T;
  }

  if (defaults && typeof defaults === "object") {
    const savedRecord =
      saved && typeof saved === "object" && !Array.isArray(saved)
        ? (saved as Record<string, unknown>)
        : {};

    return Object.fromEntries(
      Object.entries(defaults as Record<string, unknown>).map(([key, value]) => [
        key,
        mergeContentDefaults(value, savedRecord[key]),
      ])
    ) as T;
  }

  return (saved === undefined ? defaults : saved) as T;
}
