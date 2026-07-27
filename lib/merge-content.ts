/**
 * Adds newly bundled fields to an older saved CMS document while preserving
 * every value the editor has already changed.
 */
export function mergeContentDefaults<T>(defaults: T, saved: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(saved) ? saved : defaults) as T;
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
