"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { FONT_SIZE_MIN, FONT_SIZE_STEP } from "./schema";

const MM_TO_PX = 3.7795275591;
export const A4_HEIGHT_PX = 297 * MM_TO_PX;
export const A4_WIDTH_PX = 210 * MM_TO_PX;

type AutoFitResult = {
  effectiveFontSize: number;
  overflowed: boolean;
};

export function useAutoFit(
  userFontSize: number,
  pageRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  depsKey: string,
): AutoFitResult {
  const [state, setState] = useState<AutoFitResult>({
    effectiveFontSize: userFontSize,
    overflowed: false,
  });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;

    const measure = () => {
      let fs = userFontSize;
      page.style.setProperty("--cv-font-size", `${fs}pt`);
      void page.offsetHeight;

      const safety = 2;
      const fits = () => content.scrollHeight <= content.clientHeight + safety;

      let guard = 0;
      while (!fits() && fs - FONT_SIZE_STEP >= FONT_SIZE_MIN && guard < 48) {
        fs = Math.round((fs - FONT_SIZE_STEP) * 100) / 100;
        page.style.setProperty("--cv-font-size", `${fs}pt`);
        void page.offsetHeight;
        guard += 1;
      }

      const overflowed = !fits();
      setState((prev) =>
        prev.effectiveFontSize === fs && prev.overflowed === overflowed
          ? prev
          : { effectiveFontSize: fs, overflowed },
      );
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measure);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [userFontSize, depsKey, pageRef, contentRef]);

  return state;
}
