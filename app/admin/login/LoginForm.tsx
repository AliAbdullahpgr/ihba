"use client";

import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const result = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (result.error) {
      setError("The email or password is incorrect.");
      setPending(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-navy-ink">
          Email address
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="min-h-11 w-full border border-navy-ink/25 bg-white px-3.5 py-2.5 text-base text-navy-ink outline-none hover:border-navy-ink/45 focus:border-navy focus:ring-2 focus:ring-azure/30"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-navy-ink">
          Password
        </span>
        <span className="relative block">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="min-h-11 w-full border border-navy-ink/25 bg-white px-3.5 py-2.5 pr-12 text-base text-navy-ink outline-none hover:border-navy-ink/45 focus:border-navy focus:ring-2 focus:ring-azure/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink/55 hover:text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm font-semibold text-[#a33b32]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex min-h-11 w-full items-center justify-center gap-2 bg-navy-deep px-4 text-sm font-semibold text-white transition-colors hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:cursor-wait disabled:opacity-65"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LockKeyhole className="size-4" />
        )}
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
