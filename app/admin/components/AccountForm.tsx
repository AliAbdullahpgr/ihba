"use client";

import { Check, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { inputClass } from "@/app/admin/components/AdminUi";
import { authClient } from "@/lib/auth-client";

export function AccountForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword"));
    if (newPassword !== String(form.get("confirmPassword"))) {
      setError("The new passwords do not match.");
      setPending(false);
      return;
    }

    const result = await authClient.changePassword({
      currentPassword: String(form.get("currentPassword")),
      newPassword,
      revokeOtherSessions: true,
    });
    if (result.error) {
      setError(result.error.message || "The password could not be changed.");
      setPending(false);
      return;
    }
    event.currentTarget.reset();
    setMessage("Password changed. Other sessions have been signed out.");
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="max-w-xl border border-line bg-white p-5 sm:p-6">
      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-navy-ink">
            Current password
          </span>
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-navy-ink">
            New password
          </span>
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
            className={inputClass}
          />
          <span className="mt-1.5 block text-xs text-ink/55">
            Use at least 12 characters and avoid reused passwords.
          </span>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-navy-ink">
            Confirm new password
          </span>
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
            className={inputClass}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-semibold text-[#8f3029]">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#24613a]">
          <Check className="size-4" />
          {message}
        </p>
      )}

      <div className="mt-6 flex justify-end border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center gap-2 bg-navy-deep px-5 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {pending ? "Changing..." : "Change password"}
        </button>
      </div>
    </form>
  );
}
