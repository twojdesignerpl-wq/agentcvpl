"use client";

import { ArrowUp, ArrowDown, Trash } from "@phosphor-icons/react/dist/ssr";
import { useHaptic } from "@/hooks/use-haptic";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  confirmMessage?: string;
};

export function MobileArrayCardHeader({
  label,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  confirmMessage = "Usunąć tę pozycję?",
}: Props) {
  const haptic = useHaptic();
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const move = (dir: "up" | "down") => {
    haptic("light");
    if (dir === "up") onMoveUp();
    else onMoveDown();
  };

  return (
    <div className="mb-2 flex items-center justify-between gap-1">
      <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">{label}</span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => move("up")}
          disabled={isFirst}
          aria-label={`Przenieś ${label} w górę`}
          className={cn(
            "tap-target inline-flex items-center justify-center rounded-full transition-colors",
            isFirst
              ? "cursor-not-allowed text-[color:color-mix(in_oklab,var(--ink)_18%,transparent)]"
              : "text-ink hover:bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)]",
          )}
        >
          <ArrowUp size={15} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => move("down")}
          disabled={isLast}
          aria-label={`Przenieś ${label} w dół`}
          className={cn(
            "tap-target inline-flex items-center justify-center rounded-full transition-colors",
            isLast
              ? "cursor-not-allowed text-[color:color-mix(in_oklab,var(--ink)_18%,transparent)]"
              : "text-ink hover:bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)]",
          )}
        >
          <ArrowDown size={15} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(confirmMessage)) {
              haptic("warning");
              onRemove();
            }
          }}
          aria-label={`Usuń ${label}`}
          className="tap-target -mr-2 inline-flex items-center justify-center rounded-full text-rose-600 hover:bg-rose-50"
        >
          <Trash size={15} />
        </button>
      </div>
    </div>
  );
}
