"use client";

import { ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { saveSocialAccounts } from "@/app/admin/actions";
import { ConfirmationDialog } from "@/app/admin/components/AdminOverlays";
import { AdminCard, FormField, inputClass } from "@/app/admin/components/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";

export type AdminSocialAccount = {
  id: string;
  platform: string;
  label: string;
  url: string;
  active: boolean;
  openInNewTab: boolean;
};

/**
 * Platforms with a bundled brand mark. The list is a convenience, not a
 * constraint — a platform typed by hand still saves and renders with a generic
 * link icon, which is what makes adding a sixth network data entry rather than
 * a code change.
 */
const KNOWN_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
];

export function SocialAccountsForm({
  initialAccounts,
  saved,
}: {
  initialAccounts: AdminSocialAccount[];
  saved: boolean;
}) {
  const [draft, setDraft] = useState<AdminSocialAccount[]>(initialAccounts);
  const [removing, setRemoving] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const update = (index: number, patch: Partial<AdminSocialAccount>) => {
    setDraft((current) =>
      current.map((account, position) =>
        position === index ? { ...account, ...patch } : account
      )
    );
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= draft.length) return;
    setDraft((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <>
      <form action={saveSocialAccounts} className="space-y-6">
        <UnsavedChangesGuard />

        {saved && (
          <div className="admin-feedback admin-feedback-success" role="status">
            Sosyal medya hesapları kaydedildi.
          </div>
        )}

        <AdminCard
          title="Hesaplar"
          description="Sıralamayı sürükleyerek değiştirebilirsiniz. Bağlantısı boş bırakılan veya kapatılan hesaplar website'de görünmez."
        >
          {draft.length === 0 && (
            <p className="admin-field-hint">
              Henüz hesap eklenmemiş. Aşağıdaki düğmeyle ilk hesabı ekleyin.
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
                  if (dragIndex !== null) move(dragIndex, index);
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
                      onClick={() => move(index, index - 1)}
                      disabled={index === 0}
                      aria-label="Yukarı taşı"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button-quiet"
                      onClick={() => move(index, index + 1)}
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
                      onChange={(event) => update(index, { active: event.target.checked })}
                    />
                    Yayında
                  </label>
                  <label className="admin-bank-active">
                    <input
                      type="checkbox"
                      checked={account.openInNewTab}
                      onChange={(event) =>
                        update(index, { openInNewTab: event.target.checked })
                      }
                    />
                    Yeni sekmede açılsın
                  </label>
                  {account.url && (
                    <a
                      href={account.url}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-button admin-button-quiet"
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                      Test et
                    </a>
                  )}
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
                  <FormField
                    label="Platform"
                    hint="Listeden seçin veya yeni bir platform adı yazın."
                  >
                    <input
                      list="social-platforms"
                      value={account.platform}
                      onChange={(event) =>
                        update(index, { platform: event.target.value.toLowerCase() })
                      }
                      className={inputClass}
                    />
                  </FormField>
                  <FormField
                    label="Görünen ad"
                    hint="Ekran okuyucular için. Boş bırakılırsa platform adı kullanılır."
                  >
                    <input
                      value={account.label}
                      onChange={(event) => update(index, { label: event.target.value })}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Bağlantı" hint="https:// ile başlamalıdır.">
                    <input
                      type="url"
                      value={account.url}
                      placeholder="https://instagram.com/…"
                      onChange={(event) => update(index, { url: event.target.value })}
                      className={inputClass}
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>

          <datalist id="social-platforms">
            {KNOWN_PLATFORMS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </datalist>

          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() =>
              setDraft((current) => [
                ...current,
                {
                  id: "",
                  platform: "",
                  label: "",
                  url: "",
                  active: true,
                  openInNewTab: true,
                },
              ])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Hesap ekle
          </button>
        </AdminCard>

        <input type="hidden" name="accounts" value={JSON.stringify(draft)} />

        <div className="sticky bottom-0 flex justify-end border border-line bg-white p-4">
          <AdminSubmitButton>Hesapları kaydet</AdminSubmitButton>
        </div>
      </form>

      <ConfirmationDialog
        open={removing !== null}
        title="Hesabı kaldır"
        description="Bu hesap listeden kaldırılacak. Değişiklik ancak formu kaydettiğinizde geçerli olur."
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
