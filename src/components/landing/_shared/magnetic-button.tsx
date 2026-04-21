"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "ink" | "cream" | "saffron" | "ghost-ink" | "ghost-cream";
type Size = "sm" | "md" | "lg";

type MagneticButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  strength?: number;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const variantClasses: Record<Variant, string> = {
  ink: "bg-[var(--ink)] text-[var(--cream)] hover:bg-[color:var(--ink-soft)]",
  cream: "bg-[var(--cream)] text-[var(--ink)] hover:bg-[color:var(--cream-deep)]",
  saffron: "bg-[var(--saffron)] text-[var(--ink)] hover:bg-[color:var(--saffron-soft)]",
  "ghost-ink":
    "bg-transparent text-[var(--ink)] border border-[color:var(--ink)]/20 hover:bg-[color:var(--ink)]/5",
  "ghost-cream":
    "bg-transparent text-[var(--cream)] border border-[color:var(--cream)]/25 hover:bg-[color:var(--cream)]/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-5 text-[0.875rem]",
  md: "h-12 px-7 text-[0.95rem]",
  lg: "h-14 px-9 text-[1rem]",
};

export function MagneticButton({
  href,
  onClick,
  variant = "ink",
  size = "md",
  children,
  className,
  strength = 0.25,
  type = "button",
  disabled = false,
  ...rest
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.6 });
  const innerX = useTransform(sx, (v) => v * 0.5);
  const innerY = useTransform(sy, (v) => v * 0.5);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    x.set(mx * strength);
    y.set(my * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cream)]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      <motion.span
        style={{ x: innerX, y: innerY }}
        className="relative inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex">
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex disabled:cursor-not-allowed disabled:opacity-60"
      type={type}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
