"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDown, Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  title: string;
  count?: number;
  icon: Icon;
  visible?: boolean;
  onToggleVisible?: (next: boolean) => void;
  defaultOpen?: boolean;
  children: ReactNode;
};

const EASE = [0.32, 0.72, 0, 1] as const;

export function MobileSectionAccordion({
  id,
  title,
  count,
  icon: IconCmp,
  visible = true,
  onToggleVisible,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLElement>(null);
  const contentId = `mobile-section-${id}`;
  const anchorId = `section-${id}`;

  const handleToggle = () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && sectionRef.current) {
      // Offset dla top-bar (48px) + jump-bar (~44px) + trochę oddechu
      const OFFSET = 104;
      requestAnimationFrame(() => {
        const top =
          sectionRef.current!.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id={anchorId}
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-2xl border bg-[color:var(--cream-soft)] transition-colors",
        open
          ? "border-[color:color-mix(in_oklab,var(--ink)_22%,transparent)]"
          : "border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)]",
      )}
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={open}
          aria-controls={contentId}
          className="tap-target flex flex-1 items-center gap-3 px-4 py-3 text-left active:scale-[0.995]"
        >
          <span
            aria-hidden
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
              visible
                ? "bg-[color:color-mix(in_oklab,var(--saffron)_22%,transparent)] text-[color:var(--ink)]"
                : "bg-[color:color-mix(in_oklab,var(--ink)_6%,transparent)] text-[color:color-mix(in_oklab,var(--ink)_45%,transparent)]",
            )}
          >
            <IconCmp size={18} weight={visible ? "fill" : "regular"} />
          </span>
          <span className="flex min-w-0 flex-1 items-baseline gap-2">
            <span
              className={cn(
                "font-display text-[1rem] font-semibold tracking-tight",
                visible ? "text-ink" : "text-[color:color-mix(in_oklab,var(--ink)_55%,transparent)]",
              )}
            >
              {title}
            </span>
            {typeof count === "number" ? (
              <span className="mono-label text-[0.58rem] text-[color:var(--ink-muted)]">
                {count}
              </span>
            ) : null}
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="inline-flex size-7 items-center justify-center text-[color:var(--ink-muted)]"
          >
            <CaretDown size={14} weight="bold" />
          </motion.span>
        </button>
        {onToggleVisible ? (
          <button
            type="button"
            onClick={() => onToggleVisible(!visible)}
            aria-label={visible ? `Ukryj sekcję ${title}` : `Pokaż sekcję ${title}`}
            className="tap-target -ml-1 mr-2 inline-flex items-center justify-center rounded-full text-[color:color-mix(in_oklab,var(--ink)_55%,transparent)] transition-colors hover:text-ink"
          >
            {visible ? <Eye size={16} weight="regular" /> : <EyeSlash size={16} weight="regular" />}
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] px-4 pt-3 pb-4">
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
