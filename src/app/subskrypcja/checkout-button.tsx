"use client";

import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

type Props = {
  plan: "pro" | "unlimited";
  label: string;
  disabled?: boolean;
};

export function CheckoutButton({ plan, label, disabled }: Props) {
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
        body: JSON.stringify({ plan }),
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
        track("checkout_started", { plan });
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

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={start}
        disabled={disabled || loading}
        className={cn(
          "tap-target inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-cream transition-opacity hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {loading ? "Przekierowuję…" : label}
        {!loading ? <ArrowRight size={14} weight="bold" /> : null}
      </button>
      {error ? (
        <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
