/**
 * Picks which items the curated homepage sections show.
 *
 * The homepage used to take whatever came first: the three newest articles,
 * every published project (however many that grew to), the first three
 * programme cards. Staff can now choose, in the homepage layout editor.
 *
 * A selection is a list of stable identifiers rather than a copy of the item,
 * so editing an article still updates the homepage. Anything selected that no
 * longer exists — unpublished, renamed, deleted — is skipped rather than
 * rendered as a gap, and an empty selection falls back to the automatic
 * behaviour so the homepage is never blank waiting on curation.
 */
export const HOMEPAGE_SECTION_LIMIT = 3;

export type HomepageSelection = {
  news: string[];
  projects: string[];
  areas: number[];
};

export const emptyHomepageSelection: HomepageSelection = {
  news: [],
  projects: [],
  areas: [],
};

/** Reads the selection out of a content document, tolerating older shapes. */
export function readHomepageSelection(value: unknown): HomepageSelection {
  if (!value || typeof value !== "object") return { ...emptyHomepageSelection };
  const raw = value as Partial<Record<keyof HomepageSelection, unknown>>;
  const strings = (input: unknown) =>
    Array.isArray(input)
      ? input.filter((item): item is string => typeof item === "string" && item.length > 0)
      : [];
  const numbers = (input: unknown) =>
    Array.isArray(input)
      ? input.filter(
          (item): item is number => typeof item === "number" && Number.isInteger(item) && item >= 0,
        )
      : [];
  return {
    news: strings(raw.news),
    projects: strings(raw.projects),
    areas: numbers(raw.areas),
  };
}

/**
 * Applies a selection of identifiers to a list, in the order chosen. Falls
 * back to the first `limit` items when nothing is selected, or when every
 * selected item has since disappeared.
 */
export function pickSelected<T>(
  items: T[],
  selection: string[],
  identify: (item: T) => string,
  limit = HOMEPAGE_SECTION_LIMIT,
): T[] {
  if (selection.length === 0) return items.slice(0, limit);
  const byId = new Map(items.map((item) => [identify(item), item]));
  const chosen = selection
    .map((id) => byId.get(id))
    .filter((item): item is T => item !== undefined)
    .slice(0, limit);
  return chosen.length > 0 ? chosen : items.slice(0, limit);
}

/** The index-based variant, for programme cards which carry no identifier. */
export function pickSelectedIndices<T>(
  items: T[],
  selection: number[],
  limit = HOMEPAGE_SECTION_LIMIT,
): T[] {
  if (selection.length === 0) return items.slice(0, limit);
  const chosen = selection
    .map((index) => items[index])
    .filter((item): item is T => item !== undefined)
    .slice(0, limit);
  return chosen.length > 0 ? chosen : items.slice(0, limit);
}
