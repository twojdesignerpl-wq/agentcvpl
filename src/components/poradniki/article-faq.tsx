import type { PoradnikFaq } from "@/lib/poradniki/data";

export function ArticleFaq({ items }: { items: ReadonlyArray<PoradnikFaq> }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-16 border-t border-[color:var(--ink)]/10 pt-12">
      <p className="mono-label text-[color:var(--saffron)]">FAQ</p>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-[color:var(--ink)]">
        Najczęstsze pytania
      </h2>
      <div className="mt-8 flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-5 transition-colors hover:border-[color:var(--ink)]/20"
          >
            <summary className="flex cursor-pointer items-start justify-between gap-4 font-display text-[1.05rem] font-semibold text-[color:var(--ink)] marker:hidden">
              <span>{item.q}</span>
              <span
                aria-hidden
                className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[color:var(--ink)]/15 text-[color:var(--ink)] transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-4 font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
