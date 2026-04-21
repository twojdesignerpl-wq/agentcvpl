export type StatBarItem = {
  label: string;
  value: string;
};

export function StatsBar({ items }: { items: ReadonlyArray<StatBarItem> }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-[color:var(--ink)]/10 overflow-hidden rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1.5 p-5">
          <span className="font-display text-[1.75rem] font-bold leading-none tracking-tight text-[color:var(--ink)]">
            {item.value}
          </span>
          <span className="mono-label text-[0.72rem] text-[color:var(--ink-muted)]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
