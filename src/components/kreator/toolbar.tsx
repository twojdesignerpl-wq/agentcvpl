"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useCVStore } from "@/lib/cv/store";
import {
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  FONT_SIZE_STEP,
  type FontFamilyId,
  type PhotoShape,
  type TemplateId,
} from "@/lib/cv/schema";
import { RODO_OPTIONS } from "@/lib/cv/rodo";
import { PhotoCropDialog } from "@/components/cv/photo-crop-dialog";
import {
  DownloadSimple,
  ArrowCounterClockwise,
  Circle,
  SquareHalf,
  UserCircleMinus,
  Gear,
  Warning,
  Camera,
  Trash,
  Upload,
  Palette,
  Check,
  Crop,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { AnimatedPopover } from "./animated-popover";
import { SectionsPopover } from "./sections-popover";
import { ZoomControl } from "./zoom-control";
import { SaveToAccountButton } from "./save-to-account";
import { MenuSelect, type MenuOption } from "@/components/ui/menu-select";

const FONT_FAMILY_OPTIONS: ReadonlyArray<MenuOption<FontFamilyId>> = [
  { value: "manrope", label: "Manrope", previewStyle: { fontFamily: '"Manrope", sans-serif' } },
  { value: "ibm-plex", label: "IBM Plex Sans", previewStyle: { fontFamily: '"IBM Plex Sans", sans-serif' } },
  { value: "geist", label: "Geist", previewStyle: { fontFamily: '"Geist", sans-serif' } },
  { value: "outfit", label: "Outfit", previewStyle: { fontFamily: '"Outfit", sans-serif' } },
  { value: "source-sans", label: "Source Sans 3", previewStyle: { fontFamily: '"Source Sans 3", sans-serif' } },
  { value: "work-sans", label: "Work Sans", previewStyle: { fontFamily: '"Work Sans", sans-serif' } },
  { value: "nunito-sans", label: "Nunito Sans", previewStyle: { fontFamily: '"Nunito Sans", sans-serif' } },
  { value: "lora", label: "Lora (serif)", previewStyle: { fontFamily: '"Lora", serif' } },
  { value: "merriweather", label: "Merriweather (serif)", previewStyle: { fontFamily: '"Merriweather", serif' } },
  { value: "roboto-slab", label: "Roboto Slab", previewStyle: { fontFamily: '"Roboto Slab", serif' } },
];

type Props = {
  effectiveFontSize: number;
  overflowed: boolean;
  onDownloadPDF: () => Promise<void> | void;
  onDownloadDOCX: () => Promise<void> | void;
  isExporting: boolean;
  zoom: number;
  zoomMode: "auto" | "manual";
  onZoomChange: (next: number) => void;
  onZoomReset: () => void;
};

const PHOTO_SHAPES: Array<{ id: PhotoShape; label: string; Icon: typeof Circle }> = [
  { id: "circle", label: "Koło", Icon: Circle },
  { id: "square", label: "Kwadrat", Icon: SquareHalf },
  { id: "none", label: "Bez zdjęcia", Icon: UserCircleMinus },
];

const TEMPLATES: Array<{ id: TemplateId; label: string; description: string }> = [
  {
    id: "orbit",
    label: "Orbit",
    description: "Minimalistyczny, monochromatyczny. 2 kolumny, klasyczny układ.",
  },
  {
    id: "atlas",
    label: "Atlas",
    description: "Granatowy z niebieskim akcentem. Ikony kontaktu, sekcje full-width.",
  },
  {
    id: "terra",
    label: "Terra",
    description: "Ciepły editorial z serifowym italic. Terakotowy akcent, box z profilem.",
  },
  {
    id: "cobalt",
    label: "Cobalt",
    description: "Granat na cieple cremowym tle. Sidebar z detalami, dekoracyjne kształty w rogach.",
  },
  {
    id: "lumen",
    label: "Lumen",
    description: "Editorial monochrome z centrowanym hero. Etykieta sekcji po lewej, treść po prawej.",
  },
];

const PILL_BASE =
  "group inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-cream-soft px-3 py-1.5 text-[12.5px] font-medium transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]";
const PILL_IDLE =
  "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] hover:border-[color:var(--ink)]";
const PILL_ACTIVE =
  "border-[color:var(--ink)] bg-[color:color-mix(in_oklab,var(--ink)_6%,var(--cream-soft))]";

const Divider = () => (
  <span
    aria-hidden
    className="hidden h-6 w-px shrink-0 bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] lg:block"
  />
);

export function Toolbar({
  effectiveFontSize,
  overflowed,
  onDownloadPDF,
  onDownloadDOCX,
  isExporting,
  zoom,
  zoomMode,
  onZoomChange,
  onZoomReset,
}: Props) {
  const settings = useCVStore((s) => s.cv.settings);
  const templateId = (settings.templateId ?? "orbit") as TemplateId;
  const photo = useCVStore((s) => s.cv.personal.photo);
  const rodo = useCVStore((s) => s.cv.rodo);
  const setTemplate = useCVStore((s) => s.setTemplate);
  const setFontSize = useCVStore((s) => s.setFontSize);
  const setFontFamily = useCVStore((s) => s.setFontFamily);
  const setPhotoShape = useCVStore((s) => s.setPhotoShape);
  const setPhoto = useCVStore((s) => s.setPhoto);
  const setRodoType = useCVStore((s) => s.setRodoType);
  const setRodoCompany = useCVStore((s) => s.setRodoCompany);
  const resetToSample = useCVStore((s) => s.resetToSample);
  const resetToEmpty = useCVStore((s) => s.resetToEmpty);

  const [photoOpen, setPhotoOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [rodoOpen, setRodoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [zoomPresetOpen, setZoomPresetOpen] = useState(false);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const rodoRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anyOpen =
      templateOpen ||
      photoOpen ||
      rodoOpen ||
      settingsOpen ||
      sectionsOpen ||
      zoomPresetOpen ||
      downloadMenuOpen;
    if (!anyOpen) return;

    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (templateOpen && templateRef.current && !templateRef.current.contains(target)) {
        setTemplateOpen(false);
      }
      if (photoOpen && photoRef.current && !photoRef.current.contains(target)) {
        setPhotoOpen(false);
      }
      if (rodoOpen && rodoRef.current && !rodoRef.current.contains(target)) {
        setRodoOpen(false);
      }
      if (settingsOpen && settingsRef.current && !settingsRef.current.contains(target)) {
        setSettingsOpen(false);
      }
      if (sectionsOpen && sectionsRef.current && !sectionsRef.current.contains(target)) {
        setSectionsOpen(false);
      }
      if (zoomPresetOpen && zoomRef.current && !zoomRef.current.contains(target)) {
        setZoomPresetOpen(false);
      }
      if (downloadMenuOpen && downloadRef.current && !downloadRef.current.contains(target)) {
        setDownloadMenuOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTemplateOpen(false);
        setPhotoOpen(false);
        setRodoOpen(false);
        setSettingsOpen(false);
        setSectionsOpen(false);
        setZoomPresetOpen(false);
        setDownloadMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [templateOpen, photoOpen, rodoOpen, settingsOpen, sectionsOpen, zoomPresetOpen, downloadMenuOpen]);

  const autoDownscaled = effectiveFontSize < settings.fontSize;
  const activePhotoShape = PHOTO_SHAPES.find((s) => s.id === settings.photoShape);
  const activeTemplate = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];

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
    <header
      role="banner"
      className="sticky top-0 z-30 border-b border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:color-mix(in_oklab,var(--cream)_92%,transparent)] shadow-[0_1px_0_rgba(10,14,26,0.04)] backdrop-blur-md"
    >
      <div className="mx-auto grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-3">
        {/* Brand — left */}
        <Link
          href="/"
          className="group flex shrink-0 items-baseline gap-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]"
          aria-label="agentcv.pl — wróć do strony głównej"
        >
          <span className="font-display text-[1.25rem] font-bold leading-none tracking-tight text-[color:var(--ink)]">
            agentcv
          </span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[color:var(--saffron)] transition-transform duration-300 group-hover:scale-125"
          />
          <span className="mono-label text-[0.62rem] text-[color:var(--ink)]/50">.pl</span>
          <span className="mono-label ml-3 hidden text-[0.62rem] tracking-[0.14em] text-[color:var(--ink)]/55 sm:inline">
            Kreator CV
          </span>
        </Link>

        {/* Middle — controls */}
        <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-2 [&>*]:shrink-0">
          {/* Font family */}
          <MenuSelect<FontFamilyId>
            value={settings.fontFamily}
            options={FONT_FAMILY_OPTIONS}
            onChange={setFontFamily}
            ariaLabel="Czcionka CV"
            menuWidth={200}
            triggerClassName={cn(PILL_BASE, PILL_IDLE, "w-[170px]")}
            renderTrigger={(opt) => (
              <span className="inline-flex items-center gap-1.5 truncate">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
                  Aa
                </span>
                <span style={opt?.previewStyle} className="truncate font-medium">
                  {opt?.label ?? "Czcionka"}
                </span>
              </span>
            )}
          />

          {/* Font size */}
          <div className="relative">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border bg-cream-soft px-3 py-1.5 text-[12.5px] transition-colors",
                autoDownscaled
                  ? "border-[color:color-mix(in_oklab,var(--saffron)_65%,transparent)]"
                  : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)]",
              )}
            >
              <span className="shrink-0 text-[color:var(--ink-muted)]">Rozmiar</span>
              <input
                type="range"
                min={FONT_SIZE_MIN}
                max={FONT_SIZE_MAX}
                step={FONT_SIZE_STEP}
                value={settings.fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                className="w-20 cursor-pointer accent-[var(--saffron)]"
                aria-label="Rozmiar czcionki w CV"
              />
              <span className="w-[46px] text-right font-semibold tabular-nums">
                {settings.fontSize.toFixed(2).replace(/\.00$/, "")}pt
              </span>
            </div>
            {autoDownscaled || overflowed ? (
              <div
                className="absolute top-full left-1/2 z-20 mt-1.5 flex -translate-x-1/2 items-center gap-1.5 animate-in fade-in-0 slide-in-from-top-1 duration-200 ease-out"
                style={{ willChange: "transform, opacity" }}
              >
                {autoDownscaled ? (
                  <span
                    title={`Auto-dopasowanie: ${effectiveFontSize.toFixed(2).replace(/\.00$/, "")}pt`}
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[color:var(--saffron)]/20 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--ink)] shadow-sm"
                  >
                    Auto {effectiveFontSize.toFixed(2).replace(/\.00$/, "")}pt
                  </span>
                ) : null}
                {overflowed ? (
                  <span
                    title="Treść wykracza poza 1 stronę A4 nawet przy 8pt — skróć opisy lub usuń pozycje."
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 shadow-sm"
                  >
                    <Warning size={10} weight="fill" /> Przepełnienie
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Zoom */}
          <ZoomControl
            containerRef={zoomRef}
            zoom={zoom}
            mode={zoomMode}
            presetOpen={zoomPresetOpen}
            onPresetOpenChange={setZoomPresetOpen}
            onZoomChange={onZoomChange}
            onReset={onZoomReset}
          />

          <Divider />

          {/* Template */}
          <div ref={templateRef} className="relative">
            <button
              type="button"
              onClick={() => setTemplateOpen((v) => !v)}
              className={cn(PILL_BASE, templateOpen ? PILL_ACTIVE : PILL_IDLE)}
              aria-haspopup="dialog"
              aria-expanded={templateOpen}
            >
              <Palette size={14} weight="regular" /> Szablon · {activeTemplate.label}
            </button>
            <AnimatedPopover
              open={templateOpen}
              align="center"
              aria-label="Wybór szablonu"
              className="w-[340px] rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card p-2 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
            >
              <h4 className="px-2 pb-2 pt-1 text-[13px] font-semibold">Szablon CV</h4>
              <div className="flex flex-col gap-1">
                {TEMPLATES.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTemplate(opt.id);
                      setTemplateOpen(false);
                    }}
                    className={cn(
                      "group/tpl flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.99]",
                      opt.id === templateId
                        ? "border-[color:var(--ink)] bg-cream-deep"
                        : "border-transparent hover:bg-cream-deep",
                    )}
                  >
                    <TemplateThumb id={opt.id} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold">{opt.label}</span>
                        {opt.id === templateId ? (
                          <Check
                            size={12}
                            weight="bold"
                            className="text-[color:var(--saffron)]"
                          />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-snug text-[color:var(--ink-muted)]">
                        {opt.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </AnimatedPopover>
          </div>

          {/* Photo */}
          <div ref={photoRef} className="relative">
            <button
              type="button"
              onClick={() => setPhotoOpen((v) => !v)}
              className={cn(PILL_BASE, photoOpen ? PILL_ACTIVE : PILL_IDLE)}
              aria-haspopup="dialog"
              aria-expanded={photoOpen}
            >
              <Camera size={14} weight="regular" /> Zdjęcie
            </button>
            <AnimatedPopover
              open={photoOpen}
              align="center"
              aria-label="Ustawienia zdjęcia"
              className="w-[280px] rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card p-3 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
            >
              <h4 className="mb-2 text-[13px] font-semibold">Kształt</h4>
              <div className="mb-3 flex gap-1.5">
                {PHOTO_SHAPES.map((opt) => {
                  const Icon = opt.Icon;
                  const active = settings.photoShape === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPhotoShape(opt.id)}
                      className={cn(
                        "inline-flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg border p-2 text-[11px] font-medium transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98]",
                        active
                          ? "border-[color:var(--ink)] bg-ink text-cream"
                          : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] hover:border-[color:var(--ink)]",
                      )}
                    >
                      <Icon size={16} /> {opt.label}
                    </button>
                  );
                })}
              </div>

              {settings.photoShape !== "none" ? (
                <>
                  <h4 className="mb-2 text-[13px] font-semibold">Plik</h4>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[12px] font-medium text-cream transition-transform duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
                    >
                      <Upload size={12} weight="bold" />
                      {photo ? "Zmień zdjęcie" : "Prześlij zdjęcie"}
                    </button>
                    {photo ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPendingSrc(photo);
                            setPhotoOpen(false);
                          }}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-cream-soft px-3 py-2 text-[12px] text-ink transition-[border-color,transform] duration-150 ease-out hover:border-[color:var(--ink)] active:scale-[0.98]"
                        >
                          <Crop size={12} /> Wykadruj ponownie
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Usunąć zdjęcie z CV?")) setPhoto("");
                          }}
                          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-[12px] text-rose-700 transition-[background-color,transform] duration-150 ease-out hover:bg-rose-100 active:scale-[0.98]"
                        >
                          <Trash size={12} /> Usuń zdjęcie
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
                  <p className="mt-2 text-[11px] text-ink-muted">
                    Po wyborze pliku pojawi się okno kadrowania w formacie{" "}
                    {activePhotoShape?.label ?? ""}.
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-ink-muted">
                  Wybierz kształt Koło lub Kwadrat, aby wgrać zdjęcie.
                </p>
              )}
            </AnimatedPopover>
          </div>

          <Divider />

          {/* Sections — all section toggles */}
          <SectionsPopover
            containerRef={sectionsRef}
            open={sectionsOpen}
            onOpenChange={setSectionsOpen}
          />

          <Divider />

          {/* RODO */}
          <div ref={rodoRef} className="relative">
            <button
              type="button"
              onClick={() => setRodoOpen((v) => !v)}
              className={cn(PILL_BASE, rodoOpen ? PILL_ACTIVE : PILL_IDLE)}
              aria-haspopup="dialog"
              aria-expanded={rodoOpen}
            >
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span
                  aria-hidden
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full transition-colors",
                    rodo.type === "none"
                      ? "bg-[color:color-mix(in_oklab,var(--ink)_18%,transparent)]"
                      : "bg-[color:var(--saffron)]",
                  )}
                />
                RODO · {RODO_OPTIONS.find((o) => o.value === rodo.type)?.pillLabel ?? "—"}
              </span>
            </button>
            <AnimatedPopover
              open={rodoOpen}
              align="center"
              aria-label="Klauzula RODO"
              className="w-[300px] rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card p-3 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
            >
              <h4 className="mb-2 text-[13px] font-semibold">Klauzula RODO</h4>
              <div className="mb-3 flex flex-col gap-1">
                {RODO_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-start gap-2 rounded-lg border border-transparent p-2 text-[12px] transition-colors duration-150 ease-out hover:bg-cream-deep"
                  >
                    <input
                      type="radio"
                      name="rodo-type"
                      value={opt.value}
                      checked={rodo.type === opt.value}
                      onChange={() => setRodoType(opt.value)}
                      className="mt-0.5 accent-[var(--saffron)]"
                    />
                    <span className="flex-1">
                      <span className="block font-semibold">{opt.label}</span>
                      <span className="block text-[11px] text-[color:var(--ink-muted)]">
                        {opt.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {rodo.type === "future" || rodo.type === "both" ? (
                <label className="block text-[12px]">
                  <span className="mb-1 block text-[color:var(--ink-muted)]">
                    Nazwa pracodawcy (opcjonalnie)
                  </span>
                  <input
                    type="text"
                    value={rodo.companyName}
                    onChange={(e) => setRodoCompany(e.target.value)}
                    placeholder="np. Firma X Sp. z o.o."
                    className="w-full rounded-md border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-cream-soft px-2 py-1.5 outline-none focus:border-[color:var(--ink)]"
                  />
                </label>
              ) : null}
              <button
                type="button"
                onClick={() => setRodoOpen(false)}
                className="mt-3 w-full cursor-pointer rounded-lg bg-ink py-2 text-[12px] font-medium text-cream transition-transform duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
              >
                Gotowe
              </button>
            </AnimatedPopover>
          </div>
        </div>

        {/* Right — gear + download */}
        <div className="flex shrink-0 items-center gap-2">
          <SaveToAccountButton effectiveFontSize={effectiveFontSize} compact />

          <div ref={settingsRef} className="relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              className={cn(
                "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-cream-soft transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]",
                settingsOpen ? PILL_ACTIVE : PILL_IDLE,
              )}
              aria-label="Więcej ustawień"
              aria-expanded={settingsOpen}
            >
              <Gear size={15} />
            </button>
            <AnimatedPopover
              open={settingsOpen}
              align="end"
              aria-label="Ustawienia"
              className="w-[260px] rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card p-3 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
            >
              <h4 className="mb-2 text-[13px] font-semibold">Reset</h4>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Wczytać przykładowe CV? Obecne dane zostaną nadpisane.")) {
                      resetToSample();
                      setSettingsOpen(false);
                    }
                  }}
                  className="flex-1 cursor-pointer rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] px-2 py-2 text-[12px] transition-[border-color,transform] duration-150 ease-out hover:border-[color:var(--ink)] active:scale-[0.98]"
                >
                  Przykład
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Wyczyścić CV? Tej operacji nie można cofnąć.")) {
                      resetToEmpty();
                      setSettingsOpen(false);
                    }
                  }}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-2 py-2 text-[12px] text-rose-700 transition-[background-color,transform] duration-150 ease-out hover:bg-rose-100 active:scale-[0.98]"
                >
                  <ArrowCounterClockwise size={12} /> Wyczyść
                </button>
              </div>
            </AnimatedPopover>
          </div>

          <div ref={downloadRef} className="relative inline-flex">
            <button
              type="button"
              onClick={onDownloadPDF}
              disabled={isExporting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-l-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-cream shadow-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]"
            >
              <DownloadSimple size={14} weight="bold" />
              {isExporting ? "Generuję…" : "Pobierz PDF"}
            </button>
            <button
              type="button"
              onClick={() => setDownloadMenuOpen((v) => !v)}
              disabled={isExporting}
              aria-label="Więcej formatów eksportu"
              aria-haspopup="menu"
              aria-expanded={downloadMenuOpen}
              className="inline-flex cursor-pointer items-center rounded-r-full border-l border-[color:color-mix(in_oklab,var(--cream)_30%,transparent)] bg-ink px-2.5 py-2.5 text-cream shadow-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]"
            >
              <Check size={12} weight="bold" className="hidden" />
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <AnimatedPopover
              open={downloadMenuOpen}
              align="end"
              aria-label="Formaty eksportu"
              className="w-[260px] overflow-hidden rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card p-1 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
            >
              <button
                type="button"
                onClick={() => {
                  setDownloadMenuOpen(false);
                  void onDownloadPDF();
                }}
                className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[12.5px] transition-colors duration-150 ease-out hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]"
              >
                <div className="flex items-center gap-2 font-semibold text-[color:var(--ink)]">
                  <DownloadSimple size={12} weight="bold" />
                  PDF (wizualny)
                </div>
                <p className="mt-0.5 text-[11px] text-[color:var(--ink-muted)]">
                  Pełny wygląd szablonu, 1:1 jak w podglądzie
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDownloadMenuOpen(false);
                  void onDownloadDOCX();
                }}
                className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[12.5px] transition-colors duration-150 ease-out hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]"
              >
                <div className="flex items-center gap-2 font-semibold text-[color:var(--ink)]">
                  <DownloadSimple size={12} weight="bold" />
                  DOCX (ATS-friendly)
                </div>
                <p className="mt-0.5 text-[11px] text-[color:var(--ink-muted)]">
                  Word, uproszczony layout — pod systemy rekrutacyjne
                </p>
              </button>
            </AnimatedPopover>
          </div>
        </div>
      </div>

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

    </header>
  );
}

