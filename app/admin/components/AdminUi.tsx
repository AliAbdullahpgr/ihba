import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Inbox,
  LoaderCircle,
  RotateCcw,
  Search,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type AdminStatus =
  | "draft"
  | "published"
  | "hidden"
  | "archived"
  | "trash"
  | "new"
  | "read"
  | "replied"
  | "reviewing"
  | "closed"
  | string;

const statusLabels: Record<string, string> = {
  draft: "Taslak",
  published: "Yayında",
  hidden: "Gizli",
  archived: "Arşivlendi",
  trash: "Çöp kutusunda",
  new: "Yeni",
  read: "Okundu",
  replied: "Yanıtlandı",
  reviewing: "İnceleniyor",
  closed: "Kapatıldı",
  saved: "Kaydedildi",
  restored: "Geri yüklendi",
  permanent_delete: "Kalıcı silindi",
};

const statusTones: Record<string, string> = {
  published: "admin-status-success",
  replied: "admin-status-success",
  closed: "admin-status-muted",
  hidden: "admin-status-muted",
  archived: "admin-status-muted",
  trash: "admin-status-danger",
  new: "admin-status-info",
  reviewing: "admin-status-warning",
  draft: "admin-status-warning",
  saved: "admin-status-info",
  restored: "admin-status-success",
  permanent_delete: "admin-status-danger",
};

export function AdminPageHeader({
  title,
  description,
  action,
  eyebrow,
  backHref,
  backLabel = "Geri dön",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-heading">
        {backHref && (
          <Link href={backHref} className="admin-back-link">
            <ChevronRight className="size-4 rotate-180" aria-hidden="true" />
            {backLabel}
          </Link>
        )}
        {eyebrow && <span className="admin-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="admin-page-actions">{action}</div>}
    </header>
  );
}

export function AdminButton({
  href,
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  ariaLabel,
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  const classes = `admin-button admin-button-${variant} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ state }: { state: AdminStatus }) {
  const normalizedState = state.toLowerCase();
  const label = statusLabels[normalizedState] ?? state;
  const tone = statusTones[normalizedState] ?? "admin-status-muted";
  return (
    <span className={`admin-status ${tone}`}>
      <span className="admin-status-dot" aria-hidden="true" />
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}

export const inputClass = "admin-input";

export function FormField({
  label,
  hint,
  error,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="admin-field">
      <label className="admin-field-label">
        <span>
          {label}
          {required && <span className="admin-required"> *</span>}
        </span>
      </label>
      {children}
      {hint && !error && <span className="admin-field-hint">{hint}</span>}
      {error && (
        <span className="admin-field-error" role="alert">
          <AlertCircle className="size-3.5" aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}

export function AdminCard({
  title,
  description,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`admin-card ${className}`}>
      {(title || description || eyebrow || action) && (
        <div className="admin-card-header">
          <div className="admin-card-heading">
            {eyebrow && <span className="admin-eyebrow">{eyebrow}</span>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {action && <div className="admin-card-action">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function AdminStatCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: number | string;
  detail: string;
  href: string;
  icon: typeof Inbox;
  tone?: "blue" | "green" | "amber" | "navy";
}) {
  return (
    <Link href={href} className={`admin-stat-card admin-stat-${tone}`}>
      <span className="admin-stat-icon">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="admin-stat-copy">
        <span className="admin-stat-label">{label}</span>
        <strong>{value}</strong>
        <span className="admin-stat-detail">{detail}</span>
      </span>
      <ArrowRight className="admin-stat-arrow" aria-hidden="true" />
    </Link>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: typeof Inbox;
}) {
  return (
    <div className="admin-empty-state">
      <span className="admin-empty-icon">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <div className="admin-empty-action">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return <span className={`admin-skeleton ${className}`} aria-hidden="true" />;
}

export function SaveState({
  state,
}: {
  state: "idle" | "saving" | "saved" | "error";
}) {
  if (state === "saving") {
    return (
      <span className="admin-save-state" role="status">
        <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
        Kaydediliyor…
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="admin-save-state admin-save-state-success" role="status">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Değişiklikler kaydedildi
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="admin-save-state admin-save-state-error" role="alert">
        <AlertCircle className="size-3.5" aria-hidden="true" />
        Kaydedilemedi
      </span>
    );
  }
  return null;
}

export function FieldHelpText({ children }: { children: ReactNode }) {
  return <p className="admin-field-hint">{children}</p>;
}

export function AdminListToolbar({
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
  return (
    <form method="get" className="admin-list-toolbar">
      <label className="admin-search-field">
        <Search className="size-4" aria-hidden="true" />
        <span className="sr-only">{searchPlaceholder}</span>
        <input
          className="admin-input"
          type="search"
          name="q"
          defaultValue={search}
          placeholder={searchPlaceholder}
        />
      </label>
      {statusOptions.length > 0 && (
        <label className="admin-filter-field">
          <span className="sr-only">Yayın durumu</span>
          <select className="admin-input" name="state" defaultValue={status}>
            {statusOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {sortOptions.length > 0 && (
        <label className="admin-filter-field">
          <span className="sr-only">Sıralama</span>
          <select className="admin-input" name="sort" defaultValue={sort}>
            {sortOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="admin-list-toolbar-actions">
        <AdminButton type="submit" variant="secondary">
          Filtrele
        </AdminButton>
        {(search || status !== "all" || sort !== "updated") && (
          <Link href="." className="admin-reset-link">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Temizle
          </Link>
        )}
        {action}
      </div>
    </form>
  );
}
