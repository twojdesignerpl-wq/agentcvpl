import type { PlanId } from "@/lib/plans/quotas";

type Props = {
  plan: PlanId;
  used: number;
  limit: number | "∞";
  label?: string;
};

export function UsageChip({ plan, used, limit, label = "Pobrania" }: Props) {
  const warn = typeof limit === "number" && limit > 0 && used / limit >= 0.8;
  const bg =
    plan === "unlimited"
      ? "bg-[color:var(--jade)]/15 text-[color:var(--jade)]"
      : warn
        ? "bg-[color:var(--rust,#B84A2E)]/15 text-[color:var(--rust,#B84A2E)]"
        : "bg-[color:var(--cream-soft)] text-[color:var(--ink-soft)]";
  return (
    <span className={`mono-label inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.58rem] font-semibold ${bg}`}>
      <span className="opacity-70">{label}</span>
      <span>
        {used}
        <span className="opacity-60">/{limit}</span>
      </span>
    </span>
  );
}
