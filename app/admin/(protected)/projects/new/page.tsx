import { AdminPageHeader } from "@/app/admin/components/AdminUi";
import { ProjectForm } from "@/app/admin/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <AdminPageHeader
        title="New project"
        description="Complete both languages before publishing."
      />
      <ProjectForm project={null} />
    </>
  );
}
