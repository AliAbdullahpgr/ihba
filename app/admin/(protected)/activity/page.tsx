import { desc, eq } from "drizzle-orm";
import { ArrowRight, ShieldAlert } from "lucide-react";

import {
  AdminCard,
  AdminPageHeader,
  EmptyState,
  StatusBadge,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import { auditLogs, user } from "@/lib/db/schema";

type SearchParams = Promise<{ page?: string }>;

const PAGE_SIZE = 40;

const entityLabels: Record<string, string> = {
  organisation_settings: "Kurum bilgileri",
  contact_settings: "İletişim bilgileri",
  donation_settings: "Bağış bilgileri",
  social_accounts: "Sosyal medya hesapları",
  site_content: "Website metinleri",
  project: "Proje",
  news: "Haber",
  gallery: "Galeri",
  board_member: "Kurul üyesi",
  hero_slide: "Anasayfa bannerı",
  president: "Başkan mesajı",
  contact_message: "İletişim mesajı",
  site_media: "Görsel",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, Number((await searchParams).page ?? "1") || 1);

  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entityType: auditLogs.entityType,
      entityId: auditLogs.entityId,
      metadata: auditLogs.metadata,
      createdAt: auditLogs.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
    .from(auditLogs)
    .leftJoin(user, eq(auditLogs.userId, user.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(PAGE_SIZE + 1)
    .offset((page - 1) * PAGE_SIZE);

  const hasNext = rows.length > PAGE_SIZE;
  const entries = rows.slice(0, PAGE_SIZE);

  return (
    <>
      <AdminPageHeader
        eyebrow="Kurum"
        title="Değişiklik kaydı"
        description="Website üzerinde yapılan değişikliklerin kaydı. Kim, neyi, ne zaman değiştirdi."
      />

      {entries.length === 0 ? (
        <EmptyState
          title="Henüz kayıt yok"
          description="Website üzerinde bir değişiklik yapıldığında burada görünecek."
        />
      ) : (
        <div className="admin-activity-list">
          {entries.map((entry) => {
            const changes = entry.metadata?.changes ?? [];
            const sensitive = changes.some((change) => change.sensitive);
            return (
              <AdminCard key={entry.id} className={sensitive ? "admin-activity-card is-sensitive" : "admin-activity-card"}>
                <div className="admin-activity-head">
                  <div>
                    <h2 className="admin-activity-title">
                      {entityLabels[entry.entityType] ?? entry.entityType}
                    </h2>
                    <p className="admin-activity-meta">
                      {entry.userName ?? entry.userEmail ?? "Bilinmeyen kullanıcı"}
                      {" · "}
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  <StatusBadge state={entry.action} />
                </div>

                {sensitive && (
                  <p className="admin-activity-warning">
                    <ShieldAlert className="size-4" aria-hidden="true" />
                    Banka veya IBAN bilgisi değiştirildi.
                  </p>
                )}

                {changes.length > 0 ? (
                  <ul className="admin-activity-changes">
                    {changes.map((change, index) => (
                      <li
                        key={`${entry.id}-${change.field}-${index}`}
                        className={change.sensitive ? "is-sensitive" : undefined}
                      >
                        <span className="admin-activity-field">{change.label}</span>
                        <span className="admin-activity-values">
                          <span className="admin-activity-from">{change.from || "(boş)"}</span>
                          <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                          <span className="admin-activity-to">{change.to || "(boş)"}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  // Entries written before the diff was recorded, and actions
                  // like publishing where there is no field-level before/after.
                  <p className="admin-activity-plain">
                    Ayrıntılı değişiklik bilgisi kaydedilmemiş.
                  </p>
                )}
              </AdminCard>
            );
          })}
        </div>
      )}

      {(page > 1 || hasNext) && (
        <nav className="admin-pagination" aria-label="Sayfalama">
          <span>Sayfa {page}</span>
          <div className="admin-pagination-actions">
            <a
              className={`admin-pagination-link ${page === 1 ? "is-disabled" : ""}`}
              href={`/admin/activity?page=${page - 1}`}
            >
              Önceki
            </a>
            <a
              className={`admin-pagination-link ${hasNext ? "" : "is-disabled"}`}
              href={`/admin/activity?page=${page + 1}`}
            >
              Sonraki
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
