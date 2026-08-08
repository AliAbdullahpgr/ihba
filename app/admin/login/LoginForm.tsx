"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
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
      setError("E-posta adresi veya parola doğru değil.");
      setPending(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="pl-login__form">
      <div className="pl-login__field">
        <label htmlFor="login-email">E-posta adresi</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="pl-login__field">
        <label htmlFor="login-password">Parola</label>
        <div className="pl-login__password">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}
          >
            {showPassword ? (
              <EyeOff className="pl-icon" aria-hidden="true" />
            ) : (
              <Eye className="pl-icon" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="pl-login__error">
          {error}
        </p>
      )}

      {/*
        Both children stay wrapped in elements — a bare text node beside a
        swapped element is what Chrome's auto-translate rewrites, which leaves
        React inserting before a node that is no longer its child.
      */}
      <button type="submit" disabled={pending} className="pl-btn pl-btn--primary pl-login__submit">
        {pending && (
          <span className="pl-login__spinner" aria-hidden="true">
            <Loader2 className="pl-icon" />
          </span>
        )}
        <span>{pending ? "Giriş yapılıyor…" : "Giriş yap"}</span>
      </button>
    </form>
  );
}
