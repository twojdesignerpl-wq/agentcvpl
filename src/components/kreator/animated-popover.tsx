"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Align = "center" | "start" | "end";

type Props = {
  open: boolean;
  align?: Align;
  className?: string;
  /** Border-radius dla clip-path animacji — musi pasować do rounded-* w className.
   *  Default: "1rem" (= rounded-2xl) */
  cornerRadius?: string;
  children: ReactNode;
} & Pick<HTMLAttributes<HTMLDivElement>, "role" | "aria-label" | "aria-labelledby">;

const ALIGN_CLASS: Record<Align, string> = {
  center: "left-1/2 -translate-x-1/2 origin-top",
  start: "left-0 origin-top-left",
  end: "right-0 origin-top-right",
};

const EASE_OUT_CRAFT = [0.23, 1, 0.32, 1] as const;

export function AnimatedPopover({
  open,
  align = "center",
  className,
  cornerRadius = "1rem",
  children,
  role = "dialog",
  ...rest
}: Props) {
  const reduce = useReducedMotion();

  // clipPath musi mieć `round <radius>` żeby zachować rounded corners
  // podczas i po animacji (rectangular inset łamie border-radius).
  const clipFull = `inset(0 0 0% 0 round ${cornerRadius})`;
  const clipHidden = `inset(0 0 100% 0 round ${cornerRadius})`;
  const clipExit = `inset(0 0 55% 0 round ${cornerRadius})`;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role={role}
          {...rest}
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: -8, clipPath: clipHidden }
          }
          animate={
            reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, clipPath: clipFull }
          }
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.12 } }
              : {
                  opacity: 0,
                  y: -4,
                  clipPath: clipExit,
                  transition: { duration: 0.13, ease: EASE_OUT_CRAFT },
                }
          }
          transition={{ duration: 0.2, ease: EASE_OUT_CRAFT }}
          style={{ willChange: "transform, opacity, clip-path" }}
          className={cn("absolute top-full z-40 mt-1", ALIGN_CLASS[align], className)}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
