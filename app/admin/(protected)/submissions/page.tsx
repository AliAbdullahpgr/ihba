import { desc } from "drizzle-orm";
import Link from "next/link";
import { updateSubmissionStatus } from "@/app/admin/actions";
import {
  AdminPageHeader,
  inputClass,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import {
  newsletterSubscribers,
  volunteerApplications,
} from "@/lib/db/schema";

export default async function AdminSubmissionsPage() {
  const [volunteers, subscribers] = await Promise.all([
    db
      .select()
      .from(volunteerApplications)
      .orderBy(desc(volunteerApplications.createdAt)),
    db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt)),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Submissions"
        description="Volunteer applications and newsletter sign-ups. Contact messages have their own page."
      />

      <div className="space-y-5">
        <Link
          href="/admin/messages"
          className="flex items-center justify-between border border-azure/30 bg-azure-mist/30 px-5 py-4 text-sm font-semibold text-navy-ink hover:bg-azure-mist/50"
        >
          <span>Manage contact messages (search, filter, archive &amp; delete)</span>
          <span className="text-azure-deep">&rarr;</span>
        </Link>

        <details className="border border-line bg-white">
          <summary className="cursor-pointer px-5 py-4 font-semibold text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure">
            Volunteer applications
            <span className="ml-2 text-sm font-normal text-ink/45">
              {volunteers.length}
            </span>
          </summary>
          <div className="border-t border-line">
            {volunteers.map((item) => (
              <article key={item.id} className="border-b border-line p-5 last:border-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-navy-ink">{item.fullName}</h2>
                    <p className="mt-1 text-sm text-ink/60">
                      {item.city} · {item.areaOfInterest} · {item.availability}
                    </p>
                    <a
                      className="mt-1 block text-sm text-navy hover:underline"
                      href={`mailto:${item.email}`}
                    >
                      {item.email}
                    </a>
                  </div>
                  <time className="text-xs text-ink/45">
                    {item.createdAt.toLocaleString()}
                  </time>
                </div>
                <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
                  {item.message}
                </p>
                <form action={updateSubmissionStatus} className="mt-4 flex max-w-sm gap-3">
                  <input type="hidden" name="type" value="volunteer" />
                  <input type="hidden" name="id" value={item.id} />
                  <select name="status" defaultValue={item.status} className={inputClass}>
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button className="min-h-11 bg-navy-deep px-4 text-sm font-semibold text-white">
                    Update
                  </button>
                </form>
              </article>
            ))}
            {!volunteers.length && (
              <p className="p-5 text-sm text-ink/55">No applications yet.</p>
            )}
          </div>
        </details>

        <details className="border border-line bg-white">
          <summary className="cursor-pointer px-5 py-4 font-semibold text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure">
            Newsletter subscribers
            <span className="ml-2 text-sm font-normal text-ink/45">
              {subscribers.length}
            </span>
          </summary>
          <ul className="border-t border-line">
            {subscribers.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 text-sm last:border-0"
              >
                <a className="font-semibold text-navy hover:underline" href={`mailto:${item.email}`}>
                  {item.email}
                </a>
                <span className="text-ink/45">
                  {item.locale.toUpperCase()} · {item.createdAt.toLocaleDateString()}
                </span>
              </li>
            ))}
            {!subscribers.length && (
              <li className="p-5 text-sm text-ink/55">No subscribers yet.</li>
            )}
          </ul>
        </details>
      </div>
    </>
  );
}
