"use client";

import { PencilSimple, Palette, Sparkle, FloppyDisk } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type MobileTab = "editor" | "style" | "ai" | "export";

type NavItem = {
  id: MobileTab;
  label: string;
  Icon: Icon;
};

const ITEMS: readonly NavItem[] = [
  { id: "editor", label: "Edytor", Icon: PencilSimple },
  { id: "style", label: "Styl", Icon: Palette },
  { id: "ai", label: "Pracuś", Icon: Sparkle },
  { id: "export", label: "Zapisz", Icon: FloppyDisk },
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
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch justify-between px-2">
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "tap-target group relative mx-auto flex w-full flex-col items-center justify-center gap-0.5 py-2 text-[10.5px] font-medium transition-colors",
                  isActive
                    ? "text-[color:var(--ink)]"
                    : "text-[color:color-mix(in_oklab,var(--ink)_55%,transparent)] hover:text-[color:var(--ink)]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                    isActive
                      ? "bg-[color:color-mix(in_oklab,var(--saffron)_22%,transparent)]"
                      : "bg-transparent",
                  )}
                >
                  <Icon
                    size={20}
                    weight={isActive ? "fill" : "regular"}
                    className={cn(
                      "transition-transform duration-200",
                      isActive ? "scale-[1.04]" : "scale-100",
                    )}
                  />
                </span>
                <span className="mono-label text-[0.58rem] tracking-[0.12em] uppercase">
                  {label}
                </span>
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-[color:var(--ink)]"
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
