"use client";

import { PencilSimple, Palette, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { PracusMark } from "@/components/kreator/pracus/icon";
import { cn } from "@/lib/utils";

export type MobileTab = "editor" | "style" | "ai" | "export";

type NavItem = {
  id: MobileTab;
  label: string;
  Icon?: Icon;
  /** Custom render (używane dla Pracusia — PracusMark zamiast Phosphor icon) */
  renderIcon?: (active: boolean) => React.ReactNode;
};

const ITEMS: readonly NavItem[] = [
  { id: "editor", label: "Edytor", Icon: PencilSimple },
  { id: "style", label: "Styl", Icon: Palette },
  {
    id: "ai",
    label: "Pracuś",
    renderIcon: (active) => (
      <PracusMark
        variant="mini"
        size={26}
        online={active}
        className={cn("transition-transform duration-200", active ? "scale-[1.08]" : "scale-100")}
      />
    ),
  },
  { id: "export", label: "Pobierz", Icon: DownloadSimple },
] as const;

type Props = {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
};

export function MobileBottomNav({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Nawigacja kreatora"
      className="safe-bottom sticky bottom-0 z-30 border-t border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:color-mix(in_oklab,var(--cream)_94%,transparent)] backdrop-blur-md"
      style={{ minHeight: "var(--bottom-nav-h, 4rem)" }}
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch justify-between px-2">
        {ITEMS.map(({ id, label, Icon, renderIcon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "tap-target group relative mx-auto flex w-full flex-col items-center justify-center gap-1 py-2 text-[10.5px] font-medium transition-colors",
                  isActive
                    ? "text-[color:var(--ink)]"
                    : "text-[color:color-mix(in_oklab,var(--ink)_55%,transparent)] hover:text-[color:var(--ink)]",
                )}
              >
                <span
                  aria-hidden
                  className="relative inline-flex h-7 w-7 items-center justify-center"
                >
                  {renderIcon ? (
                    renderIcon(isActive)
                  ) : Icon ? (
                    <Icon
                      size={21}
                      weight={isActive ? "fill" : "regular"}
                      className={cn(
                        "transition-transform duration-200",
                        isActive ? "scale-[1.06]" : "scale-100",
                      )}
                    />
                  ) : null}
                </span>
                <span className="mono-label text-[0.58rem] tracking-[0.12em] uppercase">
                  {label}
                </span>
                {/* Saffron underline — editorial accent */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-[width,background-color] duration-200",
                    isActive
                      ? "w-8 bg-[color:var(--saffron)]"
                      : "w-0 bg-transparent",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
