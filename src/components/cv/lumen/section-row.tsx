import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LumenSectionHeading } from "./section-heading";

type Props = {
  heading: string;
  children: ReactNode;
  className?: string;
  /** Hide heading column (still preserves grid alignment) */
  bare?: boolean;
};

/**
 * Lumen 2-col grid: heading left (~26%), content right.
 * Wszystkie sekcje używają tej samej struktury dla spójności.
 */
export function LumenSectionRow({ heading, children, className, bare = false }: Props) {
  return (
    <section
      data-cv-section={`lumen-${heading.toLowerCase()}`}
      className={cn("grid grid-cols-[26%_1fr] gap-x-[5mm] gap-y-[2mm]", className)}
    >
      <div>
        {!bare ? <LumenSectionHeading>{heading}</LumenSectionHeading> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
