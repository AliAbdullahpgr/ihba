"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { saveOrganisationSettings } from "@/app/admin/actions";
import {
  ChangeReviewDialog,
  ConfirmationDialog,
  type ReviewedChange,
} from "@/app/admin/components/AdminOverlays";
import { AdminCard, FormField, inputClass } from "@/app/admin/components/AdminUi";
import { AdminSubmitButton } from "@/app/admin/components/FormActions";
import { orgFieldDefs, orgFieldGroups } from "@/lib/org-settings";

export function OrganisationSettingsForm({
  values,
  saved,
}: {
  values: Record<string, string>;
  saved: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [review, setReview] = useState<ReviewedChange[] | null>(null);

  /**
   * Builds the confirmation list by comparing what is in the form right now
   * against the values the page was rendered with. The server recomputes this
   * independently for the audit entry — this copy exists purely so the
   * operator sees the same thing before committing.
   */
  const collectChanges = (form: HTMLFormElement): ReviewedChange[] => {
    const data = new FormData(form);
    const changes: ReviewedChange[] = [];

    for (const definition of orgFieldDefs) {
      const before = values[definition.field] ?? "";
      const after = String(data.get(definition.field) ?? "").trim();
      if (before !== after) {
        changes.push({ label: definition.label, from: before, to: after });
      }
    }

    return changes;
  };

  return (
    <>
      <form
        ref={formRef}
        action={saveOrganisationSettings}
        className="space-y-6"
        onSubmit={(event) => {
          // Nothing reaches the server until the operator has seen the diff.
          if (review) return;
          event.preventDefault();
          const changes = collectChanges(event.currentTarget);
          if (!changes.length) {
            setReview([]);
            return;
          }
          setReview(changes);
        }}
      >
        {saved && (
          <div className="admin-feedback admin-feedback-success" role="status">
            Kurum bilgileri kaydedildi.
          </div>
        )}

        {orgFieldGroups.map((group) => (
          <AdminCard key={group.key} title={group.title} description={group.description}>
            <div className="admin-settings-grid">
              {orgFieldDefs
                .filter((definition) => definition.group === group.key)
                .map((definition) => (
                  <FormField
                    key={definition.field}
                    label={definition.label}
                    hint={definition.hint}
                  >
                    {definition.type === "textarea" ? (
                      <textarea
                        name={definition.field}
                        rows={3}
                        defaultValue={values[definition.field] ?? ""}
                        placeholder={definition.placeholder}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        name={definition.field}
                        type={definition.type ?? "text"}
                        defaultValue={values[definition.field] ?? ""}
                        placeholder={definition.placeholder}
                        className={inputClass}
                      />
                    )}
                  </FormField>
                ))}
            </div>
          </AdminCard>
        ))}

        {/*
          Bank accounts moved to the donation screen, where an operator looking
          to publish an IBAN actually goes. Keeping a second editor here would
          mean two forms submitting the whole account list, and whichever was
          loaded first would silently delete accounts added in the other.
        */}
        <AdminCard
          title="Banka hesapları ve IBAN bilgileri"
          description="Bağış sayfasında yayınlanan hesaplar burada değil, Bağış bilgileri sayfasında yönetilir."
        >
          <p className="admin-field-hint">
            Banka hesabı eklemek, düzenlemek veya yayından kaldırmak için{" "}
            <Link href="/admin/donation" className="admin-inline-link">
              Bağış ve IBAN bilgileri
            </Link>{" "}
            sayfasını kullanın.
          </p>
        </AdminCard>

        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border border-line bg-white p-4">
          <p className="text-xs text-ink/55">
            Kaydetmeden önce değiştirdiğiniz bilgiler tek tek gösterilir.
          </p>
          <AdminSubmitButton>Değişiklikleri gözden geçir</AdminSubmitButton>
        </div>
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
    </>
  );
}
