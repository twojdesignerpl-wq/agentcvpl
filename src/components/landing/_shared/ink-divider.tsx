"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function InkDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 24"
      className={cn("h-6 w-full", className)}
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0 12 C 200 4, 400 20, 600 12 S 1000 4, 1200 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 6"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
