import { and, desc, eq, gte, like, lte, or, type SQL } from "drizzle-orm";
import { Mail, MessageSquareText, Reply } from "lucide-react";
import {
  deleteContactMessage,
  updateSubmissionStatus,
} from "@/app/admin/actions";
import { AdminCard, AdminPageHeader, EmptyState, StatusBadge } from "@/app/admin/components/AdminUi";
import { MessageFilters } from "@/app/admin/components/MessageFilters";
import { TrashActionButton } from "@/app/admin/components/TrashActionButton";
import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { CONTACT_FORWARD_EMAIL } from "@/lib/email";

type Status = "new" | "read" | "replied" | "archived";

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value + "T00:00:00");
  return Number.isNaN(date.getTime()) ? null : date;
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const statusFilter = typeof sp.status === "string" ? sp.status : "all";
  const from = parseDate(typeof sp.from === "string" ? sp.from : null);
  const to = parseDate(typeof sp.to === "string" ? sp.to : null);
  const conditions: SQL[] = [];

  if (q) {
    const pattern = `%${q}%`;
    conditions.push(or(like(contactSubmissions.fullName, pattern), like(contactSubmissions.email, pattern), like(contactSubmissions.subject, pattern), like(contactSubmissions.message, pattern))!);
  }
  if (["new", "read", "replied", "archived"].includes(statusFilter)) conditions.push(eq(contactSubmissions.status, statusFilter as Status));
  if (from) conditions.push(gte(contactSubmissions.createdAt, from));
  if (to) { to.setHours(23, 59, 59, 999); conditions.push(lte(contactSubmissions.createdAt, to)); }

  const contacts = await db.select().from(contactSubmissions).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(contactSubmissions.createdAt));
  const newCount = contacts.filter((item) => item.status === "new").length;

  return (
    <>
      <AdminPageHeader
        eyebrow="İletişim"
        title="Mesajlar"
        description="Website iletişim formundan gelen mesajları okuyun, yanıtlayın ve durumlarını takip edin."
      />
      <AdminCard className="admin-message-filters-card">
        <MessageFilters forwardingEmail={CONTACT_FORWARD_EMAIL} />
      </AdminCard>
      <AdminCard className="admin-message-list-card" eyebrow={`${contacts.length} mesaj`} title="Gelen kutusu" description={newCount ? `${newCount} mesaj yanıtınızı bekliyor.` : "Yeni mesaj bulunmuyor."}>
        {!contacts.length ? (
          <EmptyState icon={MessageSquareText} title="Mesaj bulunamadı" description="Arama veya filtreleri değiştirip tekrar deneyin." />
        ) : (
          <div className="admin-message-list">
            {contacts.map((item) => {
              const status = item.status as Status;
              return (
                <article className="admin-message-item" key={item.id}>
                  <div className="admin-message-header">
                    <div className="admin-message-heading">
                      <StatusBadge state={status} />
                      <h2>{item.subject}</h2>
                    </div>
                    <time>{item.createdAt.toLocaleString("tr-TR")}</time>
                  </div>
                  <p className="admin-message-sender"><strong>{item.fullName}</strong><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone.replace(/\s+/g, "")}`}>{item.phone}</a>}</p>
                  <p className="admin-message-body">{item.message}</p>
                  <div className="admin-message-actions">
                    <form action={updateSubmissionStatus} className="admin-message-status-form">
                      <input type="hidden" name="type" value="contact" />
                      <input type="hidden" name="id" value={item.id} />
                      <label><span>Durum</span><select name="status" defaultValue={status} className="admin-input"><option value="new">Yeni</option><option value="read">Okundu</option><option value="replied">Yanıtlandı</option><option value="archived">Arşivlendi</option></select></label>
                      <button type="submit" className="admin-button admin-button-secondary">Güncelle</button>
                    </form>
                    <a href={`mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject}`)}`} className="admin-button admin-button-secondary"><Reply className="size-4" aria-hidden="true" /> Yanıtla</a>
                    <TrashActionButton action={deleteContactMessage} id={item.id} itemName={item.subject || item.fullName} kind="trash" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AdminCard>
    </>
  );
}
