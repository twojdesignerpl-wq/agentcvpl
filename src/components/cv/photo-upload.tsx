"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Camera } from "@phosphor-icons/react/dist/ssr";
import type { PhotoShape } from "@/lib/cv/schema";
import { PhotoCropDialog } from "./photo-crop-dialog";

type Props = {
  photo: string;
  shape: PhotoShape;
  onChange: (dataUrl: string) => void;
  className?: string;
  size?: number;
  alt: string;
};

export function PhotoUpload({ photo, shape, onChange, className, size = 80, alt }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);

  if (shape === "none") return null;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      if (url) setPendingSrc(url);
    };
    reader.readAsDataURL(file);
  };

  const radiusClass = shape === "circle" ? "rounded-full" : "rounded-sm";
  const cropShape: "circle" | "square" = shape === "circle" ? "circle" : "square";

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative shrink-0 overflow-hidden border border-[color:var(--cv-line)] bg-[color:var(--cv-line-soft)] group",
          radiusClass,
          className,
        )}
        style={{ width: size, height: size }}
        aria-label="Zmień zdjęcie"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[color:var(--cv-muted-soft)]">
            <Camera size={size * 0.28} weight="regular" />
          </span>
        )}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100",
            radiusClass,
          )}
        >
          <Camera size={size * 0.3} weight="regular" />
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </button>
      {pendingSrc ? (
        <PhotoCropDialog
          src={pendingSrc}
          shape={cropShape}
          onConfirm={(out) => {
            onChange(out);
            setPendingSrc(null);
          }}
          onCancel={() => setPendingSrc(null)}
        />
      ) : null}
    </>
  );
}
