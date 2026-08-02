"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { inputClass } from "@/app/admin/components/AdminUi";

type StatusFilter = "all" | "new" | "read" | "replied" | "archived";

export function MessageFilters({
  forwardingEmail,
}: {
  forwardingEmail: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState<StatusFilter>(
    (params.get("status") as StatusFilter) ?? "all"
  );
  const [from, setFrom] = useState(params.get("from") ?? "");
  const [to, setTo] = useState(params.get("to") ?? "");

  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const push = useCallback(
    (q: string, s: StatusFilter, f: string, t: string) => {
      const next = new URLSearchParams();
      if (q.trim()) next.set("q", q.trim());
      if (s !== "all") next.set("status", s);
      if (f) next.set("from", f);
      if (t) next.set("to", t);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname]
  );
  // Debounce search so we push URL once per pause, not per keystroke.
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      push(search, status, from, to);
    }, 300);
    return () => clearTimeout(debounce.current);
  }, [search, status, from, to, push]);

  const statusButtons: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Tümü" },
    { value: "new", label: "Yeni" },
    { value: "read", label: "Okundu" },
    { value: "replied", label: "Yanıtlandı" },
    { value: "archived", label: "Arşivlendi" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-sm border border-azure/30 bg-azure-mist/30 px-4 py-3 text-sm">
        <span className="font-semibold text-navy-ink">Bildirim adresi:</span>
        <a
          href={`mailto:${forwardingEmail}`}
          className="font-semibold text-navy hover:text-azure-deep hover:underline"
        >
          {forwardingEmail}
        </a>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <input
            type="search"
            placeholder="İsim, e-posta, konu veya mesajda ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink/60">Başlangıç</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink/60">Bitiş</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusButtons.map((btn) => (
          <button
            key={btn.value}
            type="button"
            onClick={() => setStatus(btn.value)}
            className={`min-h-9 px-3 text-sm font-semibold transition-colors ${
              status === btn.value
                ? "bg-navy-deep text-white"
                : "border border-navy-ink/20 bg-white text-navy-ink hover:border-navy-ink/45"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
