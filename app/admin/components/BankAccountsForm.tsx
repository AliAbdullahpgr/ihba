"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { saveBankAccounts } from "@/app/admin/actions";
import {
  ChangeReviewDialog,
  ConfirmationDialog,
  type ReviewedChange,
} from "@/app/admin/components/AdminOverlays";
import { AdminCard, FormField, inputClass } from "@/app/admin/components/AdminUi";
import { AdminSubmitButton } from "@/app/admin/components/FormActions";
import {
  bankFieldDefs,
  formatIban,
  normaliseIban,
  type BankAccountValues,
} from "@/lib/org-settings";

const CURRENCY_SUGGESTIONS = ["TRY", "USD", "EUR", "GBP", "SAR"];

function emptyAccount(): BankAccountValues {
  return {
    // Empty id marks the row as new; the server allocates the real one so a
    // client-generated value never becomes a database key.
    id: "",
    currency: "",
    bankName: "",
    accountHolder: "",
    iban: "",
    active: true,
    sortOrder: 0,
  };
}

/**
 * Add, reorder, unpublish and remove the bank accounts shown on the donation
 * page. Saving publishes immediately — an account marked "Yayında" appears on
 * /donate as soon as the confirmation is accepted — so every change passes
 * through a diff the operator has to read first.
 */
