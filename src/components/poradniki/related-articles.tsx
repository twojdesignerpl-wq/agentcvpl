import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Poradnik } from "@/lib/poradniki/data";

export function RelatedArticles({ items }: { items: ReadonlyArray<Poradnik> }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-16 border-t border-[color:var(--ink)]/10 pt-12">
      <p className="mono-label text-[color:var(--saffron)]">Kontynuuj</p>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-[color:var(--ink)]">
        Powiązane poradniki
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/poradniki/${p.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-6 transition-all hover:border-[color:var(--ink)]/25 hover:shadow-[0_24px_48px_-28px_rgba(10,14,26,0.25)]"
          >
            <p className="mono-label text-[color:var(--ink-muted)]">{p.heroEyebrow}</p>
            <h3 className="font-display text-[1.3rem] font-semibold leading-snug tracking-tight text-[color:var(--ink)]">
              {p.title}
            </h3>
            <p className="font-body text-[0.92rem] leading-relaxed text-[color:var(--ink-soft)]">
              {p.heroSubtitle.split(".")[0]}.
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 font-body text-[0.9rem] font-semibold text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--saffron)]">
              Czytaj
              <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
