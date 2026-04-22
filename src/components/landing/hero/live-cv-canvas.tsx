"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";

type Line = { label: string; value: string; accent?: boolean };
type Keyword = { text: string; hint?: string };

type Persona = {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  company: string;
  lines: Line[];
  keywords: Keyword[];
  matchScore: number;
};

const PERSONAS: Persona[] = [
  {
    id: "magazynier",
    name: "Tomasz Kowalski",
    role: "Magazynier",
    roleLabel: "Team Leader · Magazyn",
    company: "Amazon Poznań",
    lines: [
      { label: "STANOWISKO", value: "Starszy magazynier / Team Lead", accent: true },
      { label: "DOŚWIADCZENIE", value: "Amazon FC · 2022 — obecnie" },
      { label: "UPRAWNIENIA", value: "UDT — wózki widłowe czołowe i boczne" },
      { label: "OSIĄGNIĘCIE", value: "Obniżył błędy wysyłek o 32% w 6 miesięcy", accent: true },
      { label: "SYSTEM", value: "SAP EWM · WMS · Skanery 2D" },
      { label: "ZESPÓŁ", value: "Koordynuje 8 osób na zmianie nocnej" },
    ],
    keywords: [
      { text: "UDT ✓", hint: "uprawnienie" },
      { text: "SAP EWM ✓", hint: "system WMS" },
      { text: "Team Lead ✓", hint: "doświadczenie" },
      { text: "BHP ✓", hint: "procedura" },
      { text: "-32% błędów ✓", hint: "osiągnięcie" },
      { text: "CMR / WZ ✓", hint: "dokumentacja" },
    ],
    matchScore: 94,
  },
  {
    id: "spawacz",
    name: "Krzysztof Roman",
    role: "Spawacz",
    roleLabel: "MIG/MAG · TIG",
    company: "Solaris Bus",
    lines: [
      { label: "STANOWISKO", value: "Spawacz konstrukcji stalowych", accent: true },
      { label: "DOŚWIADCZENIE", value: "15 lat · konstrukcje autobusowe" },
      { label: "CERTYFIKATY", value: "EN ISO 9606-1 · MIG/MAG 135 · TIG 141", accent: true },
      { label: "MATERIAŁY", value: "Stal konstrukcyjna, nierdzewka, aluminium" },
      { label: "PROJEKTY", value: "Ramy podwozia Solaris Urbino 18" },
      { label: "JĘZYK", value: "Niemiecki B2 — komunikacja techniczna" },
    ],
    keywords: [
      { text: "MIG/MAG ✓", hint: "metoda 135" },
      { text: "TIG ✓", hint: "metoda 141" },
      { text: "ISO 9606 ✓", hint: "certyfikat" },
      { text: "Nierdzewka ✓", hint: "materiał" },
      { text: "15 lat ✓", hint: "senioritet" },
      { text: "Niem. B2 ✓", hint: "język" },
    ],
    matchScore: 91,
  },
  {
    id: "kasjerka",
    name: "Anna Wiśniewska",
    role: "Kierownik zmiany",
    roleLabel: "Handel detaliczny",
    company: "Lidl Polska",
    lines: [
      { label: "STANOWISKO", value: "Kierowniczka zmiany / Kasjerka senior", accent: true },
      { label: "DOŚWIADCZENIE", value: "Lidl · 8 lat · awans 2024" },
      { label: "SKALA", value: "200+ klientów dziennie, zmiana 8h" },
      { label: "OSIĄGNIĘCIE", value: "Wdrożyła procedurę inwentaryzacji", accent: true },
      { label: "ZESPÓŁ", value: "Koordynuje 12 osób w sklepie" },
      { label: "KASA", value: "Obsługa kasy fiskalnej + SCO" },
    ],
    keywords: [
      { text: "Kasa fisk. ✓", hint: "obsługa" },
      { text: "Awans ✓", hint: "wynik" },
      { text: "Team 12 ✓", hint: "zarządzanie" },
      { text: "Inwent. ✓", hint: "proces" },
      { text: "200/dzień ✓", hint: "skala" },
      { text: "SCO ✓", hint: "samoobsługa" },
    ],
    matchScore: 89,
  },
];

const STATUS_MESSAGES = [
  "Pracuś czyta CV…",
  "Dopasowuje słowa ATS…",
  "Redaguje opis…",
  "Podświetla osiągnięcia…",
  "Finalizuje sekcję…",
];

