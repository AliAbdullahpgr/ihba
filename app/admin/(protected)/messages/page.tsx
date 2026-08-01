import { and, desc, eq, gte, like, lte, or, type SQL } from "drizzle-orm";
import { Mail, Trash2 } from "lucide-react";
import {
  deleteContactMessage,
  updateSubmissionStatus,
} from "@/app/admin/actions";
import { MessageFilters } from "@/app/admin/components/MessageFilters";
import {
  AdminPageHeader,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { CONTACT_FORWARD_EMAIL } from "@/lib/email";

type Status = "new" | "read" | "replied" | "archived";

const statusStyles: Record<Status, string> = {
  new: "bg-[#e8f5ed] text-[#24613a]",
  read: "bg-azure-mist text-navy-ink",
  replied: "bg-gold-mist text-[#725719]",
  archived: "bg-mist text-ink/60",
};

function statusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
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
    conditions.push(
      or(
        like(contactSubmissions.fullName, pattern),
        like(contactSubmissions.email, pattern),
        like(contactSubmissions.subject, pattern),
        like(contactSubmissions.message, pattern)
      )!
    );
  }

  if (
    statusFilter === "new" ||
    statusFilter === "read" ||
    statusFilter === "replied" ||
    statusFilter === "archived"
  ) {
    conditions.push(eq(contactSubmissions.status, statusFilter as Status));
  }

  if (from) conditions.push(gte(contactSubmissions.createdAt, from));
  if (to) {
    to.setHours(23, 59, 59, 999);
    conditions.push(lte(contactSubmissions.createdAt, to));
  }

  const contacts = await db
    .select()
    .from(contactSubmissions)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(contactSubmissions.createdAt));

  const newCount = contacts.filter((c) => c.status === "new").length;

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Contact form submissions forwarded to the corporate inbox."
      />

      <MessageFilters forwardingEmail={CONTACT_FORWARD_EMAIL} />

      <div className="mt-6">
        <p className="mb-3 text-sm text-ink/55">
          {contacts.length} message{contacts.length === 1 ? "" : "s"}
          {newCount > 0 && (
            <span className="ml-2 inline-flex bg-[#e8f5ed] px-2 py-0.5 text-xs font-semibold text-[#24613a]">
              {newCount} new
            </span>
          )}
        </p>

        {!contacts.length ? (
          <div className="border border-line bg-white px-5 py-10 text-center text-sm text-ink/55">
            No messages match your search.
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((item) => {
              const status = item.status as Status;
              return (
                <article
                  key={item.id}
                  className="border border-line bg-white"
                >
                  <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
                        >
                          {statusLabel(status)}
                        </span>
                        <h2 className="font-semibold text-navy-ink">
                          {item.subject}
                        </h2>
                      </div>
                      <p className="mt-1.5 text-sm text-ink/65">
                        <span className="font-medium text-navy-ink">{item.fullName}</span>
                        {" · "}
                        <a
                          className="text-navy hover:underline"
                          href={`mailto:${item.email}`}
                        >
                          {item.email}
                        </a>
                        {item.phone ? (
                          <>
                            {" · "}
                            <a
                              className="text-navy hover:underline"
                              href={`tel:${item.phone.replace(/\s+/g, "")}`}
                            >
                              {item.phone}
                            </a>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-ink/45">
                      {item.createdAt.toLocaleString("en-GB")}
                    </time>
                  </div>

                  <div className="p-5">
                    <p className="max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
                      {item.message}
                    </p>

                    <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-line pt-4">
                      <form
                        action={updateSubmissionStatus}
                        className="flex items-center gap-3"
                      >
                        <input type="hidden" name="type" value="contact" />
                        <input type="hidden" name="id" value={item.id} />
                        <label className="text-xs font-semibold text-ink/60">
                          Status
                          <select
                            name="status"
                            defaultValue={status}
                            className={`mt-1 ${inputClass} w-36`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </label>
                        <button className="min-h-11 bg-navy-deep px-4 text-sm font-semibold text-white hover:bg-navy">
                          Update
                        </button>
                      </form>

                      <a
                        href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
                        className="inline-flex min-h-11 items-center gap-2 border border-navy-ink/20 px-4 text-sm font-semibold text-navy-ink hover:border-navy-ink/45"
                      >
                        <Mail className="size-4" />
                        Reply
                      </a>

                      <form action={deleteContactMessage} className="ml-auto">
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center gap-2 border border-red-300 bg-red-50 px-4 text-sm font-semibold text-red-700 hover:border-red-500 hover:bg-red-100"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}