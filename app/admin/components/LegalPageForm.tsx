"use client";

import { ChevronDown, ChevronUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { saveLegalPage } from "@/app/admin/actions";
import { ConfirmationDialog } from "@/app/admin/components/AdminOverlays";
import { AdminCard, FormField, inputClass } from "@/app/admin/components/AdminUi";
import { AdminSubmitButton, UnsavedChangesGuard } from "@/app/admin/components/FormActions";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";

export type LegalSectionValue = { heading: string; paragraphs: string[] };
export type LegalDocumentValue = {
  title: string;
  lede: string;
  lastUpdated: string;
  sections: LegalSectionValue[];
};

/**
 * Sections carry a client-side id so the rich text editor keeps its content
 * when the list is reordered or a row above it is deleted. Keying on the array
 * index would hand a surviving editor its neighbour's text.
 */
type DraftSection = LegalSectionValue & { uid: string };

export function LegalPageForm({
  locale,
  legalKey,
  title,
  description,
  href,
  value,
}: {
  locale: "tr" | "en";
  legalKey: string;
  title: string;
  description: string;
  href: string;
  value: LegalDocumentValue;
}) {
  const nextUid = useRef(value.sections.length);
  const [sections, setSections] = useState<DraftSection[]>(
    value.sections.map((section, index) => ({ ...section, uid: `s${index}` })),
  );
  const [removing, setRemoving] = useState<string | null>(null);

  const move = (index: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    setSections((current) => {
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  return (
    <>
      <AdminCard
        title={title}
        description={description}
        action={
          <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            className="admin-button admin-button-secondary"
          >
            Sayfayı görüntüle
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        }
      >
        <form action={saveLegalPage} className="admin-content-form">
          <UnsavedChangesGuard />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="legalKey" value={legalKey} />
          <input type="hidden" name="sectionCount" value={sections.length} />

          <div className="admin-settings-grid">
            <FormField label="Sayfa başlığı">
              <input name="title" defaultValue={value.title} className={inputClass} />
            </FormField>
            <FormField label="Son güncelleme tarihi">
              <input name="lastUpdated" defaultValue={value.lastUpdated} className={inputClass} />
            </FormField>
          </div>

          <FormField label="Giriş cümlesi">
            <textarea name="lede" defaultValue={value.lede} rows={3} className={inputClass} />
          </FormField>

          <div className="admin-legal-sections">
            {sections.map((section, index) => (
              <div key={section.uid} className="admin-legal-section">
                <div className="admin-legal-section-head">
                  <span className="admin-eyebrow">{index + 1}. bölüm</span>
                  <div className="admin-legal-section-tools">
                    <button
                      type="button"
                      className="admin-button admin-button-quiet"
                      onClick={() => move(index, index - 1)}
                      disabled={index === 0}
                      aria-label="Yukarı taşı"
                    >
                      <ChevronUp className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button-quiet"
                      onClick={() => move(index, index + 1)}
                      disabled={index === sections.length - 1}
                      aria-label="Aşağı taşı"
                    >
                      <ChevronDown className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button-danger"
                      onClick={() => setRemoving(section.uid)}
                      aria-label="Bölümü sil"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <FormField label="Bölüm başlığı">
                  <input
                    name={`sectionHeading:${index}`}
                    defaultValue={section.heading}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Bölüm metni">
                  <RichTextEditor
                    name={`sectionBody:${index}`}
                    initialBlocks={section.paragraphs}
                    placeholder="Bu bölümün metnini buraya yazın…"
                  />
                </FormField>
              </div>
            ))}
          </div>

          {sections.length === 0 && (
            <p className="admin-field-hint">
              Bu metinde henüz bölüm yok. Aşağıdaki düğmeyle ilk bölümü ekleyin.
            </p>
          )}

          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={() =>
              setSections((current) => [
                ...current,
                { uid: `n${nextUid.current++}`, heading: "", paragraphs: [] },
              ])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            Bölüm ekle
          </button>

          <div className="admin-content-form-actions">
            <span>
              Bu metnin değişiklikleri ayrı kaydedilir. Silinen bölümler kaydettiğinizde
              website&apos;den kalkar.
            </span>
            <AdminSubmitButton>{title} kaydet</AdminSubmitButton>
          </div>
        </form>
      </AdminCard>

      <ConfirmationDialog
        open={removing !== null}
        title="Bölümü sil"
        description="Bu bölüm listeden kaldırılacak. Değişiklik ancak metni kaydettiğinizde website'e yansır."
        confirmLabel="Sil"
        destructive
        onConfirm={() => {
          setSections((current) => current.filter((section) => section.uid !== removing));
          setRemoving(null);
        }}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
