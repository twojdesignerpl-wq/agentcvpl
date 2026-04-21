"use client";

import { useState, useTransition } from "react";
import { CloudArrowUp, CheckCircle, SignIn } from "@phosphor-icons/react/dist/ssr";
import { useCVStore } from "@/lib/cv/store";
import { useUser } from "@/hooks/use-user";
import { saveCvAction } from "@/app/actions/cv";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

type Props = {
  effectiveFontSize: number;
  compact?: boolean;
};

export function SaveToAccountButton({ effectiveFontSize, compact }: Props) {
  const { user, configured } = useUser();
  const cv = useCVStore((s) => s.cv);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!configured) return null;

  const onClick = () => {
    if (!user) {
      // redirect do /zaloguj
      window.location.href = `/zaloguj?next=${encodeURIComponent("/kreator")}`;
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await saveCvAction({ cv, effectiveFontSize });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSavedAt(Date.now());
      track("cv_saved_cloud", { template: cv.settings.templateId });
      // auto-hide potwierdzenia po 3s
      setTimeout(() => setSavedAt(null), 3000);
    });
  };

  const Icon = !user ? SignIn : savedAt ? CheckCircle : CloudArrowUp;
  const label = !user
    ? "Zaloguj — zapisz"
    : pending
      ? "Zapisuję…"
      : savedAt
        ? "Zapisane"
        : "Zapisz na koncie";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={cn(
          "tap-target inline-flex items-center gap-1.5 rounded-full border transition-[background-color,border-color,transform] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
          compact
            ? "border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-cream-soft px-3 py-1.5 text-[12.5px]"
            : "border-[color:color-mix(in_oklab,var(--ink)_14%,transparent)] bg-white px-4 py-2 text-[13px]",
          savedAt
            ? "border-[color:var(--jade)]/40 bg-[color:color-mix(in_oklab,var(--jade)_12%,transparent)] text-[color:var(--jade)]"
            : "text-ink hover:border-[color:var(--ink)]",
        )}
      >
        <Icon size={13} weight={savedAt ? "fill" : "regular"} />
        {label}
      </button>
      {error ? (
        <p
          role="alert"
          className="absolute left-0 top-full z-20 mt-1 whitespace-nowrap rounded-lg bg-rose-50 px-2 py-1 text-[11px] text-rose-700 shadow-sm"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
