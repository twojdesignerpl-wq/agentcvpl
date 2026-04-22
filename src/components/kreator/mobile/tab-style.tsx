"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Palette,
  TextAa,
  TextT,
  Camera,
  ShieldCheck,
  SlidersHorizontal,
  CaretRight,
  Circle,
  SquareHalf,
  UserCircleMinus,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { useCVStore } from "@/lib/cv/store";
import { FONT_FAMILY_LABELS } from "@/lib/cv/schema";
import { RODO_OPTIONS } from "@/lib/cv/rodo";
import {
  StyleSheetTemplate,
  StyleSheetFont,
  StyleSheetSize,
  StyleSheetPhoto,
  StyleSheetRodo,
  StyleSheetAdvanced,
} from "./style-sheets";
import { cn } from "@/lib/utils";

type SheetKey = "template" | "font" | "size" | "photo" | "rodo" | "advanced";

const TEMPLATE_LABEL: Record<string, string> = {
  orbit: "Orbit",
  atlas: "Atlas",
  terra: "Terra",
  cobalt: "Cobalt",
  lumen: "Lumen",
};

const PHOTO_SHAPE_LABEL = {
  circle: "Koło",
  square: "Kwadrat",
  none: "Bez zdjęcia",
} as const;

export function MobileTabStyle() {
  const [open, setOpen] = useState<SheetKey | null>(null);

  const settings = useCVStore((s) => s.cv.settings);
  const rodoType = useCVStore((s) => s.cv.rodo.type);
  const photo = useCVStore((s) => s.cv.personal.photo);

  const templateLabel = TEMPLATE_LABEL[settings.templateId] ?? "Orbit";
  const fontLabel = FONT_FAMILY_LABELS[settings.fontFamily] ?? "Manrope";
  const sizeLabel = `${settings.fontSize.toFixed(2).replace(/\.00$/, "")}pt`;
  const rodoLabel = RODO_OPTIONS.find((o) => o.value === rodoType)?.pillLabel ?? "—";
  const photoLabel = PHOTO_SHAPE_LABEL[settings.photoShape];
  const hiddenCount = settings.hiddenContactFields?.length ?? 0;
  const advancedLabel = hiddenCount > 0 ? `${hiddenCount} ukrytych pól` : "Sekcje i kontakt";

  return (
    <div className="px-4 pb-28 pt-4">
      <header className="mb-5 flex items-baseline justify-between px-1">
        <h1 className="font-display text-[1.35rem] font-semibold tracking-tight text-ink">
          Styl
        </h1>
        <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
          Tap → otwórz
        </span>
      </header>

      <ul className="grid grid-cols-2 gap-3">
        <Tile
          Icon={Palette}
          title="Szablon"
          value={templateLabel}
          onClick={() => setOpen("template")}
          accent={<TemplateBadge id={settings.templateId} />}
        />
        <Tile
          Icon={TextAa}
          title="Czcionka"
          value={fontLabel}
          onClick={() => setOpen("font")}
        />
        <Tile
          Icon={TextT}
          title="Rozmiar"
          value={sizeLabel}
          onClick={() => setOpen("size")}
        />
        <Tile
          Icon={Camera}
          title="Zdjęcie"
          value={photoLabel}
          onClick={() => setOpen("photo")}
          accent={<PhotoBadge photo={photo} shape={settings.photoShape} />}
        />
        <Tile
          Icon={ShieldCheck}
          title="RODO"
          value={rodoLabel}
          onClick={() => setOpen("rodo")}
        />
        <Tile
          Icon={SlidersHorizontal}
          title="Zaawansowane"
          value={advancedLabel}
          onClick={() => setOpen("advanced")}
        />
      </ul>

      <p className="mt-5 px-1 text-[12px] leading-snug text-[color:var(--ink-muted)]">
        Każda zmiana widoczna natychmiast w podglądzie (przycisk <strong>Zobacz CV</strong> na górze).
        Pracuś auto-skaluje czcionkę, abyś zawsze zmieścił się na 1 stronie A4.
      </p>

      <StyleSheetTemplate open={open === "template"} onClose={() => setOpen(null)} />
      <StyleSheetFont open={open === "font"} onClose={() => setOpen(null)} />
      <StyleSheetSize open={open === "size"} onClose={() => setOpen(null)} />
      <StyleSheetPhoto open={open === "photo"} onClose={() => setOpen(null)} />
      <StyleSheetRodo open={open === "rodo"} onClose={() => setOpen(null)} />
      <StyleSheetAdvanced open={open === "advanced"} onClose={() => setOpen(null)} />
    </div>
  );
}

type TileProps = {
  Icon: PhosphorIcon;
  title: string;
  value: string;
  onClick: () => void;
  accent?: React.ReactNode;
};

function Tile({ Icon, title, value, onClick, accent }: TileProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex h-full w-full flex-col justify-between rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-4 text-left transition-[border-color,transform,background-color] duration-150 ease-out active:scale-[0.98] hover:border-[color:var(--ink)]",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)] text-[color:var(--ink)]">
            <Icon size={17} weight="regular" />
          </span>
          {accent ?? (
            <CaretRight
              size={14}
              weight="bold"
              className="text-[color:var(--ink-muted)] transition-transform group-hover:translate-x-0.5"
            />
          )}
        </div>
        <div className="mt-5">
          <span className="mono-label block text-[0.58rem] tracking-[0.14em] text-[color:var(--ink-muted)]">
            {title}
          </span>
          <span className="mt-1 line-clamp-1 block font-display text-[15px] font-semibold tracking-tight text-ink">
            {value}
          </span>
        </div>
      </button>
    </li>
  );
}

function TemplateBadge({ id }: { id: string }) {
  const color =
    id === "atlas"
      ? "#2563eb"
      : id === "terra"
        ? "#b85a3e"
        : id === "cobalt"
          ? "#1f3a5f"
          : "#0f1115";
  return (
    <span
      aria-hidden
      className="inline-flex size-6 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white"
    >
      <span className="size-3 rounded-full" style={{ background: color }} />
    </span>
  );
}

function PhotoBadge({ photo, shape }: { photo: string; shape: "circle" | "square" | "none" }) {
  if (shape === "none") {
    return (
      <span className="inline-flex size-6 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-[color:var(--ink-muted)]">
        <UserCircleMinus size={13} />
      </span>
    );
  }
  if (photo) {
    return (
      <span
        className={cn(
          "inline-flex size-6 overflow-hidden border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white",
          shape === "circle" ? "rounded-full" : "rounded-[6px]",
        )}
      >
        <Image src={photo} alt="" width={24} height={24} className="size-full object-cover" unoptimized />
      </span>
    );
  }
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-[color:var(--ink-muted)]">
      {shape === "circle" ? <Circle size={13} /> : <SquareHalf size={13} />}
    </span>
  );
}