export function BankAccountsForm({
  accounts,
  saved,
}: {
  accounts: BankAccountValues[];
  saved: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<BankAccountValues[]>(accounts);
  const [review, setReview] = useState<ReviewedChange[] | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const updateAccount = (index: number, patch: Partial<BankAccountValues>) => {
    setDraft((current) =>
      current.map((account, position) =>
        position === index ? { ...account, ...patch } : account,
      ),
    );
  };

  const moveAccount = (from: number, to: number) => {
    if (to < 0 || to >= draft.length) return;
    setDraft((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  /**
   * Compares the draft against what the page was rendered with. The server
   * recomputes this independently for the audit entry — this copy exists purely
   * so the operator sees the same thing before committing.
   */
  const collectChanges = (): ReviewedChange[] => {
    const changes: ReviewedChange[] = [];

    for (const account of draft) {
      const before = accounts.find((candidate) => candidate.id === account.id && account.id);
      if (!before) {
        changes.push({
          label: `Yeni banka hesabı (${account.currency || "?"})`,
          from: "—",
          to: `${account.bankName} · ${formatIban(account.iban)}`.trim(),
          sensitive: true,
        });
        continue;
      }
      for (const { field, label } of bankFieldDefs) {
        const previous = before[field as keyof BankAccountValues];
        const next = account[field as keyof BankAccountValues];
        const from =
          typeof previous === "boolean" ? (previous ? "Açık" : "Kapalı") : String(previous ?? "");
        const to = typeof next === "boolean" ? (next ? "Açık" : "Kapalı") : String(next ?? "");
        if (field === "iban" ? normaliseIban(from) === normaliseIban(to) : from === to) continue;
        changes.push({
          label: `${account.currency || before.currency} — ${label}`,
          from: field === "iban" ? formatIban(from) : from,
          to: field === "iban" ? formatIban(to) : to,
          sensitive: true,
        });
      }
    }

    for (const before of accounts) {
      if (draft.some((account) => account.id === before.id)) continue;
      changes.push({
        label: `Banka hesabı kaldırıldı (${before.currency})`,
        from: `${before.bankName} · ${formatIban(before.iban)}`.trim(),
        to: "Kaldırıldı",
        sensitive: true,
      });
    }

    return changes;
  };

  return (
    <>
      <form
        ref={formRef}
        action={saveBankAccounts}
        className="admin-settings-form"
        onSubmit={(event) => {
          // Nothing reaches the server until the operator has seen the diff.
          if (review) return;
          event.preventDefault();
          setReview(collectChanges());
        }}
      >
        {saved && (
          <div className="admin-feedback admin-feedback-success" role="status">
            Banka bilgileri kaydedildi ve Bağış sayfasında yayınlandı.
          </div>
        )}

        <AdminCard
          eyebrow="Bağış sayfası"
          title="Banka hesapları ve IBAN bilgileri"
          description="Buraya eklediğiniz her hesap, kaydettiğiniz anda Bağış sayfasında yayınlanır. Her para birimi için ayrı bir hesap ekleyebilirsiniz."
        >
          <p className="admin-bank-warning" role="note">
            IBAN bilgisi bağışların ulaştığı yerdir. Kaydetmeden önce değişiklikleri onay
            ekranında tekrar kontrol edeceksiniz.
          </p>

          {draft.length === 0 && (
            <p className="admin-field-hint" style={{ marginBottom: "12px" }}>
              Henüz banka hesabı eklenmedi. Hesap eklenene kadar Bağış sayfasında yukarıdaki
              &quot;banka bilgisi yoksa gösterilecek açıklama&quot; metni görünür.
            </p>
          )}

          <div className="admin-bank-list">
            {draft.map((account, index) => (
              <div
                key={account.id || `new-${index}`}
                className="admin-bank-row"
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) moveAccount(dragIndex, index);
                  setDragIndex(null);
                }}
              >
                <div className="admin-bank-row-head">
                  <span className="admin-bank-handle" aria-hidden="true">
                    <GripVertical className="size-4" />
                  </span>
                  <div className="admin-bank-order">
                    <button
                      type="button"
                      className="admin-button admin-button-quiet"
                      onClick={() => moveAccount(index, index - 1)}
                      disabled={index === 0}
                      aria-label="Yukarı taşı"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button-quiet"
                      onClick={() => moveAccount(index, index + 1)}
                      disabled={index === draft.length - 1}
                      aria-label="Aşağı taşı"
                    >
                      ↓
                    </button>
                  </div>
                  <label className="admin-bank-active">
                    <input
                      type="checkbox"
                      checked={account.active}
                      onChange={(event) => updateAccount(index, { active: event.target.checked })}
                    />
                    Yayında
                  </label>
                  <button
                    type="button"
                    className="admin-button admin-button-danger"
                    onClick={() => setRemoving(index)}
                    aria-label="Hesabı kaldır"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="admin-settings-grid">
                  <FormField label="Para birimi" hint="Örnek: TRY, USD, EUR">
                    <input
                      list="currency-suggestions"
                      value={account.currency}
                      onChange={(event) =>
                        updateAccount(index, { currency: event.target.value.toUpperCase() })
                      }
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Banka adı">
                    <input
                      value={account.bankName}
                      onChange={(event) => updateAccount(index, { bankName: event.target.value })}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Hesap sahibi">
                    <input
                      value={account.accountHolder}
                      onChange={(event) =>
                        updateAccount(index, { accountHolder: event.target.value })
                      }
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="IBAN" hint="TR ile başlayan 26 haneli numara.">
                    <input
                      value={account.iban}
                      onChange={(event) => updateAccount(index, { iban: event.target.value })}
                      className={`${inputClass} font-mono`}
                      spellCheck={false}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>

          <datalist id="currency-suggestions">
            {CURRENCY_SUGGESTIONS.map((currency) => (
              <option key={currency} value={currency} />
            ))}
          </datalist>

          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() => setDraft((current) => [...current, emptyAccount()])}
          >
            <Plus className="size-4" aria-hidden="true" />
            Banka hesabı ekle
          </button>

          <input type="hidden" name="bankAccounts" value={JSON.stringify(draft)} />

          <div className="admin-settings-footer">
            <span>Kaydetmeden önce değiştirdiğiniz bilgiler tek tek gösterilir.</span>
            <AdminSubmitButton>Değişiklikleri gözden geçir</AdminSubmitButton>
          </div>
        </AdminCard>
      </form>

      <ChangeReviewDialog
        open={review !== null && review.length > 0}
        changes={review ?? []}
        onClose={() => setReview(null)}
        onConfirm={() => {
          // `review` stays set so the submit handler lets this pass through.
          formRef.current?.requestSubmit();
        }}
      />

      <ConfirmationDialog
        open={review !== null && review.length === 0}
        title="Değişiklik yok"
        description="Kaydedilecek bir değişiklik bulunamadı. Bilgileri düzenleyip tekrar deneyebilirsiniz."
        confirmLabel="Tamam"
        cancelLabel="Kapat"
        onConfirm={() => setReview(null)}
        onClose={() => setReview(null)}
      />

      <ConfirmationDialog
        open={removing !== null}
        title="Banka hesabını kaldır"
        description="Bu hesap Bağış sayfasından kaldırılacak. Değişiklik ancak formu kaydettiğinizde geçerli olur."
        confirmLabel="Kaldır"
        destructive
        onConfirm={() => {
          setDraft((current) => current.filter((_, index) => index !== removing));
          setRemoving(null);
        }}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
