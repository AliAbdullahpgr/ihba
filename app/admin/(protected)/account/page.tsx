import { AccountForm } from "@/app/admin/components/AccountForm";
import { AdminPageHeader } from "@/app/admin/components/AdminUi";

export default function AdminAccountPage() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Sistem"
        title="Hesap"
        description="Yönetici parolanızı değiştirin ve açık olan diğer oturumları kapatın."
      />
      <AccountForm />
    </>
  );
}
