import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  AdminButton,
  AdminPageHeader,
  StatusBadge,
} from "@/app/admin/components/AdminUi";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";

export default async function AdminProjectsPage() {
  const rows = await db.query.projects.findMany({
    with: { projectTranslations: true },
    orderBy: [asc(projects.sortOrder)],
  });

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Manage bilingual project pages, facts, images and publication."
        action={
          <AdminButton href="/admin/projects/new">
            <Plus className="size-4" />
            New project
          </AdminButton>
        }
      />

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="border-b border-line bg-azure-mist/70 text-xs font-semibold uppercase text-ink/55">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Updated</th>
              <th className="w-20 px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((project) => {
              const translation = project.projectTranslations.find(
                (item) => item.locale === "en"
              );
              return (
                <tr
                  key={project.id}
                  className="border-b border-line last:border-0 hover:bg-azure-mist/35"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-navy-ink">
                      {translation?.title ?? project.slug}
                    </p>
                    <p className="mt-1 text-xs text-ink/50">
                      Order {project.sortOrder}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-ink/60">
                    /projects/{project.slug}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge state={project.state} />
                  </td>
                  <td className="px-4 py-4 text-sm text-ink/60">
                    {project.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-sm font-semibold text-navy hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-navy-ink">No projects yet</p>
            <p className="mt-1 text-sm text-ink/55">
              Create the first project to start publishing.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
