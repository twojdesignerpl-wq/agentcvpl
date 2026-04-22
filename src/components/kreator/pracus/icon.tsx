"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  size?: number;
  online?: boolean;
  /** "mini" = uproszczony (<24px), głowa + 1 gogle bez bridge, bez anteny/pióra.
   *  "compact" = sama głowa robota (default, do avatarów i headerów).
   *  "full" = głowa + pióro + pergamin (do WelcomeCard, splash). */
  variant?: "mini" | "compact" | "full";
  className?: string;
};

/**
 * Pracuś AI mark — robot-rekruter z saffron goglami "AI", piórem i zwiniętym pergaminem.
 * Odpowiada identyfikacji wizualnej z `Pracuś AI.png` (wariant app-icon — cream tło,
 * głowa robota + drobna laska pióra).
 *
 * - Zaokrąglony kwadrat cream jako tło (app-icon look), ink jako kontur.
 * - Antena (3 krótkie kreski) na czubku, "gogle" saffron, boczne "uszy" saffron.
 * - Grot pióra saffron pod głową.
 * - Online dot (pulsująca saffron kropka) — sygnał aktywnego agenta.
 */
export function PracusMark({
  size = 40,
  online = false,
  variant = "compact",
  className,
}: Props) {
  const reduced = useReducedMotion();

  // Mini variant — rozpoznawalny Pracuś AI w małych rozmiarach (22–28px).
  // Zachowuje 2 saffron gogle (signature) + grot pióra — pomija antenę (za cienka w 22px).
  if (variant === "mini") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        role="img"
        aria-label="Pracuś AI"
      >
        {/* Głowa — zaokrąglony prostokąt na cream tle */}
        <rect
          x="2.4"
          y="3.6"
          width="19.2"
          height="11.6"
          rx="3.6"
          fill="var(--cream)"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
        {/* Uszy — saffron kropki po bokach */}
        <circle cx="1.8" cy="9.4" r="1" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="0.7" />
        <circle cx="22.2" cy="9.4" r="1" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="0.7" />
        {/* Gogle AI — dwa saffron okręgi (signature) */}
        <circle cx="8.4" cy="9.4" r="2.1" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="1.1" />
        <circle cx="15.6" cy="9.4" r="2.1" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="1.1" />
        {/* Bridge między goglami */}
        <rect x="10.3" y="8.9" width="3.4" height="1" rx="0.5" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="0.6" />
        {/* Grot pióra pod głową — trójkąt saffron */}
        <path
          d="M 8.6 15.6 L 15.4 15.6 L 12 21.4 Z"
          fill="var(--saffron)"
          stroke="var(--ink)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {online ? (
          <circle cx="20.8" cy="20.4" r="2.1" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="1" />
        ) : null}
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Pracuś AI"
    >
      {/* Tło — zaokrąglony kwadrat cream (app-icon style) */}
      <rect width="40" height="40" rx="11" fill="var(--cream)" />
      <rect
        x="0.6"
        y="0.6"
        width="38.8"
        height="38.8"
        rx="10.4"
        fill="none"
        stroke="color-mix(in oklab, var(--ink) 8%, transparent)"
        strokeWidth="0.8"
      />

      {/* Antena — 3 krótkie kreski na czubku głowy */}
      <rect x="16.8" y="4.6" width="1.2" height="3.4" rx="0.5" fill="var(--ink)" />
      <rect x="19.4" y="4.6" width="1.2" height="3.4" rx="0.5" fill="var(--ink)" />
      <rect x="22" y="4.6" width="1.2" height="3.4" rx="0.5" fill="var(--ink)" />

      {/* Głowa robota — zaokrąglony prostokąt konturowy */}
      <rect
        x="7.2"
        y="8.2"
        width="25.6"
        height="15.6"
        rx="4.6"
        fill="var(--cream)"
        stroke="var(--ink)"
        strokeWidth="1.7"
      />

      {/* Uszy — małe saffron kropki po bokach głowy */}
      <circle cx="5.8" cy="16" r="1.5" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="0.8" />
      <circle cx="34.2" cy="16" r="1.5" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="0.8" />

      {/* Gogle "AI" — dwa okręgi saffron + thin bridge */}
      <circle cx="14.6" cy="16" r="3.2" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="1.2" />
      <circle cx="25.4" cy="16" r="3.2" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="1.2" />
      <rect x="17.4" y="15.2" width="5.2" height="1.6" rx="0.8" fill="var(--saffron)" stroke="var(--ink)" strokeWidth="0.7" />

      {/* Kołnierz — delikatny pasek pod głową */}
      <rect x="17.4" y="23.4" width="5.2" height="1.4" rx="0.6" fill="var(--ink)" />

      {/* Grot pióra — trójkątny kształt saffron z ink konturem */}
      <path
        d="M 15.4 25.4 L 24.6 25.4 L 20 35.2 Z"
        fill="var(--saffron)"
        stroke="var(--ink)"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* Centralna kreska grotu */}
      <line
        x1="20"
        y1="25.6"
        x2="20"
        y2="34.6"
        stroke="var(--ink)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* Opcjonalnie: pergamin pod piórem (wariant "full") */}
      {variant === "full" ? (
        <g>
          <path
            d="M 4 30 Q 6 29 8 30 L 33 30 L 36 33 L 6 33 Q 4 32 4 30 Z"
            fill="var(--cream)"
            stroke="var(--ink)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <line x1="10" y1="31.5" x2="22" y2="31.5" stroke="var(--ink)" strokeWidth="0.6" />
        </g>
      ) : null}

      {/* Online dot — pulsujący saffron w prawym dolnym rogu */}
      {online ? (
        !reduced ? (
          <motion.circle
            cx={32.5}
            cy={32.5}
            r={3.6}
            fill="var(--saffron)"
            stroke="var(--ink)"
            strokeWidth={1.6}
            animate={{ scale: [1, 1.12, 1], opacity: [1, 0.88, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "32.5px 32.5px" }}
          />
        ) : (
          <circle cx={32.5} cy={32.5} r={3.6} fill="var(--saffron)" stroke="var(--ink)" strokeWidth={1.6} />
        )
      ) : null}
    </svg>
  );
}
