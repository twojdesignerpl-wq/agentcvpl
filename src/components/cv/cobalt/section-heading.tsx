import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
};

export function CobaltSectionHeading({ children, className, size = "lg" }: Props) {
  return (
    <h2
      className={cn(
        "cobalt-display font-extrabold leading-tight text-[color:var(--cv-ink)]",
        size === "lg"
          ? "text-[calc(var(--cv-font-size)*1.55)] mb-[1.4mm]"
          : "text-[calc(var(--cv-font-size)*1.15)] mb-[1mm]",
        className,
      )}
    >
      {children}
    </h2>
  );
}
