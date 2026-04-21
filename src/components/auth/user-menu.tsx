"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { CaretDown, User, SignOut } from "@phosphor-icons/react/dist/ssr";
import { useUser } from "@/hooks/use-user";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "light" | "dark";
};

/**
 * User menu w navbarze.
 * — Nie zalogowany: link "Zaloguj się" do `/zaloguj`
 * — Zalogowany: dropdown z emailem + link do `/konto` + wyloguj
 * — Supabase niedostępny: link do `/kreator` (anon flow, bez auth)
 */
export function UserMenu({ variant = "light" }: Props) {
  const { user, loading, configured } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const signOut = async () => {
    if (!configured) return;
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      setOpen(false);
    } catch {
      // ignore
    }
  };

  // Supabase nie skonfigurowany — pokazuj jedynie link "Zaloguj" jako pusty button
  // (prowadzi do /zaloguj który też powie że auth niedostępny). Nie blokuj UI.
  if (!configured || (!loading && !user)) {
    return (
      <Link
        href="/zaloguj"
        className={cn(
          "font-body text-[0.9rem] font-medium transition-colors",
          variant === "dark"
            ? "text-[color:var(--cream)]/75 hover:text-[color:var(--cream)]"
            : "text-[color:var(--ink)]/70 hover:text-[color:var(--ink)]",
        )}
      >
        Zaloguj się
      </Link>
    );
  }

  if (loading) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-block h-5 w-20 animate-pulse rounded-full",
          variant === "dark"
            ? "bg-[color:color-mix(in_oklab,var(--cream)_14%,transparent)]"
            : "bg-[color:color-mix(in_oklab,var(--ink)_8%,transparent)]",
        )}
      />
    );
  }

  const email = user?.email ?? "";
  const initials = email ? email[0]?.toUpperCase() ?? "·" : "·";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "tap-target inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[0.85rem] font-medium transition-colors",
          variant === "dark"
            ? "border-[color:color-mix(in_oklab,var(--cream)_18%,transparent)] text-[color:var(--cream)]/85 hover:border-[color:var(--saffron)] hover:text-[color:var(--saffron)]"
            : "border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] text-[color:var(--ink)] hover:border-[color:var(--ink)]",
        )}
      >
        <span
          aria-hidden
          className="inline-flex size-6 items-center justify-center rounded-full bg-[color:var(--saffron)] text-[10px] font-bold text-[color:var(--ink)]"
        >
          {initials}
        </span>
        <span className="max-w-[140px] truncate">{email.split("@")[0]}</span>
        <CaretDown size={12} weight="bold" className="opacity-60" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)] shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]"
        >
          <div className="border-b border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] px-4 py-3">
            <p className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">Zalogowany jako</p>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-ink">{email}</p>
          </div>
          <div className="p-1">
            <Link
              href="/konto"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="tap-target flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[14px] text-ink transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]"
            >
              <User size={14} weight="regular" />
              Moje konto
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              className="tap-target flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[14px] text-rose-700 transition-colors hover:bg-rose-50"
            >
              <SignOut size={14} weight="regular" />
              Wyloguj się
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