export function LiveCvCanvas() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [personaIdx, setPersonaIdx] = useState(0);
  const [typed, setTyped] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<string>("");
  const [statusIdx, setStatusIdx] = useState(0);
  const [revealedKeywords, setRevealedKeywords] = useState(0);
  const [matchVisible, setMatchVisible] = useState(false);

  const persona = PERSONAS[personaIdx];

  // Parallax tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 140, damping: 22 });
  const sy = useSpring(ry, { stiffness: 140, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5]);

  // Rotating status chip
  useEffect(() => {
    const id = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  // Deterministic persona rotation — independent of typewriter timing
  // Ensures rotation ALWAYS fires even if typewriter stalls on any device.
  useEffect(() => {
    const id = window.setInterval(() => {
      setPersonaIdx((i) => (i + 1) % PERSONAS.length);
    }, 14000);
    return () => window.clearInterval(id);
  }, []);

  // Typewriter — per persona. Uses `cancelled` flag to prevent stale
  // closures from setting state after cleanup (fixes React StrictMode
  // double-invocation duplication and setInterval race).
  useEffect(() => {
    let cancelled = false;
    setTyped([]);
    setCurrentLine("");
    setRevealedKeywords(0);
    setMatchVisible(false);

    let lineIdx = 0;
    let charIdx = 0;
    let keywordIdx = 0;

    const scheduleKeywordReveal = () => {
      if (keywordIdx < persona.keywords.length) {
        keywordIdx++;
        if (!cancelled) setRevealedKeywords(keywordIdx);
      }
    };

    const typeNext = () => {
      if (cancelled) return;
      if (lineIdx >= persona.lines.length) {
        setMatchVisible(true);
        return;
      }

      const target = persona.lines[lineIdx].value;
      if (charIdx < target.length) {
        charIdx++;
        setCurrentLine(target.slice(0, charIdx));
        window.setTimeout(typeNext, 14 + Math.random() * 22);
      } else {
        // Finalize this line and move to next
        const finishedLine = persona.lines[lineIdx];
        lineIdx++;
        charIdx = 0;
        setCurrentLine("");
        setTyped((t) => [...t, finishedLine]);
        scheduleKeywordReveal();
        window.setTimeout(typeNext, 280);
      }
    };

    window.setTimeout(typeNext, 350);
    return () => { cancelled = true; };
  }, [personaIdx, persona]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = canvasRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rx.set((e.clientX - rect.left) / rect.width - 0.5);
    ry.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const pendingEntry = persona.lines[typed.length];
  const currentLabel = pendingEntry?.label ?? "";
  const currentAccent = pendingEntry?.accent ?? false;

  return (
    <div
      className="relative w-full [perspective:2000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating agent status badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute -top-3 left-4 z-20 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-[color:var(--ink)]/15 bg-[color:var(--cream)] px-3 py-1.5 shadow-[0_16px_32px_-20px_rgba(10,14,26,0.4)] sm:-top-4 sm:left-6 sm:px-4 sm:py-2"
      >
        <span className="agent-dot shrink-0" />
        <span className="mono-label whitespace-nowrap text-[color:var(--ink)]">
          {STATUS_MESSAGES[statusIdx]}
        </span>
      </motion.div>

      {/* Paper canvas */}
      <motion.div
        ref={canvasRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative min-h-[520px] w-full overflow-hidden rounded-[2px] bg-[color:var(--cream-soft)] ring-ink grain sm:aspect-[1/1.1] sm:min-h-0"
      >
        {/* Paper header ink stripe */}
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-[color:var(--ink)]" />

        {/* Persona-switching content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full flex-col gap-3 px-5 pb-5 pt-9 sm:px-9 sm:pt-12"
          >
            {/* Nameplate */}
            <div className="border-b border-[color:var(--ink)]/12 pb-3">
              <p className="mono-label text-[color:var(--ink)]/50">
                CV · PRACUŚ · {persona.company.toUpperCase()}
              </p>
              <h3 className="mt-1.5 font-display text-[clamp(1.25rem,5.8vw,2rem)] font-bold leading-none tracking-tight text-[color:var(--ink)]">
                {persona.name}
              </h3>
              <p className="mt-1 font-body text-[clamp(0.8rem,3vw,0.9rem)] text-[color:var(--ink)]/65">
                <span className="font-semibold text-[color:var(--ink)]">
                  {persona.role}
                </span>{" "}
                · {persona.roleLabel}
              </p>
            </div>

            {/* AGENT FOUND chips — 6 per persona, 2 rows × 3 (sm+) / 3 rows × 2 (mobile) */}
            <div className="py-2">
              <span className="mono-label text-[0.65rem] text-[color:var(--ink)]/40 mb-1.5 block">
                AGENT FOUND
              </span>
              <div className="grid min-h-[4.5rem] grid-cols-2 content-start gap-1.5 sm:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {persona.keywords.slice(0, revealedKeywords).map((kw, i) => (
                    <motion.div
                      key={`${persona.id}-${kw.text}`}
                      initial={{ opacity: 0, scale: 0.8, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex min-w-0 items-center gap-1.5 rounded-full border border-[color:var(--ink)]/10 bg-[color:var(--cream)] px-2.5 py-1.5"
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--jade)]"
                      />
                      <span className="truncate font-mono text-[clamp(0.65rem,2.6vw,0.75rem)] font-semibold leading-none text-[color:var(--ink)]">
                        {kw.text}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Typed lines */}
            <div className="flex flex-1 flex-col gap-2.5 text-left">
              {typed.filter(Boolean).map((line, i) => (
                <motion.div
                  key={`${persona.id}-${i}-${line.label}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-0.5"
                >
                  <span className="mono-label text-[color:var(--ink)]/45">
                    {line.label}
                  </span>
                  <span
                    className={`font-body text-[1.05rem] leading-snug text-[color:var(--ink)] ${
                      line.accent ? "font-semibold" : ""
                    }`}
                  >
                    {line.value}
                  </span>
                </motion.div>
              ))}

              {currentLine && (
                <div className="flex flex-col gap-0.5">
                  <span className="mono-label text-[color:var(--ink)]/45">
                    {currentLabel}
                  </span>
                  <span
                    className={`font-body text-[1.05rem] leading-snug text-[color:var(--ink)] ${
                      currentAccent ? "font-semibold" : ""
                    }`}
                  >
                    {Array.from(currentLine).map((ch, idx) => (
                      <motion.span
                        key={`${persona.id}-${typed.length}-${idx}`}
                        initial={{ opacity: 0, y: 6, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="inline-block"
                      >
                        {ch === " " ? "\u00A0" : ch}
                      </motion.span>
                    ))}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.85, repeat: Infinity }}
                      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[color:var(--ink)]/70"
                    />
                  </span>
                </div>
              )}
            </div>

            {/* ATS matching bar */}
            <div className="mt-auto flex flex-col gap-2 border-t border-[color:var(--ink)]/12 pt-4">
              <div className="flex items-center justify-between">
                <span className="mono-label text-[color:var(--ink)]/55">
                  ATS MATCH SCORE
                </span>
                <motion.span
                  key={`score-${persona.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: matchVisible ? 1 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="font-display text-[1.1rem] font-bold tabular-nums text-[color:var(--ink)]"
                >
                  {persona.matchScore}%
                </motion.span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-[color:var(--ink)]/10">
                <motion.div
                  key={`bar-${persona.id}`}
                  initial={{ width: "0%" }}
                  animate={{ width: matchVisible ? `${persona.matchScore}%` : "0%" }}
                  transition={{
                    duration: 1.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-y-0 left-0 bg-[color:var(--saffron)]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="mono-label text-[color:var(--ink)]/40">
                  0{personaIdx + 1} / agentcv.pl
                </span>
                <span className="mono-label text-[color:var(--ink)]/40">
                  ATS ✓ · RODO ✓
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Decorative saffron highlight stroke */}
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -left-10 -bottom-6 -z-10 h-40 w-40 text-[color:var(--saffron)]"
      >
        <motion.path
          d="M20 200 C 80 60, 320 60, 380 200"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Decorative dashed line top-right */}
      <svg
        aria-hidden
        viewBox="0 0 120 120"
        className="pointer-events-none absolute -right-4 -top-8 -z-10 h-24 w-24 text-[color:var(--ink)]/25"
      >
        <motion.path
          d="M10 10 L 110 60 M 20 40 L 90 100 M 40 10 L 110 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
        />
      </svg>
    </div>
  );
}
