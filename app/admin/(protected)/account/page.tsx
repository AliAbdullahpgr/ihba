import { AccountForm } from "@/app/admin/components/AccountForm";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";

export default function AdminAccountPage() {
  return (
    <>
      <AdminPageHeader
        title="Account"
        description="Change your administrator password and revoke other active sessions."
      />
      <AccountForm />
    </>
  );
}
