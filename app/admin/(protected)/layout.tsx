import { AdminShell } from "@/app/admin/components/AdminShell";
import { requireAdmin } from "@/lib/auth-guard";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return <AdminShell userName={session.user.name}>{children}</AdminShell>;
}
