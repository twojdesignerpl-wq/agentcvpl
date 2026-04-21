# CV preview & szablony · instrukcje dla `src/components/cv/**`

Render CV na ekranie (edytor) i do PDF (Puppeteer). 5 nazwanych szablonów + sekcje shared + per-template.
A4 sztywno (210×297 mm), jedna strona, auto-fit czcionki zamiast paginacji.

## 1. Szablony (5, union `TemplateId`)

`orbit | atlas | terra | cobalt | lumen`. Pliki:

| ID | Plik | Charakter | CSS theme |
|---|---|---|---|
| **orbit** | `template-orbit.tsx` | 3-col 38/4/58, monochrom, klasyka | — |
| **atlas** | `template-atlas.tsx` | Navy + blue accent `#2563eb`, ikony w headerze | `.atlas-theme` |
| **terra** | `template-terra.tsx` | Terakota `#b85a3e` + cream `#faf5ee`, italic serif | `.terra-theme` |
| **cobalt** | `template-cobalt.tsx` | Navy + sidebar + decorative blobs | `.cobalt-theme .cobalt-display` |
| **lumen** | `template-lumen.tsx` | Editorial label-by-label (section label \| content) | `.lumen-theme .lumen-display` |

Style szablonów: `src/app/globals.css` w scope `.cv-scope`. **Nie rozlewaj** CSS motywu poza `.cv-scope`
(kolizja z landing).

## 2. Dodanie nowego szablonu — checklist

1. Nowy `template-<id>.tsx` — używaj `sections/*` (shared) + opcjonalnie `<id>/*` (per-template
   header/sidebar/decoracje).
2. Rozszerz union `TemplateId` w `src/lib/cv/schema.ts`.
3. Dodaj do `templateLabels` + SVG thumbnail w `toolbar.tsx` (template selector).
4. Dodaj branch w `src/lib/cv/render-html.ts` (HTML dla Puppeteer — kolory **hex**, nie oklch).
5. `render-docx.ts` — **ignoruj** wizualny styl, generuj ATS-plain (ten sam shape jak inne).
6. Motyw CSS `.<id>-theme` w `globals.css` (w scope `.cv-scope`).
7. Test: build + podgląd w kreatorze + export PDF + export DOCX.
8. Legal: sprawdź brand tokens (nie powielaj zastrzeżonych schematów kolorów znanych marek).

## 3. Sekcje shared (`sections/`)

`header` · `profile` · `employment` · `education` · `key-skills` · `languages` · `projects` ·
`certifications` · `volunteer` · `publications` · `awards` · `conferences` · `hobbies` ·
`references` · `custom-sections` · `rodo-footer`.

Każda komponent renderuje **bezpośrednio z `useCVStore`** — nie przekazuj całego CV w props wyżej
niż trzeba. Props tylko dla wariantów visual (`variant`, `density`, itd.).

**Sortable (10 sekcji)**: education, employment, languages, projects, certifications, volunteer,
publications, awards, conferences, references. **Stałe (4)**: header, profile, rodo-footer,
custom-sections (ostatni — ma własny user order).

## 4. Edytowalność

- `editable-text.tsx` — contentEditable, używaj dla WSZYSTKICH tekstów CV (firma, stanowisko,
  opis, podsumowanie). `onCommit(value)` → action ze store.
- `editable-tag-list.tsx` — array of strings (skills, hobbies).
- `sortable-list.tsx` — `@dnd-kit` (Pointer `distance: 6`, Keyboard arrows). `verticalListSortingStrategy`,
  `closestCenter`. Handle: `DotsSixVertical` (Phosphor), cursor `grab`.
- `year-range.tsx` — month/year picker dla pól dat.

## 5. PageA4 (`page-a4.tsx`)

- Wymiary: `210mm × 297mm` (sztywne).
- Custom properties:
  - `--cv-font-size` — dynamiczny z auto-fit (nie hardcoduj w sekcjach).
  - `--cv-font-family` — z `FONT_FAMILY_STACKS` (`src/lib/cv/fonts.ts` lub w schema).
- Marże: `top 12mm · sides 14mm · bottom 8mm` (`18mm` gdy RODO widoczne).
- `overflow: hidden` zawsze. Treść nie mieści się? → **auto-fit zmniejsza font**, nie scroll.

## 6. Auto-fit (`src/lib/cv/auto-fit.ts`)

Pętla: mierzy `scrollHeight + 2 ≤ clientHeight`. Startuje od `settings.fontSize`, zmniejsza
o `0.25pt` do `8pt`. Zwraca `{ effectiveFontSize, overflowed }`. Gdy `overflowed: true` — pokaż
warning "CV za długie na 1 stronę" (kreator wyświetla baner).

**Nie zastępuj paginacją** bez decyzji produktowej — wielostronicowe CV to zupełnie inna
architektura (page-break-inside, sticky header, multi-page Puppeteer render).

## 7. Print safety (Puppeteer)

Chrome renderer **mapuje** `oklch()` do sRGB, ale:
1. W HTML dla Puppeteer (`render-html.ts`) **używaj hex-ów** dla kluczowych kolorów szablonu
   (tytuły, accent, separatory) — gwarancja.
2. Font rendering: używaj Google Fonts CSS link w HTML (nie `next/font` — Puppeteer nie ma Next).
3. Embed `&nbsp;` + `<br/>` z `escapeTextHTML` — nigdy raw HTML z user input.
4. Testuj na Vercel preview (inny Chromium niż local) przed produkcją.

## 8. Foto

`<img>` z dataURL (base64) — nie external URL (CSP `img-src 'self' data: blob: https://i.pravatar.cc`
dopuszcza data/blob, ale nie dowolne domeny).
Shapes: `circle` → `border-radius: 50%`; `square` → `border-radius: 4px`; `none` → **brak elementu**
(nie pusty placeholder).

## 9. Pola ukrywane (`settings.hiddenContactFields`)

Enum `"address" | "email" | "website" | "phone"`. Header każdego szablonu honoruje tę tablicę.
`render-html.ts` i `render-docx.ts` też. Nie hardcoduj widoczności per template — czytaj zawsze z
settings.

## 10. Guardrails

- Nie twórz sekcji-duplikatu (np. "Work history" obok "Employment") — rozszerz istniejącą schema.
- Nie importuj z `src/types/cv.ts` (legacy) — **tylko** `src/lib/cv/schema.ts`.
- **Nigdy** nie wstawiaj HTML-a z input użytkownika bez escape'u (`escapeTextHTML`). W React
  używaj `{text}` (React sam escape'uje) — omijaj mechanizmy raw-HTML-injection dla treści CV.
- Nie używaj flexbox/grid w sposób, który uniemożliwia Puppeteerowi zrenderować na 1 stronę
  (np. `position: fixed` w środku sekcji — renderer gubi wysokość).
- Nie pchaj logiki do `PageA4` — to tylko wrapper. Layout idzie do `template-*.tsx`.
