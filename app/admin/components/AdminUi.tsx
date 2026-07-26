import Link from "next/link";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-navy-ink">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink/60">
            {description}
          </p>
        )}
      </div>
      {action}
    </header>
  );
}

export function AdminButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure ${
        variant === "primary"
          ? "bg-navy-deep text-white hover:bg-navy"
          : "border border-navy-ink/20 bg-white text-navy-ink hover:border-navy-ink/45"
      }`}
    >
      {children}
    </Link>
  );
}

export function StatusBadge({
  state,
}: {
  state: "draft" | "published" | "archived" | string;
}) {
  const tone =
    state === "published"
      ? "bg-[#e8f5ed] text-[#24613a]"
      : state === "archived"
        ? "bg-mist text-ink/60"
        : "bg-gold-mist text-[#725719]";
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold ${tone}`}>
      {state.charAt(0).toUpperCase() + state.slice(1)}
    </span>
  );
}

export const inputClass =
  "min-h-11 w-full border border-navy-ink/20 bg-white px-3 py-2 text-sm text-navy-ink outline-none transition-colors placeholder:text-ink/45 hover:border-navy-ink/40 focus:border-navy focus:ring-2 focus:ring-azure/25 disabled:bg-mist/40";

export function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-navy-ink">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink/55">{hint}</span>}
    </label>
  );
}
