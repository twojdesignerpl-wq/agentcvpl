"use client";

import { useCVStore } from "@/lib/cv/store";
import { MobileTagInput } from "./tag-input";

export function MobileHobbiesForm() {
  const hobbies = useCVStore((s) => s.cv.hobbies);
  const setHobbies = useCVStore((s) => s.setHobbies);

  return (
    <MobileTagInput
      label="Zainteresowania"
      values={hobbies}
      onChange={setHobbies}
      placeholder="np. Fotografia, bieganie"
      hint="3–5 konkretów działa najlepiej"
    />
  );
}
