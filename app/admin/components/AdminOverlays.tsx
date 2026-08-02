"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  destructive = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
        aria-describedby="admin-dialog-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={`admin-dialog-icon ${destructive ? "is-danger" : ""}`}>
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <button type="button" className="admin-dialog-close" onClick={onClose} aria-label="Diyaloğu kapat">
          <X className="size-4" aria-hidden="true" />
        </button>
        <h2 id="admin-dialog-title">{title}</h2>
        <p id="admin-dialog-description">{description}</p>
        <div className="admin-dialog-actions">
          <button type="button" className="admin-button admin-button-secondary" onClick={onClose}>{cancelLabel}</button>
          <button ref={confirmRef} type="button" className={`admin-button ${destructive ? "admin-button-danger" : "admin-button-primary"}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}

export type ReviewedChange = {
  label: string;
  from: string;
  to: string;
  sensitive?: boolean;
};

/**
 * Shows exactly what is about to change before a settings save goes through.
 *
 * Bank and IBAN rows are separated out and warned about explicitly: a wrong
 * phone number is an inconvenience, a wrong IBAN sends donations to a stranger,
 * and the operator should not have to spot the difference in a uniform list.
 */
export function ChangeReviewDialog({
  open,
  changes,
  onConfirm,
  onClose,
  title = "Bu değişiklikleri kaydetmek üzeresiniz",
  confirmLabel = "Evet, değişiklikleri kaydet",
}: {
  open: boolean;
  changes: ReviewedChange[];
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  confirmLabel?: string;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const sensitive = changes.filter((change) => change.sensitive);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-dialog admin-dialog-wide"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-review-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={`admin-dialog-icon ${sensitive.length ? "is-danger" : ""}`}>
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <button type="button" className="admin-dialog-close" onClick={onClose} aria-label="Diyaloğu kapat">
          <X className="size-4" aria-hidden="true" />
        </button>
        <h2 id="admin-review-title">{title}</h2>

        {sensitive.length > 0 && (
          <p className="admin-review-warning" role="alert">
            <AlertTriangle className="size-4" aria-hidden="true" />
            <span>
              Banka veya IBAN bilgisi değiştiriyorsunuz. Yanlış bir IBAN,
              bağışların başka bir hesaba gitmesine yol açar. Lütfen aşağıdaki
              satırları rakam rakam kontrol edin.
            </span>
          </p>
        )}

        <ul className="admin-review-list">
          {changes.map((change) => (
            <li
              key={`${change.label}-${change.from}-${change.to}`}
              className={change.sensitive ? "admin-review-row is-sensitive" : "admin-review-row"}
            >
              <span className="admin-review-field">{change.label}</span>
              <span className="admin-review-values">
                <span className="admin-review-from">{change.from || "(boş)"}</span>
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="admin-review-to">{change.to || "(boş)"}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="admin-dialog-actions">
          <button type="button" className="admin-button admin-button-secondary" onClick={onClose}>
            Vazgeç
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={`admin-button ${sensitive.length ? "admin-button-danger" : "admin-button-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export function UnsavedChangesDialog({
  open,
  onStay,
  onLeave,
}: {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}) {
  return (
    <ConfirmationDialog
      open={open}
      title="Kaydedilmemiş değişiklikler var"
      description="Bu sayfadan ayrılırsanız yaptığınız değişiklikler kaybolacak. Ayrılmak istediğinizden emin misiniz?"
      confirmLabel="Ayrıl"
      cancelLabel="Sayfada kal"
      destructive
      onConfirm={onLeave}
      onClose={onStay}
    />
  );
}

export function AdminToast({
  message,
  tone = "success",
  onClose,
}: {
  message: string;
  tone?: "success" | "error" | "info";
  onClose?: () => void;
}) {
  return (
    <div className={`admin-toast admin-toast-${tone}`} role={tone === "error" ? "alert" : "status"}>
      <CheckCircle2 className="size-4" aria-hidden="true" />
      <span>{message}</span>
      {onClose && <button type="button" onClick={onClose} aria-label="Bildirimi kapat"><X className="size-4" aria-hidden="true" /></button>}
    </div>
  );
}
