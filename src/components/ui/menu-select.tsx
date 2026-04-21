"use client";

import { useEffect, useRef, useState, useId, type ReactNode, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;
const PANEL_RADIUS = "1rem";

export type MenuOption<V extends string> = {
  value: V;
  label: string;
  description?: string;
  /** Inline style applied to the option label (np. fontFamily preview). */
  previewStyle?: CSSProperties;
};

type Props<V extends string> = {
  value: V;
  options: ReadonlyArray<MenuOption<V>>;
  onChange: (next: V) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  triggerClassName?: string;
  renderTrigger?: (opt: MenuOption<V> | undefined) => ReactNode;
  menuWidth?: number;
  menuMaxHeight?: number;
  align?: "start" | "end";
  disabled?: boolean;
};

export function MenuSelect<V extends string>({
  value,
  options,
  onChange,
  placeholder = "—",
  ariaLabel,
  className,
  triggerClassName,
  renderTrigger,
  menuWidth,
  menuMaxHeight = 280,
  align = "start",
  disabled = false,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const labelId = useId();

  const current = options.find((o) => o.value === value);
  const currentIdx = options.findIndex((o) => o.value === value);

  function openMenu() {
    setFocusIdx(currentIdx >= 0 ? currentIdx : 0);
    setOpen(true);
  }

  function toggleMenu() {
    if (open) {
      setOpen(false);
    } else {
      openMenu();
    }
  }

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIdx((i) => Math.min(options.length - 1, i + 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        setFocusIdx(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        setFocusIdx(options.length - 1);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        if (focusIdx >= 0 && focusIdx < options.length) {
          e.preventDefault();
          onChange(options[focusIdx].value);
          setOpen(false);
          triggerRef.current?.focus();
        }
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, options, onChange, focusIdx]);

  useEffect(() => {
    if (!open || focusIdx < 0) return;
    const item = scrollRef.current?.querySelector<HTMLElement>(
      `[data-menu-item="${focusIdx}"]`,
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [open, focusIdx]);

  const clipFull = `inset(0 0 0% 0 round ${PANEL_RADIUS})`;
  const clipHidden = `inset(0 0 100% 0 round ${PANEL_RADIUS})`;
  const clipExit = `inset(0 0 60% 0 round ${PANEL_RADIUS})`;

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (disabled) return;
          toggleMenu();
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={ariaLabel ? undefined : labelId}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          "inline-flex w-full cursor-pointer items-center justify-between gap-2 transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)] disabled:cursor-not-allowed disabled:opacity-50",
          triggerClassName,
        )}
      >
        <span className="min-w-0 flex-1 truncate text-left" id={labelId}>
          {renderTrigger ? renderTrigger(current) : current?.label ?? placeholder}
        </span>
        <CaretDown
          aria-hidden
          size={11}
          weight="bold"
          className={cn(
            "shrink-0 text-[color:var(--ink)]/60 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            role="listbox"
            aria-label={ariaLabel}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -6, clipPath: clipHidden }
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
                    y: -3,
                    clipPath: clipExit,
                    transition: { duration: 0.13, ease: EASE },
                  }
            }
            transition={{ duration: 0.18, ease: EASE }}
            style={{
              willChange: "transform, opacity, clip-path",
              width: menuWidth,
              borderRadius: PANEL_RADIUS,
            }}
            className={cn(
              "absolute top-full z-50 mt-1.5 border border-[color:color-mix(in_oklab,var(--ink)_12%,transparent)] bg-card shadow-[0_16px_48px_-16px_rgba(10,14,26,0.24),0_2px_8px_-4px_rgba(10,14,26,0.08)]",
              align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            )}
          >
            <div
              ref={scrollRef}
              className="menu-scroll p-1"
              style={{ maxHeight: menuMaxHeight, overflowY: "auto", borderRadius: PANEL_RADIUS }}
            >
              {options.map((opt, idx) => {
                const isActive = opt.value === value;
                const isFocused = idx === focusIdx;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-menu-item={idx}
                    onMouseEnter={() => setFocusIdx(idx)}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={cn(
                      "group flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-colors duration-100 ease-out",
                      isFocused && !isActive && "bg-[color:color-mix(in_oklab,var(--ink)_5%,transparent)]",
                      isActive
                        ? "bg-[color:color-mix(in_oklab,var(--saffron)_18%,transparent)] text-[color:var(--ink)]"
                        : "text-[color:var(--ink)]",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate" style={opt.previewStyle}>
                      <span className="block font-medium">{opt.label}</span>
                      {opt.description ? (
                        <span className="mt-0.5 block text-[10px] text-[color:var(--ink-muted)]">
                          {opt.description}
                        </span>
                      ) : null}
                    </span>
                    {isActive ? (
                      <Check
                        aria-hidden
                        size={12}
                        weight="bold"
                        className="shrink-0 text-[color:var(--saffron)]"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
