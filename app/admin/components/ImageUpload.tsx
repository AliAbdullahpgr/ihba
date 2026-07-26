"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

export function ImageUpload({
  initialUrl = "",
  initialPublicId = "",
}: {
  initialUrl?: string | null;
  initialPublicId?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [publicId, setPublicId] = useState(initialPublicId ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setPending(true);
    setError("");
    try {
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
      });
      if (!signatureResponse.ok) throw new Error("Could not authorize upload");
      const signed = await signatureResponse.json();
      const form = new FormData();
      form.set("file", file);
      form.set("api_key", signed.apiKey);
      form.set("timestamp", String(signed.timestamp));
      form.set("signature", signed.signature);
      form.set("folder", signed.folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      setUrl(result.secure_url);
      setPublicId(result.public_id);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <input type="hidden" name="imageUrl" value={url} />
      <input type="hidden" name="imagePublicId" value={publicId} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
      />

      {url ? (
        <div className="border border-line bg-white">
          <img
            src={url}
            alt="Selected upload"
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="flex items-center justify-between gap-3 border-t border-line p-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-navy hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
            >
              <ImagePlus className="size-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                setUrl("");
                setPublicId("");
              }}
              className="grid size-10 place-items-center text-ink/55 hover:text-[#a33b32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33b32]"
              aria-label="Remove image from this item"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 border border-dashed border-navy-ink/30 bg-white text-sm font-semibold text-navy hover:border-navy hover:bg-azure-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:cursor-wait"
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImagePlus className="size-5" />
          )}
          {pending ? "Uploading..." : "Upload image"}
        </button>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-[#a33b32]">
          {error}
        </p>
      )}
    </div>
  );
}
