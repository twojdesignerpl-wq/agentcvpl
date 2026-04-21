"use client";

import { EditableText } from "@/components/cv/editable/editable-text";
import { PhotoUpload } from "@/components/cv/photo-upload";
import { useCVStore } from "@/lib/cv/store";

export function CobaltHeader() {
  const personal = useCVStore((s) => s.cv.personal);
  const photoShape = useCVStore((s) => s.cv.settings.photoShape);
  const updatePersonal = useCVStore((s) => s.updatePersonal);
  const setPhoto = useCVStore((s) => s.setPhoto);

  const showPhoto = photoShape !== "none";

  return (
    <header className="flex items-start gap-[6mm]">
      {showPhoto ? (
        <PhotoUpload
          photo={personal.photo}
          shape={photoShape}
          onChange={setPhoto}
          size={92}
          alt={`${personal.firstName} ${personal.lastName}`.trim() || "Zdjęcie profilowe"}
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-[1mm] min-w-0">
        <h1 className="cobalt-display flex flex-wrap items-baseline gap-[0.28em] text-[calc(var(--cv-font-size)*3.0)] font-extrabold leading-[1.0] text-[color:var(--cv-ink)]">
          <EditableText
            value={personal.firstName}
            onChange={(v) => updatePersonal({ firstName: v })}
            placeholder="Imię"
            as="span"
          />
          <EditableText
            value={personal.lastName}
            onChange={(v) => updatePersonal({ lastName: v })}
            placeholder="Nazwisko"
            as="span"
          />
        </h1>
        <EditableText
          value={personal.role}
          onChange={(v) => updatePersonal({ role: v })}
          placeholder="Twoja rola zawodowa"
          as="p"
          className="cobalt-display mt-[0.6mm] text-[calc(var(--cv-font-size)*1.15)] font-bold text-[color:var(--cv-ink)]"
        />
      </div>
    </header>
  );
}
