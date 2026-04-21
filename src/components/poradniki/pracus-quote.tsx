import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";

export function PracusQuote({
  quote,
  context,
}: {
  quote: string;
  context?: string;
}) {
  return (
    <figure className="my-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
      <PracusBrandImage
        variant="icon-circle"
        size={64}
        className="h-14 w-14 shrink-0"
      />
      <div className="flex-1 rounded-2xl border border-[color:var(--ink)]/10 bg-[color:var(--cream-soft)] p-5">
        <blockquote className="font-display text-[1.1rem] font-semibold italic leading-snug text-[color:var(--ink)]">
          &bdquo;{quote}&rdquo;
        </blockquote>
        {context ? (
          <figcaption className="mono-label mt-3 text-[color:var(--ink-muted)]">
            — Pracuś AI {context ? `· ${context}` : ""}
          </figcaption>
        ) : (
          <figcaption className="mono-label mt-3 text-[color:var(--ink-muted)]">
            — Pracuś AI
          </figcaption>
        )}
      </div>
    </figure>
  );
}
