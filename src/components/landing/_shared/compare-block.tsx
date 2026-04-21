export function CompareBlock({
  before,
  after,
  beforeLabel = "Bez Pracusia",
  afterLabel = "Z Pracusiem",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-2.5 rounded-xl border border-[color:var(--ink)]/12 bg-[color:var(--cream-soft)] p-5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--rust)]/15 text-[color:var(--rust)]"
          >
            ✕
          </span>
          <span className="mono-label text-[color:var(--ink-muted)]">{beforeLabel}</span>
        </div>
        <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink)]/55 line-through">
          {before}
        </p>
      </div>
      <div className="flex flex-col gap-2.5 rounded-xl border border-[color:var(--saffron)]/50 bg-[color:color-mix(in_oklab,var(--saffron)_10%,var(--cream-soft))] p-5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--jade)]/20 text-[color:var(--jade)]"
          >
            ✓
          </span>
          <span className="mono-label text-[color:var(--ink)]">{afterLabel}</span>
        </div>
        <p className="editorial-underline font-body text-[0.95rem] font-semibold leading-relaxed text-[color:var(--ink)]">
          {after}
        </p>
      </div>
    </div>
  );
}
