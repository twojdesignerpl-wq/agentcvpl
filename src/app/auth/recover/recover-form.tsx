"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function RecoverForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  // Supabase automatycznie ustawia sesję gdy user klika link z emaila (type=recovery).
  // Czekamy na nią przed pokazaniem formularza.
  useEffect(() => {
    let cancelled = false;
    const supabase = createSupabaseBrowserClient();
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) setReady(true);
      else {
        // Nie ma sesji — link wygasł albo user wszedł bezpośrednio
        setError(
          "Brak aktywnej sesji resetu hasła. Wróć do logowania i kliknij 'Zapomniałem hasła' ponownie.",
        );
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Hasło musi mieć min. 8 znaków.");
      return;
    }
    if (password !== confirm) {
      setError("Hasła nie są takie same.");
      return;
    }
    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error: updateErr } = await supabase.auth.updateUser({ password });
        if (updateErr) {
          setError(updateErr.message);
          return;
        }
        setSuccess(true);
        setTimeout(() => router.push("/konto"), 1500);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  if (error && !ready) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-[13px] leading-relaxed text-rose-800">
        {error}
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-8 text-[13px] text-[color:var(--ink-muted)]">
        Weryfikuję link…
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-xl border border-[color:var(--jade)]/40 bg-[color:var(--jade)]/10 p-4 text-[14px] text-[color:var(--jade)]">
        Hasło zapisane. Przekierowuję na /konto…
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="mono-label text-[0.56rem] text-[color:var(--ink-muted)]">Nowe hasło</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          className="rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white px-3 py-2.5 text-[14px] focus:border-[color:var(--ink)] focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="mono-label text-[0.56rem] text-[color:var(--ink-muted)]">Powtórz hasło</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={8}
          required
          className="rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-white px-3 py-2.5 text-[14px] focus:border-[color:var(--ink)] focus:outline-none"
        />
      </label>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-cream transition-opacity hover:opacity-95 disabled:opacity-50"
      >
        {pending ? "Zapisuję…" : "Ustaw nowe hasło"}
      </button>
    </form>
  );
}
