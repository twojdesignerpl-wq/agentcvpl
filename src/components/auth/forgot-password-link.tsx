"use client";

import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordLink() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!email.includes("@")) {
      setError("Podaj poprawny e-mail.");
      return;
    }
    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const origin =
          typeof window !== "undefined" ? window.location.origin : "https://agentcv.pl";
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/auth/recover`,
        });
        if (resetErr) {
          setError(resetErr.message);
          return;
        }
        setMessage(
          "Sprawdź skrzynkę — wysłaliśmy link do ustawienia nowego hasła. Możesz zamknąć to okno.",
        );
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[12.5px] text-[color:var(--ink-muted)] underline decoration-[color:var(--saffron)]/50 underline-offset-2 hover:text-ink hover:decoration-[color:var(--saffron)]"
      >
        Zapomniałem hasła
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-3 flex flex-col gap-2 rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white p-4"
    >
      <label htmlFor="reset-email" className="mono-label text-[0.56rem] text-[color:var(--ink-muted)]">
        E-mail do resetu hasła
      </label>
      <input
        id="reset-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jan.kowalski@example.com"
        className="rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)]/50 px-3 py-2 text-[14px] focus:border-[color:var(--ink)] focus:outline-none"
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-cream transition-opacity hover:opacity-95 disabled:opacity-50"
        >
          {pending ? "Wysyłam…" : "Wyślij link"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full bg-[color:var(--cream-soft)] px-4 py-2 text-[13px] text-[color:var(--ink-soft)]"
        >
          Anuluj
        </button>
      </div>
      {message ? (
        <p className="text-[12.5px] leading-relaxed text-[color:var(--jade)]">{message}</p>
      ) : null}
      {error ? <p className="text-[12.5px] text-rose-700">{error}</p> : null}
      <p className="text-[11px] text-[color:var(--ink-muted)]">
        Uwaga: reset działa tylko dla kont zarejestrowanych e-mailem. Logujesz się przez Google lub
        Facebook? Zaloguj się tym samym providerem.
      </p>
    </form>
  );
}
