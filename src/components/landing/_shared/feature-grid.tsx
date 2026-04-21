import type { ComponentType } from "react";

export type FeatureGridItem = {
  icon: ComponentType<{ size?: number; weight?: "regular" | "bold" | "duotone" | "fill" }>;
  title: string;
  body: string;
  accent?: "saffron" | "jade" | "rust";
};

export function FeatureGrid({ items }: { items: ReadonlyArray<FeatureGridItem> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, body, accent = "saffron" }) => (
        <article
          key={title}
          className="group flex flex-col gap-4 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-7 transition-all hover:border-[color:var(--ink)]/25 hover:shadow-[0_24px_48px_-28px_rgba(10,14,26,0.22)]"
        >
          <span
            aria-hidden
            className={
              accent === "jade"
                ? "inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--jade)]/30 bg-[color:var(--jade)]/10 text-[color:var(--jade)]"
                : accent === "rust"
                ? "inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--rust)]/30 bg-[color:var(--rust)]/10 text-[color:var(--rust)]"
                : "inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[color:var(--ink)]/12 bg-[color:var(--cream)] text-[color:var(--ink)] transition-colors group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--cream)]"
            }
          >
            <Icon size={22} weight="duotone" />
          </span>
          <h3 className="font-display text-[1.25rem] font-semibold leading-tight tracking-tight text-[color:var(--ink)]">
            {title}
          </h3>
          <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
            {body}
          </p>
        </article>
      ))}
    </div>
  );
}
