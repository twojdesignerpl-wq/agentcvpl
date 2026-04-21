"use client";

import { useCVStore } from "@/lib/cv/store";
import { MobileAITextarea } from "./mobile-ai-textarea";

export function MobileProfileForm() {
  const profile = useCVStore((s) => s.cv.profile);
  const update = useCVStore((s) => s.updateProfile);

  const length = profile.length;
  return (
    <div className="space-y-2">
      <MobileAITextarea
        label="Profil zawodowy"
        value={profile}
        onChange={update}
        rows={5}
        placeholder="2–3 zdania o Tobie: kim jesteś, z czym pomagasz, jaki masz styl pracy. Polski rynek."
        aiField="profile"
        aiFieldLabel="Profil"
      />
      <div className="flex items-center justify-between text-[11.5px] text-[color:var(--ink-muted)]">
        <span>Rekomendowane: 180–360 znaków</span>
        <span className="tabular-nums">{length}</span>
      </div>
    </div>
  );
}
