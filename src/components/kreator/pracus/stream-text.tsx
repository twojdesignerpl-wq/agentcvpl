"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Direct-DOM streaming renderer.
 *
 * KLUCZ DO PŁYNNOŚCI: React NIE re-renderuje komponentu na każdym tokenie.
 * Zamiast trzymać `display` w `useState` (re-render cały sub-tree + markdown parse + scroll jump
 * na każdy token), trzymamy pozycję w `useRef` i mutujemy `textContent` przez bezpośrednią
 * referencję do elementu DOM w pętli requestAnimationFrame.
 *
 * - AI SDK pompuje target text przez prop (zmiana to zwykły React re-render dla tego parent,
 *   ale NIE komponentu StreamText — on jest memoized poprzez architekturę props: target ref).
 * - Pętla RAF działa ciągle dopóki element zamontowany, i synchronizuje `textContent` z targetem.
 * - Adaptacyjne tempo: 2–40 chars per frame w zależności od długu. 60fps → gładkie.
 * - Zachowuje whitespace i newliny (white-space: pre-wrap).
 * - Formatowanie (bold/italic) ignorowane podczas streamingu — po zakończeniu rodzic przełącza
 *   na pełny MarkdownRenderer, który wyrenderuje finalny format RAZ.
 */
export function StreamText({ target }: { target: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef(0);
  const targetRef = useRef(target);
  const reduced = useReducedMotion() ?? false;

  // Sync target do refa poza renderem — pętla RAF zawsze czyta najnowszą wartość.
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    // Reduced motion — pokaż od razu cały target, bez animacji.
    if (reduced) {
      el.textContent = targetRef.current;
      posRef.current = targetRef.current.length;
      return;
    }

    let raf = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const t = targetRef.current;
      let pos = posRef.current;

      // Regenerate / target się skurczył — zresetuj pozycję.
      if (t.length < pos) {
        pos = t.length;
        posRef.current = pos;
        el.textContent = t;
      } else if (pos < t.length) {
        const diff = t.length - pos;
        const step = Math.max(2, Math.min(40, Math.ceil(diff / 12)));
        pos = Math.min(pos + step, t.length);
        posRef.current = pos;
        el.textContent = t.slice(0, pos);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <span
      ref={spanRef}
      className="whitespace-pre-wrap leading-relaxed"
      data-stream-text
    />
  );
}
