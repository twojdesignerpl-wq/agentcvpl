import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3";
};

export function SectionHeading({ children, className, as: Tag = "h2" }: Props) {
  return (
    <Tag
      className={cn(
        "font-bold tracking-[-0.005em] leading-tight",
        "text-[calc(var(--cv-font-size)*1.2)]",
        "mb-[1.2em]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
