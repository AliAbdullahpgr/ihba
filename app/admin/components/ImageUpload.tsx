"use client";

import { Check, Crop, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ImageUploadProps = {
  initialUrl?: string | null;
  initialPublicId?: string | null;
  cropAspectRatio?: number;
  cropLabel?: string;
  allowRemove?: boolean;
  recommendedDimensions?: string;
  maxSizeMb?: number;
  onValueChange?: (value: { url: string; publicId: string }) => void;
  /**
   * Set false where several uploaders share one form — the hidden inputs are
   * named for a single image, so a second set would collide with the first.
   * Those callers collect the value through `onValueChange` instead.
   */
  emitHiddenFields?: boolean;
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    if (source.startsWith("http")) image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("This image could not be opened for cropping"));
    image.src = source;
  });
}

export function ImageUpload({
  initialUrl = "",
  initialPublicId = "",
  cropAspectRatio = 16 / 9,
  cropLabel = "Crop image",
  allowRemove = true,
  recommendedDimensions = "1600 × 900 px",
  maxSizeMb = 8,
  onValueChange,
  emitHiddenFields = true,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [publicId, setPublicId] = useState(initialPublicId ?? "");
  const [cropSource, setCropSource] = useState("");
  const [cropName, setCropName] = useState("cropped-image.jpg");
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [pending, setPending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function closeCrop() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setCropSource("");
  }

  function openCrop(source: string, name: string) {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = source.startsWith("blob:") ? source : null;
    setCropSource(source);
    setCropName(name || "cropped-image.jpg");
    setZoom(1);
    setPositionX(50);
    setPositionY(50);
    setError("");
    setUploaded(false);
  }

  async function sendUpload(file: File) {
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

    setUploadProgress(0);
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("POST", `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`);
      request.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
      });
      request.addEventListener("load", () => {
        if (request.status >= 200 && request.status < 300) {
          try {
            resolve(JSON.parse(request.responseText) as { secure_url: string; public_id: string });
          } catch {
            reject(new Error("Görsel yanıtı okunamadı."));
          }
        } else {
          reject(new Error("Görsel yüklenemedi. Dosya boyutunu veya türünü kontrol edin."));
        }
      });
      request.addEventListener("error", () => reject(new Error("Görsel yüklenirken bağlantı kesildi.")));
      request.send(form);
    });
    setUrl(result.secure_url);
    setPublicId(result.public_id);
    onValueChange?.({ url: result.secure_url, publicId: result.public_id });
    setUploadProgress(100);
    setUploaded(true);
  }

  async function applyCrop() {
    if (!cropSource) return;
    setPending(true);
    setError("");
    try {
      const image = await loadImage(cropSource);
      const sourceWidth = image.naturalWidth;
      const sourceHeight = image.naturalHeight;
      let cropWidth = sourceWidth;
      let cropHeight = sourceWidth / cropAspectRatio;
      if (cropHeight > sourceHeight) {
        cropHeight = sourceHeight;
        cropWidth = sourceHeight * cropAspectRatio;
      }
      cropWidth /= zoom;
      cropHeight /= zoom;
      const left = (sourceWidth - cropWidth) * (positionX / 100);
      const top = (sourceHeight - cropHeight) * (positionY / 100);
      const outputWidth = 1600;
      const outputHeight = Math.max(1, Math.round(outputWidth / cropAspectRatio));
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not prepare the crop");
      context.drawImage(
        image,
        left,
        top,
        cropWidth,
        cropHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (value) => (value ? resolve(value) : reject(new Error("Could not create the crop"))),
          "image/jpeg",
          0.9
        );
      });
      const baseName = cropName.replace(/\.[^/.]+$/, "") || "cropped-image";
      await sendUpload(new File([blob], `${baseName}-cropped.jpg`, { type: "image/jpeg" }));
      closeCrop();
    } catch (cropError) {
      setError(
        cropError instanceof Error
          ? cropError.message
          : "The photograph could not be cropped"
      );
    } finally {
      setPending(false);
    }
  }

  function chooseFile(file: File) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      setError("JPG, PNG, WebP veya AVIF formatında bir görsel seçin.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Görsel ${maxSizeMb} MB'dan küçük olmalıdır.`);
      return;
    }
    setError("");
    const source = URL.createObjectURL(file);
    openCrop(source, file.name);
  }

  return (
    <div>
      {emitHiddenFields && (
        <>
          <input type="hidden" name="imageUrl" value={url} />
          <input type="hidden" name="imagePublicId" value={publicId} />
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) chooseFile(file);
        }}
      />

      {cropSource ? (
        <div className="border border-navy-ink/20 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-navy-ink">{cropLabel}</p>
              <p className="mt-1 text-xs text-ink/55">
                Odak noktasını seçin, ardından kırpıp yükleyin.
              </p>
            </div>
            <button
              type="button"
              onClick={closeCrop}
              className="grid size-9 place-items-center text-ink/55 hover:text-navy-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
              aria-label="Cancel crop"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div
            className="relative mt-4 max-w-xl overflow-hidden bg-mist"
            style={{ aspectRatio: cropAspectRatio }}
          >
            <img
              src={cropSource}
              alt="Crop preview"
              crossOrigin="anonymous"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: `${positionX}% ${positionY}%`,
                transform: `scale(${zoom})`,
              }}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-semibold text-navy-ink">
              Yakınlaştırma
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-2 block w-full accent-navy"
              />
            </label>
            <label className="text-xs font-semibold text-navy-ink">
              Yatay odak
              <input
                type="range"
                min="0"
                max="100"
                value={positionX}
                onChange={(event) => setPositionX(Number(event.target.value))}
                className="mt-2 block w-full accent-navy"
              />
            </label>
            <label className="text-xs font-semibold text-navy-ink">
              Dikey odak
              <input
                type="range"
                min="0"
                max="100"
                value={positionY}
                onChange={(event) => setPositionY(Number(event.target.value))}
                className="mt-2 block w-full accent-navy"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={applyCrop}
              disabled={pending}
              className="inline-flex min-h-10 items-center gap-2 bg-navy-deep px-3 text-sm font-semibold text-white hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="size-4" aria-hidden="true" />
              )}
              Kırp ve yükle
            </button>
            <button
              type="button"
              onClick={closeCrop}
              disabled={pending}
              className="inline-flex min-h-10 items-center gap-2 border border-navy-ink/20 bg-white px-3 text-sm font-semibold text-navy-ink hover:border-navy-ink/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:opacity-60"
            >
              Vazgeç
            </button>
          </div>
        </div>
      ) : url ? (
        <div className="border border-line bg-white">
          <img
            src={url}
            alt="Selected upload"
            className="w-full object-cover"
            style={{ aspectRatio: cropAspectRatio }}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-navy hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
              >
                <ImagePlus className="size-4" aria-hidden="true" />
                Görseli değiştir
              </button>
              <button
                type="button"
                onClick={() => openCrop(url, "existing-image.jpg")}
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-navy hover:text-azure-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
              >
                <Crop className="size-4" aria-hidden="true" />
                Kırp
              </button>
            </div>
            {allowRemove ? (
              <button
                type="button"
                onClick={() => {
                  closeCrop();
                  setUrl("");
                  setPublicId("");
                  onValueChange?.({ url: "", publicId: "" });
                }}
                className="grid size-10 place-items-center text-ink/55 hover:text-[#a33b32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33b32]"
                aria-label="Bu içerikteki görseli kaldır"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 border border-dashed border-navy-ink/30 bg-white px-4 text-sm font-semibold text-navy hover:border-navy hover:bg-azure-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure disabled:cursor-wait"
          style={{ aspectRatio: cropAspectRatio }}
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-5" aria-hidden="true" />
          )}
          {pending ? "Yükleniyor…" : "Görsel seçin"}
        </button>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/55">
        <span>Önerilen: {recommendedDimensions}</span>
        <span>JPG, PNG, WebP veya AVIF · En fazla {maxSizeMb} MB</span>
      </div>
      {pending && uploadProgress > 0 && (
        <div className="mt-2" role="status" aria-live="polite">
          <div className="h-1.5 overflow-hidden bg-mist">
            <div className="h-full bg-azure transition-[width] duration-150" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="mt-1 text-xs text-ink/55">Görsel yükleniyor: %{uploadProgress}</p>
        </div>
      )}
      {uploaded && !pending && (
        <p className="mt-2 text-xs font-semibold text-[#24613a]" role="status">
          Görsel yüklendi. Değişiklikleri kaydetmeyi unutmayın.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-[#a33b32]">
          {error}
        </p>
      )}
    </div>
  );
}
