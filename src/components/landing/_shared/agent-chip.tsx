import { cn } from "@/lib/utils";

export function AgentChip({
  label = "Agent Pracuś online",
  tone = "ink",
  className,
}: {
  label?: string;
  tone?: "ink" | "cream";
  className?: string;
}) {
  const base =
    tone === "cream"
      ? "bg-[color:var(--cream)]/10 text-[color:var(--cream)] border-[color:var(--cream)]/20"
      : "bg-[color:var(--ink)]/5 text-[color:var(--ink)] border-[color:var(--ink)]/12";

  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        base,
        className,
      )}
    >
      <span className="agent-dot" aria-hidden />
      {label}
    </span>
  );
}
