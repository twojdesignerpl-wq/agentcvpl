# Kreator CV · instrukcje dla `src/components/kreator/**`

Edytor single-page (nie step-by-step), **desktop-first**, Client Component tree (`'use client'` wysoko),
state w Zustand + localStorage (autosave). Render CV: podgląd live A4 z auto-fitem czcionki.
Eksport: PDF (Puppeteer) + DOCX (docx).

## 1. Struktura

- **`kreator-shell.tsx`** — orchestrator: zoom state (0.4–1.2, step 0.1), skróty klawiszowe
  (`Ctrl+=/-/0`), export PDF/DOCX, hydrate-gate na `useCVStore.hydrated`.
- **`toolbar.tsx`** — sticky top `z-30`, grid `[auto_minmax(0,1fr)_auto]` (**zachowaj**).
  Sekcje: Font family (5) · Font size (8–14pt, step 0.25) · Zoom presets · Template selector
  (5 szablonów z SVG thumbnails) · Photo upload/crop · Sections popover · RODO selector ·
  Settings · Export (PDF default + DOCX dropdown).
- **`sections-popover.tsx`** — toggle widoczności sekcji + "Dodaj nową sekcję" (custom).
- **`animated-popover.tsx`** — wrapper popovers (fade-in/slide-in).
- **`zoom-control.tsx`** — presety 50/75/100/125/150% + auto.
- **`ai-inline-button.tsx`** — "Pracuś · <field>" przy polach tekstowych, 3 akcje
  (generate/improve/shorten), streamuje z `/api/cv/ai`, dialog z Apply/Discard.

## 2. State — Zustand (`src/lib/cv/store.ts`)

- `persist` middleware, storage `localStorage`, key **`kreator-cv-v10`**, version **7**.
- Hydrate gate: `hydrated: boolean` — nie renderuj podglądu przed `true` (SSR mismatch).
- Akcje: pełen CRUD + reorder dla 10 sortable sekcji, `setCV/resetToSample/resetToEmpty`,
  settings (`setTemplate`, `setFontFamily`, `setFontSize`, `setPhotoShape`, `setPhoto`,
  `hiddenContactFields`), toggle widoczności, RODO (`setRodoType`, `setRodoCompany`).

**Dodawanie pola do CVData**:
1. Rozszerz `cvDataSchema` w `src/lib/cv/schema.ts`.
2. Bump `version` w `persist({ version })`.
3. Dodaj case w `migrate(persistedState, version)` — przepisz stary shape na nowy.
4. Nowe akcje w store.
5. UI (toolbar/sections-popover/template) aktualizuj osobno.
6. `render-html.ts` + `render-docx.ts` rozszerz o nowe pole.

**Nigdy** nie zmieniaj kształtu istniejącej migracji — tylko dodaj nową wyższą.

## 3. Edycja inline

- **`editable-text.tsx`** — contentEditable `<span>/<p>/<h1-4>`, commit na `onBlur` +
  Enter (single-line). Sanityzacja: `textContent` (nie `innerHTML`) — zero XSS ryzyka od paste.
- **`editable-tag-list.tsx`** — lista tagów (array of strings).
- **React Hook Form jest w deps ale NIEUŻYWANE w kreatorze** — to legacy z wczesnego prototypu.
  Nie mieszaj HRF + contentEditable. Jeśli dodajesz formularz (np. Settings dialog) —
  możesz użyć RHF, ale osobno, nie w drzewie CV.

## 4. AI inline (`ai-inline-button.tsx`)

- Buduje kontekst z `useCVStore.cv` (`context` max 8000 znaków — truncate przed wysłaniem).
- Endpoint: `POST /api/cv/ai` z `{ action, field, fieldLabel, currentText, context, industry, position }`.
- Stream text → wyświetl w dialogu → user Apply (zapis do pola) / Discard.
- Przy zmianie shape'u CV (nowe pola) — **zaktualizuj buildera kontekstu** (preview jakie dane widzi AI).

## 5. Photo

`photo-upload.tsx` + `photo-crop-dialog.tsx`. Shapes: `circle | square | none`.
Zapis jako **dataURL w localStorage** → uwaga na rozmiar: duże zdjęcie → `QuotaExceededError`.
**Kompresuj przed zapisem** (resize do ≤ 512px długi bok, JPEG 0.82). Shape `none` = brak `<img>`
(nie placeholder).

## 6. Export

- **PDF**: `POST /api/pdf` z `{ cvData, effectiveFontSize }` → blob → download `{first}-{last}.pdf`.
- **DOCX**: `POST /api/docx` z `{ cvData }` → blob → download `{first}-{last}.docx`.
- Podczas eksportu zablokuj przycisk (spinner) — ~2–6s PDF, ~0.5s DOCX.

## 7. Keyboard shortcuts

`Ctrl+= / Ctrl++` zoom +0.1 · `Ctrl+-` zoom −0.1 · `Ctrl+0` reset do auto.
**Undo/Redo nie istnieje** — świadoma decyzja (persist trzyma zawsze ostatni stan).
Jeśli dodajesz undo — użyj `zundo` middleware, nie reinventing.

## 8. Auto-fit (ważne)

Logika w `src/lib/cv/auto-fit.ts` + hook `useAutoFit()`. Pętla: zmniejsza font o 0.25pt do min 8pt,
aż `content.scrollHeight + 2 ≤ content.clientHeight`. Zwraca `{ effectiveFontSize, overflowed }`.
Szczegóły renderowania: **`src/components/cv/CLAUDE.md`**.

## 9. Desktop-only

Brak mobilnych breakpointów. Popover/Dialog przyjmują pełną szerokość podglądu A4.
**Nie** proponuj mobile redesign bez decyzji produktowej (inna architektura: edytor sekwencyjny
zamiast swobodnego).

## 10. Checklist nowej fichy w edytorze

1. (Jeśli dane) — schema + store + migracja (§2).
2. (Jeśli UI toolbar) — dodaj w `toolbar.tsx` zachowując 3-column grid.
3. (Jeśli sekcja CV) — `src/components/cv/sections/<name>.tsx` + dopięcie w szablonach.
4. (Jeśli AI) — nowy `AIInlineButton` przy polu + rozszerzenie AIContext.
5. Renderery: `render-html.ts` (Puppeteer) + `render-docx.ts` (ATS).
6. Test: build + lint + tsc + export PDF lokalnie (musi się zmieścić ≤ 8MB).
