import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { GalleryForm } from "@/app/admin/components/GalleryForm";
import { db } from "@/lib/db/client";
import { galleryItems } from "@/lib/db/schema";

type Params = Promise<{ id: string }>;

export default async function EditGalleryItemPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const item = await db.query.galleryItems.findFirst({
    where: eq(galleryItems.id, id),
    with: { galleryTranslations: true },
  });
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit gallery photograph"
        description="Changes to published items appear in the public gallery."
      />
      <GalleryForm item={item} />
    </>
  );
}
