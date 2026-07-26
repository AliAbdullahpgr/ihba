import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { NewsForm } from "@/app/admin/components/NewsForm";

export default function NewArticlePage() {
  return (
    <>
      <AdminPageHeader
        title="New article"
        description="Complete both languages before publishing."
      />
      <NewsForm article={null} />
    </>
  );
}
