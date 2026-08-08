import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { getAdminSession } from "@/lib/auth-guard";

export const metadata = { title: "Yönetici girişi" };

/**
 * Payload's login view: a narrow centred column on the plain app background,
 * no card chrome and no accent rule. Wrapped in `.pl-shell` so it inherits the
 * same tokens and type scale as the panel behind it.
 */
export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");

  return (
    <div className="pl-shell pl-login">
      <main className="pl-login__wrap">
        <img
          src="/brand/logo-horizontal.png"
          alt="International Humanity Bridge"
          className="pl-login__logo"
        />
        <h1 className="pl-login__title">IHBA içerik çalışma alanı</h1>
        <p className="pl-login__intro">
          Website içeriğini ve başvuruları yönetmek için giriş yapın.
        </p>
        <LoginForm />
      </main>
    </div>
  );
}
