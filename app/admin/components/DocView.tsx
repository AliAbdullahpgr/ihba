import type { ReactNode } from "react";

/**
 * Payload's edit view, in three parts:
 *
 *   .doc-controls      a sticky bar carrying the document's meta on the left
 *                      and Save on the right, so the save target never scrolls
 *                      out of reach on a long form.
 *   .document-fields__main     the field column.
 *   .document-fields__sidebar  a narrower column for the fields Payload marks
 *                              `admin.position: 'sidebar'` — status, flags,
 *                              the upload. Sticky, scrolls with the form.
 *
 * Replaces the previous pattern of a sticky-bottom save bar plus an
 * `xl:fixed` aside, which detached from the form on short viewports.
 */

export function DocView({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`pl-doc ${className}`}>{children}</div>;
}

export function DocControls({
  meta = [],
  children,
}: {
  /** Small label/value pairs shown left of the save button. */
  meta?: Array<{ label: string; value: string }>;
  children: ReactNode;
}) {
  return (
    <div className="pl-doc-controls">
      <ul className="pl-doc-controls__meta">
        {meta.map((entry) => (
          <li key={entry.label}>
            <span className="pl-doc-controls__label">{entry.label}</span>
            <span className="pl-doc-controls__value">{entry.value}</span>
          </li>
        ))}
      </ul>
      <div className="pl-doc-controls__actions">{children}</div>
    </div>
  );
}

export function DocFields({ children }: { children: ReactNode }) {
  return <div className="pl-doc__fields">{children}</div>;
}

export function DocMain({ children }: { children: ReactNode }) {
  return <div className="pl-doc__main">{children}</div>;
}

export function DocSidebar({ children }: { children: ReactNode }) {
  return <aside className="pl-doc__sidebar">{children}</aside>;
}

export function DocSection({
  title,
  badge,
  description,
  children,
}: {
  title?: string;
  badge?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="pl-doc-section">
      {(title || badge) && (
        <div className="pl-doc-section__header">
          {title && <h2>{title}</h2>}
          {badge && <span className="pl-doc-section__badge">{badge}</span>}
        </div>
      )}
      {description && <p className="pl-doc-section__description">{description}</p>}
      <div className="pl-doc-section__body">{children}</div>
    </section>
  );
}

/** Two fields side by side above 640px, stacked below. */
export function DocRow({ children }: { children: ReactNode }) {
  return <div className="pl-doc-row">{children}</div>;
}
