import { count, eq } from "drizzle-orm";
import {
  ArrowRight,
  ContactRound,
  FolderKanban,
  Newspaper,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import {
  contactSubmissions,
  newsArticles,
  projects,
  volunteerApplications,
} from "@/lib/db/schema";

export default async function AdminOverviewPage() {
  const [[projectCount], [draftCount], [contactCount], [volunteerCount]] =
    await Promise.all([
      db.select({ value: count() }).from(projects),
      db
        .select({ value: count() })
        .from(newsArticles)
        .where(eq(newsArticles.state, "draft")),
      db
        .select({ value: count() })
        .from(contactSubmissions)
        .where(eq(contactSubmissions.status, "new")),
      db
        .select({ value: count() })
        .from(volunteerApplications)
        .where(eq(volunteerApplications.status, "new")),
    ]);

  const rows = [
    {
      label: "Projects",
      value: projectCount.value,
      note: "Total project records",
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "News drafts",
      value: draftCount.value,
      note: "Waiting to be published",
      href: "/admin/news",
      icon: Newspaper,
    },
    {
      label: "New messages",
      value: contactCount.value,
      note: "Contact enquiries",
      href: "/admin/messages",
      icon: ContactRound,
    },
    {
      label: "Volunteer applications",
      value: volunteerCount.value,
      note: "Waiting for review",
      href: "/admin/submissions",
      icon: UserRoundPlus,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Publishing status and incoming work that needs attention."
      />
      <div className="border border-line bg-white">
        {rows.map(({ label, value, note, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group grid min-h-20 grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-line px-4 py-4 last:border-0 hover:bg-azure-mist/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure sm:grid-cols-[44px_220px_1fr_auto]"
          >
            <span className="grid size-11 place-items-center bg-azure-mist text-navy">
              <Icon className="size-5" />
            </span>
            <span className="font-semibold text-navy-ink">{label}</span>
            <span className="hidden text-sm text-ink/55 sm:block">{note}</span>
            <span className="flex items-center gap-4">
              <span className="min-w-8 text-right text-xl font-semibold text-navy-ink">
                {value}
              </span>
              <ArrowRight className="size-4 text-ink/35 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-8 border-t border-navy-ink/30 pt-5">
        <h2 className="text-base font-semibold text-navy-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex min-h-11 items-center bg-navy-deep px-4 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            New project
          </Link>
          <Link
            href="/admin/news/new"
            className="inline-flex min-h-11 items-center border border-navy-ink/20 bg-white px-4 text-sm font-semibold text-navy-ink hover:border-navy-ink/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            New article
          </Link>
          <Link
            href="/admin/content"
            className="inline-flex min-h-11 items-center border border-navy-ink/20 bg-white px-4 text-sm font-semibold text-navy-ink hover:border-navy-ink/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            Edit site copy
          </Link>
          <Link
            href="/admin/president"
            className="inline-flex min-h-11 items-center border border-navy-ink/20 bg-white px-4 text-sm font-semibold text-navy-ink hover:border-navy-ink/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
          >
            Edit president message
          </Link>
        </div>
      </section>
    </>
  );
}
