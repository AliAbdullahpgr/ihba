/**
 * Adds newly bundled fields to an older saved CMS document while preserving
 * every value the editor has already changed.
 */

/**
 * Lists whose length is the operator's to decide.
 *
 * Everywhere else, a saved array shorter than the bundled one is read as an
 * older document that predates a newly shipped item, and the bundled entry
 * fills the gap. For these lists that rule is wrong in the other direction:
 * the admin can delete an entry, and topping the list back up from the
 * bundled copy would undo the deletion on the very next read.
 *
 * Paths are matched against the dotted key path with array indices written as
 * `*` — `legalPages.kvkk.sections`, `heroSlides`.
 */
const authoritativeArrays = [
  /^heroSlides$/,
  /^heroSlidesTrash$/,
  /^legalPages\.[^.]+\.sections$/,
  // Rich text bodies, wherever they appear. The editor posts the whole block
  // list every time, so shortening a passage from five paragraphs to two must
  // not read back as five.
  /(^|\.)(paragraphs|body|message|intro|answer)$/,
];

function isAuthoritative(path: Array<string | number>) {
  const key = path.map((step) => (typeof step === "number" ? "*" : step)).join(".");
  return authoritativeArrays.some((pattern) => pattern.test(key));
}

export function mergeContentDefaults<T>(
  defaults: T,
  saved: unknown,
  path: Array<string | number> = [],
): T {
  /*
    Merge item by item rather than taking the saved array wholesale. The
    bundled array supplies defaults for known positions, while saved items
    beyond that shape are preserved. The latter matters for repeatable content
    such as homepage banners: adding a slide must not disappear on the next
    public read simply because the original bundled copy had two examples.
  */
  if (Array.isArray(defaults)) {
    const savedItems = Array.isArray(saved) ? saved : [];
    // A deletable list keeps exactly what was saved — but only once something
    // has been saved at all, so an untouched document still shows the bundled
    // copy rather than an empty list.
    const length =
      Array.isArray(saved) && isAuthoritative(path)
        ? savedItems.length
        : Math.max(defaults.length, savedItems.length);
    return Array.from({ length }, (_, index) =>
      index < defaults.length
        ? mergeContentDefaults(defaults[index], savedItems[index], [...path, index])
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
        mergeContentDefaults(value, savedRecord[key], [...path, key]),
      ])
    ) as T;
  }

  return (saved === undefined ? defaults : saved) as T;
}
