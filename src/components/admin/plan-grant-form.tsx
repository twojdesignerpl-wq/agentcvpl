"use client";

import { useState, useTransition } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { grantPlan, type GrantResult } from "@/app/admin/users/[id]/actions";

type Props = {
  userId: string;
  userEmail: string;
  currentPlan: "free" | "pro" | "unlimited";
};

const PLAN_OPTIONS: Array<{ id: "free" | "pro" | "unlimited"; label: string; hint: string }> = [
  { id: "free", label: "Free", hint: "1 pobranie/mc, bez AI" },
  { id: "pro", label: "Pro", hint: "10 pobrań/mc, pełny AI" },
  { id: "unlimited", label: "Unlimited", hint: "bez limitów, priority" },
];

export function PlanGrantForm({ userId, userEmail, currentPlan }: Props) {
  const [plan, setPlan] = useState<"free" | "pro" | "unlimited">(currentPlan);
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<GrantResult | null>(null);

  const disabled = pending || plan === currentPlan || reason.trim().length < 3;

  const submit = () => {
    setResult(null);
    startTransition(async () => {
      const res = await grantPlan({ userId, plan, reason: reason.trim(), notifyUser: notify });
      setResult(res);
      if (res.ok) setReason("");
    });
  };

  return (
    <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 sm:p-6">
      <h2 className="font-display text-[1.25rem] font-bold tracking-tight">Zmień plan</h2>
      <p className="mt-1 text-[13px] text-[color:var(--ink-soft)]">
        Nadawanie zostanie zapisane w audit logu ({`/admin/grants`}). Email do{" "}
        <strong>{userEmail}</strong> wyślemy automatycznie.
      </p>

      <fieldset className="mt-5">
        <legend className="mono-label mb-2 text-[0.56rem] text-[color:var(--ink-muted)]">
          Plan docelowy
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {PLAN_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                plan === opt.id
                  ? "border-[color:var(--ink)] bg-[color:var(--cream-soft)]"
                  : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] hover:border-[color:var(--ink)]/40"
              }`}
            >
              <input
                type="radio"
                name="plan"
                value={opt.id}
                checked={plan === opt.id}
                onChange={() => setPlan(opt.id)}
                className="sr-only"
              />
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{opt.label}</span>
                {opt.id === currentPlan ? (
                  <span className="mono-label text-[0.56rem] text-[color:var(--ink-muted)]">
                    aktualny
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[12px] text-[color:var(--ink-muted)]">{opt.hint}</p>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="reason" className="mono-label mb-2 block text-[0.56rem] text-[color:var(--ink-muted)]">
          Powód (zapisany w audycie)
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="np. Nagroda za feedback beta / kompensacja za problem z eksportem / pracownik zespołu"
          className="w-full rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)]/50 px-3 py-2.5 text-[14px] placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--ink)] focus:outline-none"
        />
        <p className="mt-1 text-right text-[11px] text-[color:var(--ink-muted)]">{reason.length}/500</p>
      </div>

      <label className="mt-3 inline-flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
          className="size-4 accent-[color:var(--ink)]"
        />
        Wyślij powiadomienie email do użytkownika
      </label>

      <button
        type="button"
        onClick={submit}
        disabled={disabled}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-cream transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Zapisuję…" : `Nadaj plan ${plan}`}
      </button>

      {result?.ok ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[color:var(--jade)]/10 px-3 py-2.5 text-[13px] text-[color:var(--jade)]">
          <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
          <span>
            Plan zmieniony na <strong>{result.plan}</strong>.
            {result.emailSent ? " Email wysłany." : " (Email nie został wysłany)"}
          </span>
        </div>
      ) : null}
      {result && !result.ok ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-[13px] text-rose-700">
          <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
          <span>{result.error}</span>
        </div>
      ) : null}
    </div>
  );
}
