"use client";

import { useRef, type ChangeEvent } from "react";
import Image from "next/image";
import {
  Circle,
  SquareHalf,
  UserCircleMinus,
  Upload,
  Crop,
  Trash,
  TextAa,
  Palette,
  ArrowsOutSimple,
  ArrowsInSimple,
} from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import {
  FONT_FAMILY_LABELS,
  FONT_FAMILY_STACKS,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_STEP,
  type FontFamilyId,
  type PhotoShape,
  type TemplateId,
} from "@/lib/cv/schema";
import { RODO_OPTIONS } from "@/lib/cv/rodo";
import { PhotoCropDialog } from "@/components/cv/photo-crop-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FONT_IDS: FontFamilyId[] = [
  "manrope",
  "ibm-plex",
  "geist",
  "outfit",
  "source-sans",
  "work-sans",
  "nunito-sans",
  "lora",
  "merriweather",
  "roboto-slab",
];

const TEMPLATES: Array<{ id: TemplateId; label: string; description: string; color: string }> = [
  { id: "orbit", label: "Orbit", description: "Minimal monochrom, 2-kolumnowy", color: "#0f1115" },
  { id: "atlas", label: "Atlas", description: "Granat + niebieski akcent", color: "#2563eb" },
  { id: "terra", label: "Terra", description: "Editorial + terrakotowy akcent", color: "#b85a3e" },
  { id: "cobalt", label: "Cobalt", description: "Granat na kremie, dekoracje", color: "#1f3a5f" },
  { id: "lumen", label: "Lumen", description: "Editorial, centrowany hero", color: "#0a0c10" },
];

const PHOTO_SHAPES: Array<{ id: PhotoShape; label: string; Icon: typeof Circle }> = [
  { id: "circle", label: "Koło", Icon: Circle },
  { id: "square", label: "Kwadrat", Icon: SquareHalf },
  { id: "none", label: "Bez", Icon: UserCircleMinus },
];

