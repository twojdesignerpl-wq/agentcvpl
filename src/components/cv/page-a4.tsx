"use client";

import {
  forwardRef,
  type CSSProperties,
  type ForwardedRef,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";
import { FONT_FAMILY_STACKS, type CVSettings } from "@/lib/cv/schema";

type Props = {
  children: ReactNode;
  footer?: ReactNode;
  /** Pełnoekranowe dekoracje renderowane absolutnie pod content (np. SVG blobs) */
  decorations?: ReactNode;
  settings: CVSettings;
  bodyRef?: Ref<HTMLDivElement>;
  effectiveFontSize?: number;
  scale?: number;
  className?: string;
};

export const PageA4 = forwardRef<HTMLDivElement, Props>(function PageA4(
  { children, footer, decorations, settings, bodyRef, effectiveFontSize, scale = 1, className },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const fs = effectiveFontSize ?? settings.fontSize;
  const style: CSSProperties = {
    ["--cv-font-size" as unknown as string]: `${fs}pt`,
    ["--cv-font-family" as unknown as string]: FONT_FAMILY_STACKS[settings.fontFamily],
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: scale !== 1 ? "top center" : undefined,
  };

  return (
    <div
      ref={ref}
      data-cv-page
      className={cn(
        "cv-scope relative block",
        "w-[210mm] h-[297mm] shrink-0 overflow-hidden",
        "shadow-[0_18px_36px_-24px_rgba(10,14,26,0.12),0_1px_3px_-2px_rgba(10,14,26,0.05)]",
        "ring-1 ring-black/[0.04]",
        className,
      )}
      style={style}
    >
      {decorations ? (
        <div data-cv-decorations className="pointer-events-none absolute inset-0 z-0">
          {decorations}
        </div>
      ) : null}
      <div
        ref={bodyRef}
        data-cv-body
        className="absolute top-[12mm] z-10 overflow-hidden px-[3px]"
        style={{
          left: "calc(14mm - 3px)",
          right: "calc(14mm - 3px)",
          bottom: footer ? "18mm" : "8mm",
        }}
      >
        {children}
      </div>
      {footer ? (
        <div
          data-cv-footer
          className="absolute bottom-[8mm] z-10 px-[3px]"
          style={{ left: "calc(14mm - 3px)", right: "calc(14mm - 3px)" }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
});
