"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash, ArrowRight, Clock } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { deleteCvAction, type CvRow } from "@/app/actions/cv";
import { cn } from "@/lib/utils";

const TEMPLATE_COLORS: Record<string, string> = {
  orbit: "#0f1115",
  atlas: "#2563eb",
  terra: "#b85a3e",
  cobalt: "#1f3a5f",
  lumen: "#0a0c10",
};

export function CvCard({ row }: { row: CvRow }) {
  const router = useRouter();
  const setCV = useCVStore((s) => s.setCV);
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const fullName =
    [row.data.personal.firstName, row.data.personal.lastName].filter(Boolean).join(" ") ||
    row.data.personal.role ||
    "Bez tytułu";
  const templateId = row.data.settings.templateId;
  const templateColor = TEMPLATE_COLORS[templateId] ?? "#0f1115";
  const updatedAt = new Date(row.updated_at);

  const openInKreator = () => {
    setLoading(true);
    setCV(row.data);
    router.push("/kreator");
  };

  const remove = () => {
    if (!confirm("Usunąć to CV z konta? Operacja nieodwracalna.")) return;
    startTransition(async () => {
      const res = await deleteCvAction(row.id);
      if (!res.ok) {
        alert(`Nie udało się usunąć: ${res.error}`);
        return;
      }
      router.refresh();
    });
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream-soft)] p-5 transition-colors hover:border-[color:var(--ink)]",
        (pending || loading) && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="relative inline-flex h-[68px] w-[48px] shrink-0 flex-col gap-1 overflow-hidden rounded-md border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white p-1.5"
        >
          <span className="h-[3px] w-[60%] rounded" style={{ background: templateColor }} />
          <span className="h-[1.5px] w-[80%] rounded bg-ink/30" />
          <span className="mt-0.5 h-[0.5px] w-full bg-ink/10" />
          <span className="mt-0.5 h-[1.5px] w-[40%] rounded bg-ink/60" />
          <span className="h-[1.5px] w-[85%] rounded bg-ink/20" />
          <span className="h-[1.5px] w-[80%] rounded bg-ink/20" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-[15px] font-semibold tracking-tight text-ink">
            {fullName}
          </h2>
          <p className="mt-0.5 truncate text-[12px] text-[color:var(--ink-muted)]">
            {row.data.personal.role || "—"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[color:var(--ink-muted)]">
            <span className="inline-flex items-center gap-1">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full"
                style={{ background: templateColor }}
              />
              {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={10} />
              {updatedAt.toLocaleDateString("pl-PL", { day: "numeric", month: "short" })}
              {" · "}
              {updatedAt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={openInKreator}
          disabled={pending || loading}
          className="tap-target inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-2.5 text-[13px] font-semibold text-cream hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Otwieram…" : "Otwórz w kreatorze"}
          {!loading ? <ArrowRight size={12} weight="bold" /> : null}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending || loading}
          aria-label={`Usuń CV: ${fullName}`}
          className="tap-target inline-flex items-center justify-center rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white px-3 text-rose-600 hover:border-rose-400 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash size={14} />
        </button>
      </div>
    </article>
  );
}
