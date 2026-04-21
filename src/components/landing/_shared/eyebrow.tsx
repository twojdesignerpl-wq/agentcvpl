import { cn } from "@/lib/utils";

type EyebrowProps = {
  index?: string;
  children: React.ReactNode;
  tone?: "ink" | "cream" | "saffron";
  className?: string;
};

export function Eyebrow({ index, children, tone = "ink", className }: EyebrowProps) {
  const color =
    tone === "cream"
      ? "text-[color:var(--cream)]/70"
      : tone === "saffron"
        ? "text-[color:var(--saffron)]"
        : "text-[color:var(--ink)]/60";

  return (
    <div
      className={cn(
        "mono-label flex items-center gap-3",
        color,
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block h-px w-10 bg-current opacity-60"
      />
      {index && <span className="tabular-nums">{index}</span>}
      <span>{children}</span>
    </div>
  );
}
