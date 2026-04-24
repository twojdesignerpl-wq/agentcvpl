"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

type Props = {
  plan: "pro" | "unlimited";
  mode?: "sub" | "pack";
  label: string;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  /** "md" default (py-3) · "lg" dla premium card CTA (py-3.5 + większy tekst). */
  size?: "md" | "lg";
};

export function CheckoutButton({
  plan,
  mode = "sub",
  label,
  disabled,
  variant = "primary",
  size = "md",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, mode }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        sessionId?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Nie udało się uruchomić płatności.");
        return;
      }
      if (data.url) {
        track("checkout_started", { plan, mode });
        window.location.href = data.url;
        return;
      }
      setError("Brak URL checkout w odpowiedzi.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const sizeCls = size === "lg"
    ? "px-6 py-3.5 text-[15px]"
    : "px-5 py-3 text-[14px]";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={start}
        disabled={disabled || loading}
        className={cn(
          "group tap-target relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]",
          "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
          sizeCls,
          variant === "primary"
            ? "bg-[color:var(--ink)] text-[color:var(--cream)] shadow-[0_8px_24px_-12px_rgba(10,14,26,0.55)] hover:shadow-[0_14px_32px_-10px_rgba(10,14,26,0.65)] hover:-translate-y-[1px]"
            : "border border-[color:color-mix(in_oklab,var(--ink)_18%,transparent)] bg-[color:var(--cream)] text-[color:var(--ink)] hover:border-[color:var(--ink)] hover:bg-[color:var(--cream-soft)]",
        )}
      >
        {/* Saffron shimmer sweep on hover (primary only) */}
        {variant === "primary" ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[color:color-mix(in_oklab,var(--saffron)_32%,transparent)] to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
        ) : null}

        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <>
              <span
                aria-hidden
                className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              Przekierowuję…
            </>
          ) : (
            <>
              {label}
              <ArrowRight
                size={size === "lg" ? 16 : 14}
                weight="bold"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </>
          )}
        </span>
      </button>
      {error ? (
        <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
