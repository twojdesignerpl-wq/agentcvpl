import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: ReadonlyArray<BreadcrumbItem> }) {
  return (
    <nav aria-label="Okruszki nawigacyjne" className="flex items-center gap-2 text-[0.82rem]">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="mono-label text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="mono-label text-[color:var(--ink)]"
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <CaretRight
                size={11}
                weight="bold"
                aria-hidden
                className="text-[color:var(--ink-muted)]/50"
              />
            )}
          </span>
        );
      })}
    </nav>
  );
}
