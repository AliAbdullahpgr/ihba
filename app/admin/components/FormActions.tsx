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
      {/*
        Both children stay wrapped in elements. A bare text node next to a
        swapped element is what Chrome's auto-translate (and password-manager
        extensions) rewrite, which leaves React inserting before a node that is
        no longer its child — the "Failed to execute 'insertBefore'" crash.
      */}
      <span className="grid size-4 place-items-center" aria-hidden="true">
        {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
      </span>
      <span>{pending ? "Kaydediliyor…" : children}</span>
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
