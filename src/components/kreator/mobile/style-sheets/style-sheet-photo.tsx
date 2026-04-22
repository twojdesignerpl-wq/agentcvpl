"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import {
  Circle,
  SquareHalf,
  UserCircleMinus,
  Upload,
  Crop,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import type { PhotoShape } from "@/lib/cv/schema";
import { PhotoCropDialog } from "@/components/cv/photo-crop-dialog";
import { BottomSheet } from "../bottom-sheet";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

const SHAPES: Array<{ id: PhotoShape; label: string; Icon: typeof Circle }> = [
  { id: "circle", label: "Koło", Icon: Circle },
  { id: "square", label: "Kwadrat", Icon: SquareHalf },
  { id: "none", label: "Bez zdjęcia", Icon: UserCircleMinus },
];

export function StyleSheetPhoto({ open, onClose }: Props) {
  const photo = useCVStore((s) => s.cv.personal.photo);
  const photoShape = useCVStore((s) => s.cv.settings.photoShape);
  const setPhoto = useCVStore((s) => s.setPhoto);
  const setPhotoShape = useCVStore((s) => s.setPhotoShape);

  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const cropShape: "circle" | "square" = photoShape === "circle" ? "circle" : "square";

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

  return (
    <>
      <BottomSheet open={open} onClose={onClose} title="Zdjęcie">
        <div className="flex flex-col gap-4 pb-2">
          {/* Preview + shape chooser */}
          <div className="flex items-center gap-3 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-3">
            <div
              className={cn(
                "inline-flex size-20 shrink-0 items-center justify-center overflow-hidden border-2 border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)]",
                photoShape === "circle" ? "rounded-full" : "rounded-xl",
              )}
            >
              {photo ? (
                <Image src={photo} alt="" width={80} height={80} className="size-full object-cover" unoptimized />
              ) : (
                <span className="text-[color:var(--ink-muted)]">
                  <UserCircleMinus size={36} weight="regular" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="mono-label block text-[0.58rem] text-[color:var(--ink-muted)]">
                Kształt
              </span>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {SHAPES.map((opt) => {
                  const Icon = opt.Icon;
                  const active = photoShape === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPhotoShape(opt.id)}
                      aria-pressed={active}
                      className={cn(
                        "tap-target inline-flex flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-medium transition-colors",
                        active
                          ? "border-[color:var(--ink)] bg-ink text-cream"
                          : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]",
                      )}
                    >
                      <Icon size={14} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {photoShape !== "none" ? (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="tap-target inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-[14px] font-semibold text-cream active:scale-[0.98]"
              >
                <Upload size={14} weight="bold" />
                {photo ? "Zmień zdjęcie" : "Prześlij zdjęcie"}
              </button>
              {photo ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingSrc(photo)}
                    className="tap-target inline-flex items-center justify-center gap-2 rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-3 py-2.5 text-[13px] text-ink hover:border-[color:var(--ink)]"
                  >
                    <Crop size={13} /> Wykadruj
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Usunąć zdjęcie z CV?")) setPhoto("");
                    }}
                    className="tap-target inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2.5 text-[13px] text-rose-700 hover:bg-rose-100"
                  >
                    <Trash size={13} /> Usuń
                  </button>
                </div>
              ) : null}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              <p className="text-[12px] leading-snug text-[color:var(--ink-muted)]">
                Po wyborze pliku pojawi się okno kadrowania.
              </p>
            </div>
          ) : (
            <p className="text-[13px] leading-relaxed text-[color:var(--ink-muted)]">
              Zdjęcie nie będzie widoczne w CV. Wybierz <strong>Koło</strong> lub <strong>Kwadrat</strong>, aby je dodać.
            </p>
          )}
        </div>
      </BottomSheet>

      {pendingSrc ? (
        <PhotoCropDialog
          src={pendingSrc}
          shape={cropShape}
          onConfirm={(out) => {
            setPhoto(out);
            setPendingSrc(null);
          }}
          onCancel={() => setPendingSrc(null)}
        />
      ) : null}
    </>
  );
}