function TemplateThumb({ id }: { id: TemplateId }) {
  if (id === "orbit") {
    return (
      <svg
        viewBox="0 0 48 64"
        width={48}
        height={64}
        className="shrink-0 rounded border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white"
      >
        <circle cx="8" cy="8" r="3.5" fill="#e5e7eb" />
        <rect x="14" y="6" width="16" height="2" rx="1" fill="#1a1a1a" />
        <rect x="14" y="9" width="12" height="1.4" rx="0.7" fill="#9ca3af" />
        <rect x="32" y="6" width="12" height="1" rx="0.5" fill="#9ca3af" />
        <rect x="32" y="8" width="12" height="1" rx="0.5" fill="#9ca3af" />
        <line x1="4" y1="14" x2="44" y2="14" stroke="#d9d9d9" strokeWidth="0.5" />
        <rect x="4" y="17" width="6" height="1.2" rx="0.5" fill="#1a1a1a" />
        <rect x="4" y="20" width="14" height="0.8" rx="0.4" fill="#9ca3af" />
        <rect x="4" y="22" width="14" height="0.8" rx="0.4" fill="#9ca3af" />
        <rect x="4" y="24" width="10" height="0.8" rx="0.4" fill="#9ca3af" />
        <rect x="22" y="17" width="6" height="1.2" rx="0.5" fill="#1a1a1a" />
        <rect x="22" y="20" width="20" height="0.8" rx="0.4" fill="#9ca3af" />
        <rect x="22" y="22" width="20" height="0.8" rx="0.4" fill="#9ca3af" />
        <rect x="22" y="24" width="16" height="0.8" rx="0.4" fill="#9ca3af" />
        <rect x="22" y="27" width="20" height="0.8" rx="0.4" fill="#9ca3af" />
      </svg>
    );
  }
  if (id === "terra") {
    return (
      <svg
        viewBox="0 0 48 64"
        width={48}
        height={64}
        className="shrink-0 rounded border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[#faf5ee]"
      >
        <circle cx="8" cy="8" r="3.5" fill="#ecdcc8" />
        <rect x="14" y="5.5" width="18" height="2.4" rx="0.6" fill="#2a231d" />
        <rect x="14" y="9.5" width="12" height="1" rx="0.4" fill="#b85a3e" />
        <line x1="4" y1="14" x2="44" y2="14" stroke="#dfd4c2" strokeWidth="0.4" />
        <g fill="#b85a3e">
          <circle cx="5.5" cy="16.6" r="0.5" />
          <circle cx="15" cy="16.6" r="0.5" />
          <circle cx="25" cy="16.6" r="0.5" />
          <circle cx="35" cy="16.6" r="0.5" />
        </g>
        <rect x="7" y="16.2" width="6" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="16.5" y="16.2" width="7" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="26.5" y="16.2" width="7" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="36.5" y="16.2" width="7" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="4" y="20" width="40" height="6" rx="1" fill="#ecdcc8" />
        <rect x="6" y="22" width="36" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="6" y="24" width="30" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="4" y="29" width="7" height="0.9" rx="0.4" fill="#b85a3e" />
        <rect x="4" y="31.5" width="14" height="1.2" rx="0.4" fill="#2a231d" />
        <rect x="30" y="31.5" width="14" height="1" rx="0.4" fill="#6f6357" />
        <g fill="#2a231d">
          <circle cx="5" cy="34.5" r="0.5" />
          <circle cx="5" cy="36.5" r="0.5" />
          <circle cx="5" cy="38.5" r="0.5" />
        </g>
        <rect x="7" y="34.1" width="20" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="7" y="36.1" width="22" height="0.8" rx="0.4" fill="#6f6357" />
        <rect x="7" y="38.1" width="18" height="0.8" rx="0.4" fill="#6f6357" />
        <line x1="4" y1="41.5" x2="44" y2="41.5" stroke="#dfd4c2" strokeWidth="0.4" />
        <rect x="4" y="44" width="6" height="0.9" rx="0.4" fill="#b85a3e" />
        <rect x="4" y="46.5" width="12" height="1.1" rx="0.4" fill="#2a231d" />
        <rect x="4" y="48.5" width="20" height="0.7" rx="0.3" fill="#6f6357" />
        <rect x="4" y="50.2" width="18" height="0.7" rx="0.3" fill="#6f6357" />
        <rect x="26" y="44" width="6" height="0.9" rx="0.4" fill="#b85a3e" />
        <rect x="26" y="46.5" width="14" height="1.1" rx="0.4" fill="#2a231d" />
        <rect x="26" y="48.5" width="18" height="0.7" rx="0.3" fill="#6f6357" />
        <rect x="26" y="50.2" width="14" height="0.7" rx="0.3" fill="#6f6357" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 48 64"
      width={48}
      height={64}
      className="shrink-0 rounded border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white"
    >
      <rect x="4" y="4" width="10" height="10" rx="1.2" fill="#dbeafe" stroke="#2563eb" strokeWidth="0.4" />
      <rect x="16" y="4" width="10" height="1.2" rx="0.4" fill="#2563eb" />
      <rect x="16" y="6.5" width="18" height="2.2" rx="0.6" fill="#1a2332" />
      <g fill="#2563eb">
        <circle cx="17" cy="11" r="0.8" />
        <rect x="19" y="10.5" width="15" height="1" rx="0.4" fill="#6b7280" />
        <circle cx="17" cy="13.2" r="0.8" />
        <rect x="19" y="12.7" width="15" height="1" rx="0.4" fill="#6b7280" />
      </g>
      <rect x="4" y="20" width="6" height="1.2" rx="0.5" fill="#1a2332" />
      <rect x="4" y="23" width="14" height="0.8" rx="0.4" fill="#9ca3af" />
      <rect x="4" y="25" width="14" height="0.8" rx="0.4" fill="#9ca3af" />
      <g transform="translate(20 20)">
        <rect width="6" height="1.2" rx="0.5" fill="#1a2332" />
        <circle cx="0.6" cy="4" r="0.4" fill="none" stroke="#2563eb" strokeWidth="0.4" />
        <rect x="1.5" y="3.6" width="10" height="0.8" rx="0.4" fill="#6b7280" />
        <circle cx="0.6" cy="6" r="0.4" fill="none" stroke="#2563eb" strokeWidth="0.4" />
        <rect x="1.5" y="5.6" width="10" height="0.8" rx="0.4" fill="#6b7280" />
      </g>
      <line x1="4" y1="33" x2="44" y2="33" stroke="#e5e7eb" strokeWidth="0.4" />
      <rect x="4" y="36" width="6" height="1" rx="0.5" fill="#1a2332" />
      <rect x="4" y="40" width="5" height="0.8" rx="0.4" fill="#2563eb" />
      <rect x="12" y="40" width="18" height="0.8" rx="0.4" fill="#1a2332" />
      <rect x="36" y="40" width="8" height="0.8" rx="0.4" fill="#9ca3af" />
      <rect x="4" y="44" width="5" height="0.8" rx="0.4" fill="#2563eb" />
      <rect x="12" y="44" width="18" height="0.8" rx="0.4" fill="#1a2332" />
      <rect x="36" y="44" width="8" height="0.8" rx="0.4" fill="#9ca3af" />
      <line x1="4" y1="50" x2="44" y2="50" stroke="#e5e7eb" strokeWidth="0.4" />
      <rect x="4" y="53" width="8" height="1" rx="0.5" fill="#1a2332" />
      <rect x="4" y="57" width="5" height="0.8" rx="0.4" fill="#2563eb" />
      <rect x="12" y="57" width="20" height="0.8" rx="0.4" fill="#1a2332" />
      <rect x="36" y="57" width="8" height="0.8" rx="0.4" fill="#9ca3af" />
    </svg>
  );
}
