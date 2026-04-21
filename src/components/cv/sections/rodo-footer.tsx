"use client";

import { useCVStore } from "@/lib/cv/store";
import { buildRodoText } from "@/lib/cv/rodo";

export function RodoFooter() {
  const rodo = useCVStore((s) => s.cv.rodo);
  if (rodo.type === "none") return null;
  const text = buildRodoText(rodo.type, rodo.companyName);
  if (!text) return null;

  return (
    <div
      data-cv-section="rodo"
      className="pt-[3mm] border-t border-[color:var(--cv-line-soft)] text-[calc(var(--cv-font-size)*0.72)] leading-[1.45] text-[color:var(--cv-muted)] tracking-[0]"
    >
      {text}
    </div>
  );
}
