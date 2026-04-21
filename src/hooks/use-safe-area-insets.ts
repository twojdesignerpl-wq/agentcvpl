"use client";

import { useEffect, useState } from "react";

type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const INITIAL: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

function readInset(name: string): number {
  if (typeof window === "undefined") return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--safe-${name}`);
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

export function useSafeAreaInsets(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>(INITIAL);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const read = () =>
      setInsets({
        top: readInset("top"),
        right: readInset("right"),
        bottom: readInset("bottom"),
        left: readInset("left"),
      });
    read();
    window.addEventListener("resize", read);
    window.addEventListener("orientationchange", read);
    return () => {
      window.removeEventListener("resize", read);
      window.removeEventListener("orientationchange", read);
    };
  }, []);

  return insets;
}
