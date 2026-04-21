"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { BRAND } from "@/lib/landing/brand";
import { MagneticButton } from "./_shared/magnetic-button";
import { UserMenu } from "@/components/auth/user-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "backdrop-blur-xl backdrop-saturate-150 bg-[color:var(--cream)]/75 border-b border-[color:var(--ink)]/10"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[var(--content-max)] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-baseline gap-1.5">
          <span className="font-display text-[1.5rem] font-bold leading-none tracking-tight text-[color:var(--ink)]">
            agentcv
          </span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[color:var(--saffron)] transition-transform duration-300 group-hover:scale-125"
          />
          <span className="mono-label text-[0.65rem] text-[color:var(--ink)]/50">.pl</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {BRAND.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-body text-[0.9rem] font-medium text-[color:var(--ink)]/75 transition-colors hover:text-[color:var(--ink)]"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-[color:var(--saffron)] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <UserMenu variant="light" />
          <MagneticButton href="/kreator" variant="ink" size="sm">
            Stwórz CV →
          </MagneticButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--ink)]/15 text-[color:var(--ink)]"
        >
          {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="lg:hidden fixed inset-0 top-16 bg-[color:var(--cream)] grain"
        >
          <div className="relative flex h-[calc(100dvh-4rem)] flex-col justify-between px-6 py-10">
            <nav className="flex flex-col gap-6">
              {BRAND.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-[2.5rem] font-semibold tracking-tight text-[color:var(--ink)]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-4 pb-8">
              <MagneticButton href="/kreator" variant="ink" size="lg" className="w-full">
                Stwórz CV za darmo →
              </MagneticButton>
              <p className="mono-label text-center text-[color:var(--ink)]/50">
                Pierwsze CV bez karty
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
