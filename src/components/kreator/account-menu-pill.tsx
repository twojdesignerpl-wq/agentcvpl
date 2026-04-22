"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CaretDown,
  User as UserIcon,
  ClockCounterClockwise,
  Sparkle,
  SignOut,
  SignIn,
} from "@phosphor-icons/react/dist/ssr";
import { useUser } from "@/hooks/use-user";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AnimatedPopover } from "./animated-popover";

/**
 * Kompaktowy pill "Konto" w toolbarze kreatora.
 * - Niezalogowany: link do /zaloguj
 * - Zalogowany: dropdown z linkami do /konto, /konto/cv, /subskrypcja + wyloguj
 * Niewidoczny gdy Supabase nie skonfigurowany.
 */
export function AccountMenuPill() {
  const { user, loading, configured } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!configured) return null;

  if (loading) {
    return (
      <span
        aria-hidden
        className="inline-block h-9 w-9 animate-pulse rounded-full bg-[color:color-mix(in_oklab,var(--ink)_8%,transparent)]"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href={`/zaloguj?next=${encodeURIComponent("/kreator")}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-cream-soft px-3 text-[12.5px] font-medium text-ink transition-[border-color,transform] duration-150 ease-out hover:border-[color:var(--ink)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]"
        aria-label="Zaloguj się"
      >
        <SignIn size={13} weight="regular" />
        Zaloguj
      </Link>
    );
  }

  const email = user.email ?? "";
  const initials = email ? email[0]?.toUpperCase() ?? "·" : "·";
  const handle = email.split("@")[0] ?? "";

  const signOut = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      setOpen(false);
      window.location.href = "/";
    } catch {
      // ignore
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Konto: ${email}`}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border bg-cream-soft pl-1 pr-2.5 text-[12.5px] font-medium transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]",
          open
            ? "border-[color:var(--ink)] bg-[color:color-mix(in_oklab,var(--ink)_6%,var(--cream-soft))]"
            : "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] hover:border-[color:var(--ink)]",
        )}
      >
        <span
          aria-hidden
          className="inline-flex size-7 items-center justify-center rounded-full bg-[color:var(--saffron)] text-[11px] font-bold text-[color:var(--ink)]"
        >
          {initials}
        </span>
        <span className="hidden max-w-[110px] truncate md:inline">{handle}</span>
        <CaretDown size={11} weight="bold" className="opacity-60" />
      </button>

      <AnimatedPopover
        open={open}
        align="end"
        aria-label="Menu konta"
        className="w-[260px] overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card p-1 shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
      >
        <div className="border-b border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] px-3 pb-2 pt-2">
          <p className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
            Zalogowany jako
          </p>
          <p className="mt-0.5 truncate text-[12.5px] font-semibold text-ink">{email}</p>
        </div>

        <div className="p-1">
          <Link
            href="/konto"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-ink transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]"
          >
            <UserIcon size={14} weight="regular" />
            <span className="flex-1">Moje konto</span>
          </Link>
          <Link
            href="/konto/cv"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-ink transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]"
          >
            <ClockCounterClockwise size={14} weight="regular" />
            <span className="flex-1">Historia CV</span>
          </Link>
          <Link
            href="/subskrypcja"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-ink transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]"
          >
            <Sparkle size={14} weight="regular" />
            <span className="flex-1">Plan i subskrypcja</span>
          </Link>
        </div>

        <div className="border-t border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] p-1">
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] text-rose-700 transition-colors hover:bg-rose-50"
          >
            <SignOut size={14} weight="regular" />
            <span className="flex-1">Wyloguj się</span>
          </button>
        </div>
      </AnimatedPopover>
    </div>
  );
}
