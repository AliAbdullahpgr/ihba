import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { GalleryForm } from "@/app/admin/components/GalleryForm";

export default function NewGalleryItemPage() {
  return (
    <>
      <AdminPageHeader
        title="New gallery photograph"
        description="Upload the image, add both language captions and choose its placement."
      />
      <GalleryForm item={null} />
    </>
  );
}
