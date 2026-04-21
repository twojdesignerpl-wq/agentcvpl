export function TrustBadges({
  label,
  items,
}: {
  label: string;
  items: ReadonlyArray<string>;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-5 sm:flex-row sm:items-center sm:gap-5">
      <p className="mono-label shrink-0 text-[color:var(--ink-muted)]">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="mono-label rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream)] px-3 py-1.5 text-[0.72rem] text-[color:var(--ink)]/80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
