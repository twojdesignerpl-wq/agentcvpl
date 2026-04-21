"use client";

import { motion } from "motion/react";
import {
  SiAllegro,
  SiLidl,
  SiZabka,
  SiDhl,
  SiIkea,
  SiLotpolishairlines,
  SiCdprojekt,
  SiLivechat,
  SiGoogle,
  SiIntel,
  SiSamsung,
  SiSap,
  SiSiemens,
  SiVolkswagen,
  SiLufthansa,
  SiSpotify,
  SiNetflix,
  SiMeta,
  SiBmw,
  SiToyota,
} from "react-icons/si";
import type { IconType } from "react-icons";
import {
  Truck,
  ShoppingCart,
  Factory,
  ForkKnife,
  Hammer,
  FirstAid,
  Van,
  Code,
  Megaphone,
  Folder,
  Wrench,
  Heart,
} from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "./_shared/eyebrow";
import {
  brandWordmarks,
  professionTokens,
  industryCategories,
  type BrandMark,
  type IndustryCategory,
} from "@/lib/landing/content";
import { cn } from "@/lib/utils";

const BRAND_ICON_MAP: Record<BrandMark["iconKey"], IconType> = {
  allegro: SiAllegro,
  lidl: SiLidl,
  zabka: SiZabka,
  dhl: SiDhl,
  ikea: SiIkea,
  lot: SiLotpolishairlines,
  cdprojekt: SiCdprojekt,
  livechat: SiLivechat,
  google: SiGoogle,
  intel: SiIntel,
  samsung: SiSamsung,
  sap: SiSap,
  siemens: SiSiemens,
  volkswagen: SiVolkswagen,
  lufthansa: SiLufthansa,
  spotify: SiSpotify,
  netflix: SiNetflix,
  meta: SiMeta,
  bmw: SiBmw,
  toyota: SiToyota,
};

const INDUSTRY_ICON_MAP: Record<
  IndustryCategory["icon"],
  React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "duotone" | "fill" }>
> = {
  Truck,
  ShoppingCart,
  Factory,
  ForkKnife,
  Wrench,
  Heart,
  Van,
  Code,
  Megaphone,
  Folder,
  Hammer,
  FirstAid,
};

function BrandTile({ brand }: { brand: BrandMark }) {
  const Icon = BRAND_ICON_MAP[brand.iconKey];
  return (
    <div className="flex h-[76px] min-w-[190px] items-center justify-center gap-3 rounded-2xl bg-[color:var(--cream)] px-7 shadow-[0_14px_36px_-20px_rgba(10,14,26,0.55)]">
      <Icon size={34} color={brand.color} />
      <span
        className="font-display text-[1.35rem] font-semibold leading-none tracking-tight"
        style={{ color: brand.color }}
      >
        {brand.name}
      </span>
    </div>
  );
}

function MarqueeRow<T>({
  items,
  renderItem,
  direction = "left",
  speed = 60,
  gap = "gap-4",
  itemKey,
}: {
  items: readonly T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  gap?: string;
  itemKey: (item: T, index: number) => string;
}) {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]">
      <motion.div
        className={cn("flex w-max whitespace-nowrap will-change-transform", gap)}
        animate={{
          x:
            direction === "left"
              ? ["0%", "-33.3333%"]
              : ["-33.3333%", "0%"],
        }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {duplicated.map((item, i) => (
          <div key={`${itemKey(item, i)}-${i}`} className="flex shrink-0 items-center">
            {renderItem(item, i)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TrustMarquee() {
  return (
    <section className="relative w-full bg-[var(--ink)] py-20 text-[var(--cream)] sm:py-24 grain">
      {/* Header block — constrained */}
      <div className="relative mx-auto mb-12 w-full max-w-[var(--content-max)] px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start gap-3">
          <Eyebrow index="02" tone="cream">
            Dla każdej branży, każdego zawodu
          </Eyebrow>
          <p className="max-w-xl font-body text-[0.98rem] leading-relaxed text-[color:var(--cream)]/65">
            Magazyn, handel, produkcja, transport, gastronomia, opieka, IT — agent Pracuś pisze dla każdego, kto szuka pracy, w polskich i zagranicznych firmach.
          </p>
        </div>
      </div>

      {/* Marquee rows — full viewport width */}
      <div className="relative flex flex-col gap-8">
        {/* Row 1 — real brand logos, scrolling RIGHT */}
        <MarqueeRow
          items={brandWordmarks}
          direction="right"
          speed={75}
          gap="gap-5"
          itemKey={(b) => `brand-${b.name}`}
          renderItem={(brand) => <BrandTile brand={brand} />}
        />

        {/* Row 2 — professions in oversized editorial serif */}
        <MarqueeRow
          items={professionTokens}
          direction="right"
          speed={90}
          gap="gap-12"
          itemKey={(p) => `prof-${p}`}
          renderItem={(profession) => (
            <div className="flex items-center gap-12">
              <span className="font-display text-[clamp(1.75rem,3.8vw,2.85rem)] font-bold leading-none tracking-tight text-[color:var(--cream)]">
                {profession}
              </span>
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full bg-[color:var(--saffron)]"
              />
            </div>
          )}
        />

        {/* Row 3 — industry category chips, scrolling LEFT */}
        <MarqueeRow
          items={industryCategories}
          direction="left"
          speed={55}
          gap="gap-4"
          itemKey={(c) => `cat-${c.label}`}
          renderItem={(cat) => {
            const Icon = INDUSTRY_ICON_MAP[cat.icon];
            return (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--cream)]/25 bg-[color:var(--cream)]/5 px-5 py-2.5 backdrop-blur-sm">
                <Icon size={18} weight="duotone" />
                <span className="mono-label text-[color:var(--cream)]">{cat.label}</span>
              </span>
            );
          }}
        />
      </div>
    </section>
  );
}
