"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

export function AdminSubmitButton({
  children,
  className = "admin-button admin-button-primary",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Kaydediliyor…" : children}
    </button>
  );
}

export function UnsavedChangesGuard() {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const form = anchorRef.current?.closest("form") ?? null;
    if (!form) return;
    const markDirty = () => { dirtyRef.current = true; };
    const clearDirty = () => { dirtyRef.current = false; };
    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    form.addEventListener("submit", clearDirty);
    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
      form.removeEventListener("submit", clearDirty);
      window.removeEventListener("beforeunload", warnBeforeLeave);
    };
  }, []);

  return <span ref={anchorRef} hidden aria-hidden="true" />;
}
