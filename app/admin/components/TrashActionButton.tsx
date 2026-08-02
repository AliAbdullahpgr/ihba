"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { ConfirmationDialog } from "@/app/admin/components/AdminOverlays";

type Action = (formData: FormData) => void | Promise<void>;

export function TrashActionButton({
  action,
  id,
  label,
  itemName,
  kind,
  state,
  fields = {},
}: {
  action: Action;
  id: string;
  label?: string;
  itemName: string;
  kind: "restore" | "trash" | "permanent";
  state?: string;
  fields?: Record<string, string>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const isPermanent = kind === "permanent";
  const isTrash = kind === "trash";
  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="id" value={id} />
        {state && <input type="hidden" name="state" value={state} />}
        {Object.entries(fields).map(([name, value]) => (
          <input type="hidden" name={name} value={value} key={name} />
        ))}
        <button type="button" className={`admin-table-action ${isPermanent || isTrash ? "admin-table-action-danger" : ""}`} onClick={() => setOpen(true)}>
          {isPermanent || isTrash ? <Trash2 className="size-3.5" aria-hidden="true" /> : <RotateCcw className="size-3.5" aria-hidden="true" />}
          {label ?? (isPermanent ? "Kalıcı sil" : isTrash ? "Çöp kutusuna taşı" : "Geri yükle")}
        </button>
      </form>
      <ConfirmationDialog
        open={open}
        title={isPermanent ? `“${itemName}” kalıcı olarak silinsin mi?` : isTrash ? `“${itemName}” çöp kutusuna taşınsın mı?` : `“${itemName}” geri yüklensin mi?`}
        description={isPermanent ? "Bu işlem içeriği ve ilişkili bilgileri kalıcı olarak siler. Daha sonra geri getirilemez." : isTrash ? "İçerik public website'den kaldırılır, ancak Çöp kutusu ekranından geri yüklenebilir." : "İçerik tekrar yönetim panelinde görünecek. Yayın durumunu geri yükledikten sonra ayrıca kontrol edebilirsiniz."}
        confirmLabel={isPermanent ? "Kalıcı olarak sil" : isTrash ? "Çöp kutusuna taşı" : "Geri yükle"}
        destructive={isPermanent || isTrash}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
