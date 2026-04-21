import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function TerraSectionHeading({ children, className }: Props) {
  return (
    <h2
      className={cn(
        "mb-[1em] font-semibold uppercase tracking-[0.22em]",
        "text-[calc(var(--cv-font-size)*0.88)]",
        "text-[color:var(--cv-accent)]",
        className,
      )}
    >
      {children}
    </h2>
  );
}
