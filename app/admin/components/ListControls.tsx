"use client";

import { RotateCcw, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Payload's `.list-controls`: a search bar with the filter and sort controls
 * sitting beside it as pills, applying on change rather than behind a
 * "Filtrele" submit. Search debounces so typing doesn't fire a navigation per
 * keystroke; the selects apply immediately.
 *
 * State stays in the URL — these pages are server components that read
 * searchParams, so the router push is what refetches the list.
 */

const SEARCH_DEBOUNCE_MS = 350;

export function ListControls({
  search = "",
  searchPlaceholder = "İçerikte ara…",
  status = "all",
  statusOptions = [],
  sort = "updated",
  sortOptions = [],
  action,
}: {
  search?: string;
  searchPlaceholder?: string;
  status?: string;
  statusOptions?: Array<{ value: string; label: string }>;
  sort?: string;
  sortOptions?: Array<{ value: string; label: string }>;
  action?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(search);
  const isFirstRender = useRef(true);

  // Keep the box in step when the user navigates back or clears the filters.
  useEffect(() => {
    setTerm(search);
  }, [search]);

  function apply(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all" || (key === "sort" && value === "updated")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    // Any change to the query invalidates the page you were on.
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (term === search) return;
    const timer = setTimeout(() => apply({ q: term }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // `apply` closes over the current params, which is what we want at fire time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const isFiltered = Boolean(search) || status !== "all" || sort !== "updated";

  return (
    <div className="pl-list-controls">
      <div className="pl-search-filter">
        <Search className="pl-icon" aria-hidden="true" />
        <label className="sr-only" htmlFor="pl-list-search">
          {searchPlaceholder}
        </label>
        <input
          id="pl-list-search"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={searchPlaceholder}
          autoComplete="off"
        />
      </div>

      <div className="pl-list-controls__group">
        {statusOptions.length > 0 && (
          <label className="pl-control-pill">
            <span className="pl-control-pill__label">Durum</span>
            <select value={status} onChange={(event) => apply({ state: event.target.value })}>
              {statusOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {sortOptions.length > 0 && (
          <label className="pl-control-pill">
            <span className="pl-control-pill__label">Sırala</span>
            <select value={sort} onChange={(event) => apply({ sort: event.target.value })}>
              {sortOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {isFiltered && (
          <button
            type="button"
            className="pl-control-reset"
            onClick={() => {
              setTerm("");
              router.replace(pathname, { scroll: false });
            }}
          >
            <RotateCcw className="pl-icon-sm" aria-hidden="true" />
            Temizle
          </button>
        )}

        {action}
      </div>
    </div>
  );
}
