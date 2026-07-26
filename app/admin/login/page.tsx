import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { getAdminSession } from "@/lib/auth-guard";

export const metadata = { title: "Admin sign in" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9fb] px-4 py-10">
      <div className="w-full max-w-md border-t-4 border-navy bg-white px-6 py-8 sm:px-9">
        <img
          src="/brand/logo-horizontal.png"
          alt="International Humanity Bridge"
          className="h-14 w-auto object-contain"
        />
        <div className="mt-8 border-t border-line pt-7">
          <h1 className="text-2xl font-semibold text-navy-ink">
            Content workspace
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Sign in to manage the IHBA website and submissions.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
