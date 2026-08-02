import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface ContentCardItem {
  key: string;
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Small label under the description — a field or section count. */
  meta?: string;
}

/** The card grid shared by the content index and each group page. */
export function ContentCards({ items }: { items: ContentCardItem[] }) {
  return (
    <div className="admin-content-card-grid">
      {items.map(({ key, href, title, description, icon: Icon, meta }) => (
        <Link href={href} className="admin-content-card" key={key}>
          <span className="admin-content-card-icon">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="admin-content-card-copy">
            <span className="admin-content-card-title">{title}</span>
            <span className="admin-content-card-description">{description}</span>
            {meta && (
              <span className="admin-content-card-status">
                <span className="admin-eyebrow">{meta}</span>
              </span>
            )}
          </span>
          <ArrowRight className="admin-content-card-arrow" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
