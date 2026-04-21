"use client";

import { useCVStore } from "@/lib/cv/store";
import { MobileTextField } from "./mobile-field";

export function MobilePersonalForm() {
  const personal = useCVStore((s) => s.cv.personal);
  const update = useCVStore((s) => s.updatePersonal);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <MobileTextField
          label="Imię"
          value={personal.firstName}
          onChange={(e) => update({ firstName: e.target.value })}
          placeholder="Jan"
          autoComplete="given-name"
        />
        <MobileTextField
          label="Nazwisko"
          value={personal.lastName}
          onChange={(e) => update({ lastName: e.target.value })}
          placeholder="Kowalski"
          autoComplete="family-name"
        />
      </div>
      <MobileTextField
        label="Stanowisko / rola"
        value={personal.role}
        onChange={(e) => update({ role: e.target.value })}
        placeholder="np. Frontend Developer"
        autoComplete="organization-title"
      />
      <MobileTextField
        label="E-mail"
        type="email"
        inputMode="email"
        value={personal.email}
        onChange={(e) => update({ email: e.target.value })}
        placeholder="jan@example.com"
        autoComplete="email"
      />
      <MobileTextField
        label="Telefon"
        type="tel"
        inputMode="tel"
        value={personal.phone}
        onChange={(e) => update({ phone: e.target.value })}
        placeholder="+48 600 000 000"
        autoComplete="tel"
      />
      <MobileTextField
        label="Adres"
        value={personal.address}
        onChange={(e) => update({ address: e.target.value })}
        placeholder="Warszawa, Polska"
        autoComplete="address-level2"
      />
      <MobileTextField
        label="Strona / LinkedIn"
        type="url"
        inputMode="url"
        value={personal.website}
        onChange={(e) => update({ website: e.target.value })}
        placeholder="linkedin.com/in/jan-kowalski"
        autoComplete="url"
      />
    </div>
  );
}
