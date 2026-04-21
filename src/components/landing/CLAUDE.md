# Landing page · instrukcje dla `src/components/landing/**`

Editorial premium design: ink × cream × saffron (OKLCH), Syne display + Manrope body,
grain texture, asymetria, physics-based interactivity. Server Components domyślnie —
`'use client'` **tylko** gdzie jest motion / hook / event.

## 1. Sekcje (kolejność w `src/app/page.tsx`)

`Navbar → HeroSection → TrustMarquee → AgentBento → ProcessTimeline → TemplatesShowcase →
StatsEditorial → TestimonialsMasonry → PricingEditorial → FAQAccordion → CtaFinal → Footer`.

Każda sekcja = jeden plik w `src/components/landing/*.tsx`. Komponenty pomocnicze (shared):
`Section`, `Eyebrow`, `MagneticButton`, `GrainOverlay`, `LenisProvider`, `AgentChip`,
`InkDivider`, `Reveal / RevealStagger`.

## 2. Treść — JEDNO MIEJSCE

**Cała treść w `src/lib/landing/content.ts`** (hero copy, features[], templates[], testimonials[],
pricingPlans[], faqItems[], stats[]). Żadnych hardcoded stringów w komponentach.

Gdy zmieniasz pricing lub FAQ — **aktualizuj `src/components/seo/JsonLd.tsx` tym samym PR-em**
(SoftwareApplication.offers + FAQPage).

## 3. Easings — tylko z projektu

`src/lib/landing/easings.ts`:

```ts
easeOutCraft     = [0.22, 1, 0.36, 1]    // snappy, editorial reveal
easeInOutCraft   = [0.65, 0, 0.35, 1]    // smooth morph
easeOutSnap      = [0.16, 1, 0.3, 1]     // sharp hero reveal
easeOutSoft      = [0.4, 0, 0.2, 1]      // gentle micro
```

Nie hardcoduj `[0,0,0.2,1]` ani `"ease-out"`. Nigdy nie linear (z wyjątkiem marquee `linear` loop).

## 4. Wzorce (kanoniczne implementacje)

- **MagneticButton** — `useMotionValue + useSpring({ stiffness: 220, damping: 20, mass: 0.6 }) +
  useTransform`. **Nigdy `useState`** dla pozycji kursora (re-render killing animation).
- **Reveal / RevealStagger** — `whileInView` + `viewport={{ once: true, amount: 0.3 }}`.
- **Section** — tone-aware (`cream | ink | cream-deep`) wrapper. Zamiast `bg-ink` w komponencie,
  użyj `<Section tone="ink">`.
- **Eyebrow** — mono label `"01 / Dopasowanie"`, `--font-geist-mono`, `letter-spacing 0.14em`, uppercase.
- **AgentChip** — badge z pulsującą kropką `jade` (`@keyframes agent-pulse`).
- **GrainOverlay** — używa `public/grain.svg`. Nie duplikuj SVG w kodzie.

## 5. Animacje — reguły

1. Tylko `transform` + `opacity` (global v6.0 §9). Zero `top/left/width/height`.
2. Marquee / nieskończone pętle → `will-change: transform` + izolacja w `React.memo`.
3. `useReducedMotion()` z `motion/react` — respektuj zawsze.
4. Stagger parent+children w tym samym Client Component tree.
5. Perpetual loops → infinite `transition: { repeat: Infinity, ease: "linear" }`.

## 6. Lenis smooth scroll

`LenisProvider` wpięty w `src/app/layout.tsx`. Config: `duration 1.15s`, custom inverse-power easing,
`touchMultiplier 1.4`. **Wyłączony na `/kreator`** (zoom + podgląd A4 konflikt). Przy dodawaniu nowej
strony sprawdź czy Lenis ma sens dla UX.

## 7. Brand logos & social

- Logotypy: `react-icons/si` (Simple Icons, np. `SiSpotify`). **Nie** wrzucaj raw SVG/PNG
  (skalowanie + trademarks).
- Ikony UI: Phosphor (`@phosphor-icons/react`) — SSR-safe, stroke-based. Lucide jako fallback
  (iconLibrary w `components.json`).

## 8. Server vs Client

Domyślnie **Server Component**. `'use client'` tylko gdy:
- hook (`useState`, `useEffect`, `useMotionValue`, `useReducedMotion`, `useInView`),
- event listener,
- `motion.*` z interakcją (hover, tap, drag).

Statyczna sekcja z prostym `animate={{ opacity }}` + `initial` + `whileInView` → **Client**
(motion wymaga hooka). Ale **wewnątrz client-component'u nie renderuj ciężkich poddrzew**
statycznych — wyekstrahuj je jako Server children przez props.

## 9. Responsywność

Mobile-first, `clamp()` do fluid scale, `min-h-[100dvh]` — **nie** `h-screen` (notch iOS).
Grid asymetryczny (`grid-auto-flow: dense` w masonry), zig-zag w bento. Testuj
`visual-regression-skill` (Playwright, 375/768/1440 + dark).

## 10. Checklist nowej sekcji

1. Komponent w `src/components/landing/<nazwa>-section.tsx` (Server default).
2. Treść w `src/lib/landing/content.ts` (nowy obiekt/array + typy).
3. Użyj `<Section tone="...">` + `<Eyebrow number="0X" />`.
4. Animacja przez `Reveal`/`RevealStagger` + easing z `easings.ts`.
5. Import w `src/app/page.tsx` w odpowiedniej pozycji w kolejności §1.
6. (Jeśli ma dane strukturalne) — rozszerz `JsonLd.tsx`.
7. Visual regression pass (375/768/1440 + dark).
8. Nowe brand logos → `react-icons/si`.
