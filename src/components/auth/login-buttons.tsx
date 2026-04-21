"use client";

import { useState } from "react";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  redirectTo?: string;
  className?: string;
};

const BUTTON_BASE =
  "tap-target inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border px-4 py-3 text-[15px] font-semibold transition-[background-color,border-color,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

export function LoginButtons({ redirectTo = "/konto", className }: Props) {
  const [loading, setLoading] = useState<"google" | "facebook" | "email" | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const configured = isSupabaseConfigured();

  const signInWithOAuth = async (provider: "google" | "facebook") => {
    if (!configured) {
      setMessage({
        type: "err",
        text: "Logowanie nie jest jeszcze skonfigurowane. Sprawdź zmienne Supabase w Vercel.",
      });
      return;
    }
    setLoading(provider);
    setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
    } catch (e) {
      setMessage({ type: "err", text: (e as Error).message || "Błąd logowania" });
      setLoading(null);
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setMessage({
        type: "err",
        text: "Logowanie nie jest jeszcze skonfigurowane. Sprawdź zmienne Supabase w Vercel.",
      });
      return;
    }
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage({ type: "err", text: "Podaj poprawny e-mail." });
      return;
    }
    setLoading("email");
    setMessage(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
      setMessage({
        type: "ok",
        text: "Wysłaliśmy link logujący na Twój e-mail. Sprawdź skrzynkę.",
      });
    } catch (e) {
      setMessage({ type: "err", text: (e as Error).message || "Błąd logowania" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <button
        type="button"
        onClick={() => signInWithOAuth("google")}
        disabled={loading !== null}
        className={cn(
          BUTTON_BASE,
          "border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]",
        )}
        aria-label="Zaloguj się przez Google"
      >
        <SiGoogle size={18} className="text-[#4285F4]" />
        {loading === "google" ? "Przekierowuję…" : "Zaloguj się przez Google"}
      </button>
      <button
        type="button"
        onClick={() => signInWithOAuth("facebook")}
        disabled={loading !== null}
        className={cn(
          BUTTON_BASE,
          "border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white text-ink hover:border-[color:var(--ink)]",
        )}
        aria-label="Zaloguj się przez Facebook"
      >
        <SiFacebook size={18} className="text-[#1877F2]" />
        {loading === "facebook" ? "Przekierowuję…" : "Zaloguj się przez Facebook"}
      </button>

      <div className="relative my-2 flex items-center gap-3">
        <span className="h-px flex-1 bg-[color:color-mix(in_oklab,var(--ink)_12%,transparent)]" />
        <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">lub e-mail</span>
        <span className="h-px flex-1 bg-[color:color-mix(in_oklab,var(--ink)_12%,transparent)]" />
      </div>

      <form onSubmit={signInWithEmail} className="flex flex-col gap-2">
        <label htmlFor="login-email" className="sr-only">
          Adres e-mail
        </label>
        <div className="relative">
          <EnvelopeSimple
            aria-hidden
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--ink-muted)]"
          />
          <input
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="twoj@email.pl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            disabled={loading !== null}
            className="tap-target w-full rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white pl-10 pr-4 py-3 text-[15px] font-medium text-ink outline-none transition-colors focus:border-[color:var(--ink)] disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={loading !== null}
          className={cn(BUTTON_BASE, "border-transparent bg-ink text-cream hover:opacity-95")}
        >
          {loading === "email" ? "Wysyłam link…" : "Wyślij link logujący"}
        </button>
      </form>

      {message ? (
        <p
          role="status"
          className={cn(
            "rounded-xl px-3 py-2 text-[13px] leading-snug",
            message.type === "ok"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-rose-50 text-rose-700",
          )}
        >
          {message.text}
        </p>
      ) : null}

      {!configured ? (
        <p className="mt-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-snug text-amber-900">
          ⓘ Logowanie wymaga konfiguracji. Dodaj <code>NEXT_PUBLIC_SUPABASE_URL</code> i{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> w Vercel → Project → Settings → Environment
          Variables, potem redeploy.
        </p>
      ) : null}
    </div>
  );
}
