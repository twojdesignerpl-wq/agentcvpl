import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
};

export function LumenSectionHeading({ children, className, size = "lg" }: Props) {
  return (
    <h2
      className={cn(
        "lumen-display leading-[1.05] text-[color:var(--cv-ink)]",
        size === "lg"
          ? "text-[calc(var(--cv-font-size)*1.55)]"
          : "text-[calc(var(--cv-font-size)*1.2)]",
        className,
      )}
    >
      {children}
    </h2>
  );
}
