/**
 * Adds newly bundled fields to an older saved CMS document while preserving
 * every value the editor has already changed.
 */
export function mergeContentDefaults<T>(defaults: T, saved: unknown): T {
  /*
    Merge item by item rather than taking the saved array wholesale. The editor
    can only overwrite strings at paths that already exist, so the bundled array
    is always the authority on shape and length: this keeps every edited value
    while letting newly bundled fields inside an item — and newly bundled items —
    reach the site instead of being masked by an older saved array.
  */
  if (Array.isArray(defaults)) {
    const savedItems = Array.isArray(saved) ? saved : [];
    return defaults.map((item, index) =>
      mergeContentDefaults(item, savedItems[index])
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