export function MobileTabStyle() {
  const settings = useCVStore((s) => s.cv.settings);
  const photo = useCVStore((s) => s.cv.personal.photo);
  const rodo = useCVStore((s) => s.cv.rodo);

  const setFontFamily = useCVStore((s) => s.setFontFamily);
  const setFontSize = useCVStore((s) => s.setFontSize);
  const setTemplate = useCVStore((s) => s.setTemplate);
  const setPhotoShape = useCVStore((s) => s.setPhotoShape);
  const setPhoto = useCVStore((s) => s.setPhoto);
  const setRodoType = useCVStore((s) => s.setRodoType);
  const setRodoCompany = useCVStore((s) => s.setRodoCompany);

  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);

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

  const cropShape: "circle" | "square" = settings.photoShape === "circle" ? "circle" : "square";

  return (
    <div className="space-y-5 px-4 pb-24 pt-3">
      <div className="flex items-baseline justify-between px-1 pb-1">
        <h1 className="font-display text-[1.35rem] font-semibold tracking-tight text-ink">Styl</h1>
        <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
          Szablon · Font · Zdjęcie
        </span>
      </div>

      {/* Template carousel */}
      <section className="space-y-2">
        <header className="flex items-center gap-2 px-1">
          <Palette size={14} className="text-[color:var(--ink-muted)]" />
          <h2 className="mono-label text-[0.64rem] text-[color:var(--ink-muted)]">Szablon</h2>
        </header>
        <div className="hide-scrollbar snap-x-mandatory -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {TEMPLATES.map((t) => {
            const active = settings.templateId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                aria-pressed={active}
                className={cn(
                  "snap-center flex w-[168px] shrink-0 flex-col gap-2 rounded-2xl border p-3 text-left transition-all",
                  active
                    ? "border-[color:var(--ink)] bg-white shadow-[0_8px_24px_-12px_rgba(10,14,26,0.25)]"
                    : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)]",
                )}
              >
                <div
                  className="aspect-[210/297] w-full overflow-hidden rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]"
                  style={{ background: t.id === "terra" ? "#faf5ee" : t.id === "cobalt" ? "#faf6ec" : "#ffffff" }}
                  aria-hidden
                >
                  <div className="flex h-full w-full flex-col gap-1 p-2">
                    <div
                      className="h-2 w-[60%] rounded"
                      style={{ background: t.color }}
                    />
                    <div className="h-1 w-[80%] rounded bg-black/20" />
                    <div className="mt-2 h-[0.5px] w-full bg-black/10" />
                    <div className="mt-1 h-1.5 w-[40%] rounded bg-black/40" />
                    <div className="h-1 w-[90%] rounded bg-black/15" />
                    <div className="h-1 w-[85%] rounded bg-black/15" />
                    <div className="mt-2 h-1.5 w-[35%] rounded bg-black/40" />
                    <div className="h-1 w-[88%] rounded bg-black/15" />
                    <div className="h-1 w-[80%] rounded bg-black/15" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="inline-block size-2 rounded-full"
                      style={{ background: t.color }}
                    />
                    <span className="font-display text-[14px] font-semibold tracking-tight text-ink">
                      {t.label}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[11.5px] leading-snug text-[color:var(--ink-muted)]">
                    {t.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Font family */}
      <section className="space-y-2">
        <header className="flex items-center gap-2 px-1">
          <TextAa size={14} className="text-[color:var(--ink-muted)]" />
          <h2 className="mono-label text-[0.64rem] text-[color:var(--ink-muted)]">Czcionka</h2>
        </header>
        <div className="hide-scrollbar snap-x-mandatory -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FONT_IDS.map((id) => {
            const active = settings.fontFamily === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFontFamily(id)}
                aria-pressed={active}
                className={cn(
                  "snap-start tap-target shrink-0 rounded-full border px-4 py-2 text-[14.5px] font-medium transition-colors",
                  active
                    ? "border-[color:var(--ink)] bg-ink text-cream"
                    : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] text-ink hover:border-[color:var(--ink)]",
                )}
                style={{ fontFamily: FONT_FAMILY_STACKS[id] }}
              >
                {FONT_FAMILY_LABELS[id]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Font size */}
      <section className="space-y-2 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="mono-label text-[0.64rem] text-[color:var(--ink-muted)]">
            Wielkość czcionki
          </h2>
          <span className="font-display text-[18px] font-semibold tabular-nums text-ink">
            {settings.fontSize.toFixed(2).replace(/\.00$/, "")}pt
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFontSize(settings.fontSize - FONT_SIZE_STEP)}
            aria-label="Zmniejsz czcionkę"
            className="tap-target inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]"
          >
            <ArrowsInSimple size={14} weight="bold" />
          </button>
          <input
            type="range"
            min={FONT_SIZE_MIN}
            max={FONT_SIZE_MAX}
            step={FONT_SIZE_STEP}
            value={settings.fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="flex-1 cursor-pointer accent-[var(--saffron)]"
            aria-label="Rozmiar czcionki w punktach"
          />
          <button
            type="button"
            onClick={() => setFontSize(settings.fontSize + FONT_SIZE_STEP)}
            aria-label="Zwiększ czcionkę"
            className="tap-target inline-flex items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]"
          >
            <ArrowsOutSimple size={14} weight="bold" />
          </button>
        </div>
        <p className="text-[11.5px] text-[color:var(--ink-muted)]">
          Pracuś automatycznie skaluje do 1 strony A4 — nie musisz zgadywać.
        </p>
      </section>

      {/* Photo */}
      <section className="space-y-3 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-4">
        <header className="flex items-center justify-between">
          <h2 className="mono-label text-[0.64rem] text-[color:var(--ink-muted)]">Zdjęcie</h2>
          {photo ? (
            <span
              aria-hidden
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:color-mix(in_oklab,var(--jade)_16%,transparent)] px-2 py-0.5 text-[10.5px] font-semibold text-[color:var(--jade)]"
            >
              • dodane
            </span>
          ) : null}
        </header>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "inline-flex size-16 shrink-0 items-center justify-center overflow-hidden border-2 border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)]",
              settings.photoShape === "circle" ? "rounded-full" : "rounded-xl",
            )}
          >
            {photo ? (
              <Image
                src={photo}
                alt=""
                width={64}
                height={64}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-[color:var(--ink-muted)]">
                <UserCircleMinus size={28} weight="regular" />
              </span>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {PHOTO_SHAPES.map((opt) => {
              const Icon = opt.Icon;
              const active = settings.photoShape === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPhotoShape(opt.id)}
                  aria-pressed={active}
                  className={cn(
                    "tap-target inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                    active
                      ? "border-[color:var(--ink)] bg-ink text-cream"
                      : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]",
                  )}
                >
                  <Icon size={12} /> {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        {settings.photoShape !== "none" ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="tap-target inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-2.5 text-[13px] font-semibold text-cream hover:opacity-90"
            >
              <Upload size={12} weight="bold" />
              {photo ? "Zmień" : "Prześlij"}
            </button>
            {photo ? (
              <>
                <button
                  type="button"
                  onClick={() => setPendingSrc(photo)}
                  className="tap-target inline-flex items-center gap-1.5 rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-3 py-2.5 text-[13px] text-ink hover:border-[color:var(--ink)]"
                >
                  <Crop size={12} /> Kadruj
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Usunąć zdjęcie?")) setPhoto("");
                  }}
                  className="tap-target inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2.5 text-[13px] text-rose-700 hover:bg-rose-100"
                >
                  <Trash size={12} />
                </button>
              </>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>
        ) : null}
      </section>

      {/* RODO */}
      <section className="space-y-3 rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-4">
        <header className="flex items-center justify-between">
          <h2 className="mono-label text-[0.64rem] text-[color:var(--ink-muted)]">
            Klauzula RODO
          </h2>
          <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
            {RODO_OPTIONS.find((o) => o.value === rodo.type)?.pillLabel ?? "—"}
          </span>
        </header>
        <div className="grid grid-cols-2 gap-1.5">
          {RODO_OPTIONS.map((opt) => {
            const active = rodo.type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRodoType(opt.value)}
                aria-pressed={active}
                className={cn(
                  "tap-target rounded-xl border px-3 py-2 text-left text-[12.5px] font-semibold transition-colors",
                  active
                    ? "border-[color:var(--ink)] bg-ink text-cream"
                    : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {rodo.type === "future" || rodo.type === "both" ? (
          <label className="block text-[13px]">
            <span className="mono-label mb-1.5 block text-[0.58rem] text-[color:var(--ink-muted)]">
              Nazwa pracodawcy (opcjonalnie)
            </span>
            <input
              type="text"
              value={rodo.companyName}
              onChange={(e) => setRodoCompany(e.target.value)}
              placeholder="np. Firma X Sp. z o.o."
              className="w-full min-h-[44px] rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[color:var(--ink)]"
            />
          </label>
        ) : null}
        <p className="text-[11.5px] leading-snug text-[color:var(--ink-muted)]">
          {RODO_OPTIONS.find((o) => o.value === rodo.type)?.hint ?? ""}
        </p>
      </section>

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
    </div>
  );
}
