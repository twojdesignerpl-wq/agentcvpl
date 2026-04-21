"use client";

import Link from "next/link";
import { Eye } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Props = {
  onPreview: () => void;
  autoSaveLabel?: string;
  className?: string;
};

export function MobileTopBar({ onPreview, autoSaveLabel = "Zapisano", className }: Props) {
  return (
    <header
      className={cn(
        "safe-top sticky top-0 z-30 border-b border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] bg-[color:color-mix(in_oklab,var(--cream)_92%,transparent)] backdrop-blur-md",
        className,
      )}
      role="banner"
    >
      <div className="flex h-12 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-baseline gap-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50"
          aria-label="agentcv.pl — strona główna"
        >
          <span className="font-display text-[1.1rem] font-bold leading-none tracking-tight text-[color:var(--ink)]">
            agentcv
          </span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 -translate-y-[2px] rounded-full bg-[color:var(--saffron)]"
          />
          <span className="mono-label text-[0.58rem] text-[color:var(--ink)]/50">.pl</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="mono-label hidden text-[0.58rem] text-[color:var(--ink)]/55 sm:inline"
            aria-live="polite"
          >
            {autoSaveLabel}
          </span>
          <button
            type="button"
            onClick={onPreview}
            className="tap-target inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] font-semibold text-cream shadow-sm transition-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]"
            aria-label="Zobacz podgląd CV"
          >
            <Eye size={14} weight="bold" />
            Zobacz CV
          </button>
        </div>
      </div>
    </header>
  );
}
