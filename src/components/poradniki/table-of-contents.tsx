import type { PoradnikBlock } from "@/lib/poradniki/data";

export function TableOfContents({ blocks }: { blocks: ReadonlyArray<PoradnikBlock> }) {
  const h2s = blocks.filter(
    (b): b is Extract<PoradnikBlock, { kind: "h2" }> => b.kind === "h2",
  );

  if (h2s.length < 3) return null;

  return (
    <aside
      aria-label="Spis treści"
      className="sticky top-24 hidden h-fit max-h-[calc(100vh-8rem)] self-start overflow-auto rounded-xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-5 lg:block"
    >
      <p className="mono-label mb-4 text-[color:var(--ink-muted)]">Spis treści</p>
      <ol className="flex flex-col gap-2.5">
        {h2s.map((h, idx) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="group flex items-start gap-2 text-[0.88rem] leading-snug text-[color:var(--ink-soft)] transition-colors hover:text-[color:var(--ink)]"
            >
              <span className="mono-label text-[0.7rem] text-[color:var(--ink-muted)]/70">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
