"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmationDialog } from "@/app/admin/components/AdminOverlays";
import { FormField, inputClass } from "@/app/admin/components/AdminUi";
import { ImageUpload } from "@/app/admin/components/ImageUpload";

export type AdminProjectImage = {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  captionTr: string;
  captionEn: string;
  altTr: string;
  altEn: string;
};

/**
 * Extra photographs for one project, held as a client draft and submitted with
 * the rest of the form as JSON — the same shape the slider manager uses, so
 * reordering and removing rows costs nothing until the operator saves.
 *
 * `ImageUpload` writes to fixed hidden field names that the cover image
 * already owns, so these rows suppress them and mirror the uploaded value into
 * this component's state instead.
 */
export function ProjectGalleryManager({
  initialImages,
}: {
  initialImages: AdminProjectImage[];
}) {
  const [draft, setDraft] = useState<AdminProjectImage[]>(initialImages);
  const [removing, setRemoving] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const update = (index: number, patch: Partial<AdminProjectImage>) => {
    setDraft((current) =>
      current.map((image, position) =>
        position === index ? { ...image, ...patch } : image
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
    <section className="border border-line bg-white p-5 sm:p-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-base font-semibold text-navy-ink">
          Proje fotoğrafları
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/60">
          Proje sayfasında kapak görselinin altında gösterilir. Sıralamayı
          sürükleyerek değiştirebilirsiniz. Fotoğraf eklemek zorunlu değildir.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {draft.map((image, index) => (
          <div
            key={image.id || `new-${index}`}
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
              <span className="text-xs font-semibold text-ink/60">
                Fotoğraf {index + 1}
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
              <button
                type="button"
                className="admin-button admin-button-danger"
                onClick={() => setRemoving(index)}
                aria-label="Fotoğrafı kaldır"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <ImageUpload
                // The cover image owns the shared `imageUrl` field names, so
                // these rows report their value upward instead.
                emitHiddenFields={false}
                initialUrl={image.imageUrl}
                initialPublicId={image.imagePublicId}
                onValueChange={(next) =>
                  update(index, {
                    imageUrl: next.url,
                    imagePublicId: next.publicId,
                  })
                }
              />
              <div className="admin-settings-grid">
                <FormField label="Açıklama (Türkçe)">
                  <input
                    value={image.captionTr}
                    onChange={(event) => update(index, { captionTr: event.target.value })}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Açıklama (İngilizce)">
                  <input
                    value={image.captionEn}
                    onChange={(event) => update(index, { captionEn: event.target.value })}
                    className={inputClass}
                  />
                </FormField>
                <FormField
                  label="Alternatif metin (Türkçe)"
                  hint="Görmeyen ziyaretçiler için fotoğrafı tarif edin."
                >
                  <input
                    value={image.altTr}
                    onChange={(event) => update(index, { altTr: event.target.value })}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Alternatif metin (İngilizce)">
                  <input
                    value={image.altEn}
                    onChange={(event) => update(index, { altEn: event.target.value })}
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="admin-button admin-button-secondary mt-4"
        onClick={() =>
          setDraft((current) => [
            ...current,
            {
              id: "",
              imageUrl: "",
              imagePublicId: "",
              captionTr: "",
              captionEn: "",
              altTr: "",
              altEn: "",
            },
          ])
        }
      >
        <Plus className="size-4" aria-hidden="true" />
        Fotoğraf ekle
      </button>

      {/* Rows without an uploaded image are dropped rather than saved empty. */}
      <input
        type="hidden"
        name="galleryImages"
        value={JSON.stringify(draft.filter((image) => image.imageUrl))}
      />

      <ConfirmationDialog
        open={removing !== null}
        title="Fotoğrafı kaldır"
        description="Bu fotoğraf projeden kaldırılacak. Değişiklik ancak projeyi kaydettiğinizde geçerli olur."
        confirmLabel="Kaldır"
        destructive
        onConfirm={() => {
          setDraft((current) => current.filter((_, index) => index !== removing));
          setRemoving(null);
        }}
        onClose={() => setRemoving(null)}
      />
    </section>
  );
}
