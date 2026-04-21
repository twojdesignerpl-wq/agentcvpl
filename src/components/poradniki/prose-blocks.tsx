import { cn } from "@/lib/utils";
import type { PoradnikBlock } from "@/lib/poradniki/data";
import { InlineCTA } from "./inline-cta";
import { PracusTip } from "./pracus-tip";
import { PracusQuote } from "./pracus-quote";

export function ProseBlocks({ blocks }: { blocks: ReadonlyArray<PoradnikBlock> }) {
  return (
    <div className="prose-agentcv">
      {blocks.map((block, idx) => {
        const key = `block-${idx}`;
        switch (block.kind) {
          case "h2":
            return (
              <h2 key={key} id={block.id}>
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={key} id={block.id}>
                {block.text}
              </h3>
            );
          case "p":
            return <p key={key}>{block.text}</p>;
          case "ul":
            return (
              <ul key={key}>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key}>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={key}>
                <p className="whitespace-pre-line">{block.text}</p>
                {block.cite ? <cite>— {block.cite}</cite> : null}
              </blockquote>
            );
          case "callout": {
            const tone = block.tone ?? "saffron";
            return (
              <aside
                key={key}
                className={cn(
                  "my-6 rounded-xl border p-5",
                  tone === "saffron" &&
                    "border-[color:var(--saffron)]/40 bg-[color:color-mix(in_oklab,var(--saffron)_10%,var(--cream-soft))]",
                  tone === "jade" &&
                    "border-[color:var(--jade)]/40 bg-[color:color-mix(in_oklab,var(--jade)_8%,var(--cream-soft))]",
                  tone === "rust" &&
                    "border-[color:var(--rust)]/40 bg-[color:color-mix(in_oklab,var(--rust)_8%,var(--cream-soft))]",
                )}
              >
                <p className="mono-label mb-1.5 text-[color:var(--ink)]">{block.title}</p>
                <p className="font-body text-[0.95rem] leading-relaxed text-[color:var(--ink-soft)]">
                  {block.text}
                </p>
              </aside>
            );
          }
          case "inlineCta":
            return (
              <InlineCTA
                key={key}
                headline={block.headline}
                subhead={block.subhead}
                utmCampaign={block.utmCampaign}
              />
            );
          case "pracusTip":
            return (
              <PracusTip key={key} title={block.title}>
                {block.text}
              </PracusTip>
            );
          case "pracusQuote":
            return <PracusQuote key={key} quote={block.quote} context={block.context} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
