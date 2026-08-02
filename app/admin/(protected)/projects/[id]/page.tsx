import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { ProjectForm } from "@/app/admin/components/ProjectForm";
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";

type Params = Promise<{ id: string }>;

export default async function EditProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      projectTranslations: true,
      projectImages: { orderBy: (image, { asc }) => [asc(image.sortOrder)] },
    },
  });
  if (!project) notFound();

  return (
    <>
      <AdminPageHeader
        title="Projeyi düzenle"
        description={`/${project.slug}`}
        backHref="/admin/projects"
      />
      <ProjectForm
        project={{
          ...project,
          projectImages: project.projectImages.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
            imagePublicId: image.imagePublicId ?? "",
            captionTr: image.captionTr,
            captionEn: image.captionEn,
            altTr: image.altTr,
            altEn: image.altEn,
          })),
        }}
      />
    </>
  );
}
