import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  underline?: boolean;
};

export function AtlasSectionHeading({ children, className, underline = false }: Props) {
  return (
    <div className={cn("mb-[0.9em]", className)}>
      <h2 className="text-[calc(var(--cv-font-size)*1.2)] font-bold leading-tight tracking-[-0.005em] text-[color:var(--cv-ink)]">
        {children}
      </h2>
      {underline ? (
        <div className="mt-[0.4em] h-px w-full bg-[color:var(--cv-line)]" />
      ) : null}
    </div>
  );
}
