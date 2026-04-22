"use client";

import { useState, useTransition } from "react";
import { CheckCircle, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react";
import { sendReply, type ReplyResult } from "@/app/admin/poczta/actions";

type Props = {
  threadId: string;
  to: string;
  defaultSubject: string;
  inReplyTo?: string | null;
};

export function ComposeForm({ threadId, to, defaultSubject, inReplyTo }: Props) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ReplyResult | null>(null);

  const submit = () => {
    setResult(null);
    startTransition(async () => {
      const res = await sendReply({
        threadId,
        to,
        subject: subject.trim(),
        body: body.trim(),
        inReplyTo: inReplyTo ?? undefined,
      });
      setResult(res);
      if (res.ok) setBody("");
    });
  };

  return (
    <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-5 sm:p-6">
      <h3 className="mb-4 font-display text-[1.05rem] font-bold tracking-tight">Odpowiedz</h3>

      <div className="space-y-3">
        <Field label="Do">
          <span className="font-mono text-[13px]">{to}</span>
        </Field>

        <Field label="Temat">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
            className="w-full rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)]/50 px-3 py-2 text-[14px] focus:border-[color:var(--ink)] focus:outline-none"
          />
        </Field>

        <Field label="Wiadomość">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            maxLength={50_000}
            placeholder="Cześć,&#10;&#10;dzięki za wiadomość..."
            className="w-full rounded-lg border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-[color:var(--cream-soft)]/50 px-3 py-2.5 font-mono text-[13.5px] leading-relaxed focus:border-[color:var(--ink)] focus:outline-none"
          />
          <p className="mt-1 text-right text-[11px] text-[color:var(--ink-muted)]">{body.length}/50000</p>
        </Field>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={pending || body.trim().length === 0 || subject.trim().length === 0}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-cream transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        <PaperPlaneTilt size={14} weight="bold" />
        {pending ? "Wysyłam…" : "Wyślij odpowiedź"}
      </button>

      {result?.ok ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[color:var(--jade)]/10 px-3 py-2.5 text-[13px] text-[color:var(--jade)]">
          <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
          <span>Wysłano. Odbiorca dostanie od Pracusia.</span>
        </div>
      ) : null}
      {result && !result.ok ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-[13px] text-rose-700">
          <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
          <span>{result.error}</span>
        </div>
      ) : null}

      <p className="mt-3 text-[11px] text-[color:var(--ink-muted)]">
        Wiadomość wysłana jako <strong>Agent CV - Pracuś AI &lt;hej@agentcv.pl&gt;</strong>. Odbiorca odpowie na ten adres.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mono-label mb-1.5 text-[0.56rem] text-[color:var(--ink-muted)]">{label}</p>
      {children}
    </div>
  );
}
