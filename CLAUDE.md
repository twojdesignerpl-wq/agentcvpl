@AGENTS.md

# agentcv — kreator CV "Pracuś" · instrukcje projektu

Marka: **agentcv.pl**. Produkt: darmowy kreator CV z asystentem AI dla polskiego rynku pracy
(ATS-friendly, RODO-compliant, B2C). Persona agenta: **Pracuś** — 15 lat rekrutacji,
polskie realia, zero korpo-żargonu, zero fabrykowania metryk.

> Ten plik **nadpisuje** globalny `~/.claude/CLAUDE.md` v6.0 tam, gdzie są różnice
> (fonty, stack, brak DB/auth/Stripe). Reszta globalnego obowiązuje: 9-fazowy workflow,
> 10 quality gates, zakazy globalne, skille, agenci, MCP.

---

## 1. Stack (PIN — nie zgaduj)

- **Next.js 16.2.3** App Router + **React 19.2.4** + **Tailwind v4** (`@tailwindcss/postcss`).
  Brak `tailwind.config.*` — tokens inline w `src/app/globals.css` przez `@theme inline`.
- **AI**: `@ai-sdk/anthropic ^3.0.69` + `ai ^6.0.159` + `@ai-sdk/react ^3.0.161`.
- **State**: `zustand ^5.0.12` z persist — key `kreator-cv-v10`, version **7** (nigdy nie obniżaj).
- **Walidacja**: `zod ^4.3.6` — po obu stronach (API + Zustand migracje).
- **Motion**: `motion ^12.38.0` (Framer v12) + `lenis ^1.3.21` (**wyłączony na `/kreator`**).
- **DnD**: `@dnd-kit/core + sortable + utilities` — tylko w podglądzie CV.
- **PDF**: `puppeteer-core ^24.40.0` + `@sparticuz/chromium ^147.0.0` (server-only, Node runtime).
- **DOCX**: `docx ^9.6.1`.
- **UI**: shadcn (style `base-nova`, baseColor `neutral`, iconLibrary `lucide`), Base UI `^1.4.0`,
  Phosphor + Lucide + react-icons. Rejestry shadcn: `@magicui`, `@aceternity`, `@motion-primitives`.
- **Observability**: `@vercel/analytics`, `@vercel/speed-insights`.

## 2. Czego NIE ma (nie wymyślaj)

Baza danych · autentykacja · Stripe/payments · i18n (hardcoded PL) · Edge runtime ·
`tailwind.config.*` · `vercel.json` · dynamiczny sitemap (jest statyczny `src/app/sitemap.ts`).
`/api/newsletter` to **mock** — TODO: Resend/Loops.

## 3. Design tokens (SINGLE SOURCE OF TRUTH)

Wszystko w `src/app/globals.css`. Paleta editorial w **OKLCH**:
`ink / ink-soft / ink-muted`, `cream / cream-soft / cream-deep`,
`saffron / saffron-soft`, `jade / jade-soft`, `rust`. Dark mode: `.dark`.
Promień bazowy `--radius: 0.625rem` (skala `sm → 4xl`). Theme color `#0A0E1A`, bg `#F5F1E8`
(zgodne z `public/manifest.json`).

## 4. Fonty (RULE)

`Manrope` (body, `--font-manrope`) · `Syne` (display/heading, `--font-syne`) ·
`Playfair Display` (serif, `--font-playfair`) · `Geist` (fallback).
**Zakazane: `Inter`** (globalny v6.0 §10 + potwierdzone dla tego projektu).
Nie ładuj Google Fonts przez `<link>` — tylko `next/font`.

## 5. Performance & UX budget

LCP < 2.0s · INP < 150ms · CLS < 0.05 · Lighthouse ≥ 95 (mobile + desktop) ·
JS first load < 100KB. **`/kreator` jest desktop-first** — mobile out-of-scope bez nowej decyzji.

## 6. Runtime map (endpointy)

| Endpoint | Runtime | maxDuration | Model | Stream |
|---|---|---|---|---|
| `/api/chat` | Node | 30s | `claude-sonnet-4-6` | SSE (UIMessage) |
| `/api/cv/ai` | Node | 30s | `claude-sonnet-4-6` | text |
| `/api/pdf` | Node | 60s | Puppeteer | — |
| `/api/docx` | Node | 30s | `docx` | — |
| `/api/newsletter` | Node | 10s | mock | — |

Wszystkie: rate-limited przez `src/proxy.ts` (Upstash Redis + global cap + daily cap, fallback
in-memory w dev) + same-origin check. Szczegóły: **`src/app/api/CLAUDE.md`**.

## 7. Legacy — nie multiplikuj

- **`src/types/cv.ts`** — stara definicja (`experience`, `personalInfo`, `rodoClause`).
  Aktualna jest w `src/lib/cv/schema.ts` (`employment`, `personal`, `rodo:{type,companyName}`).
  Przy dotknięciu obszaru — migruj lub usuwaj, **nie dodawaj** nowych importów z `types/cv.ts`.
- **`src/lib/constants.ts`** — `CV_FONTS` (32+ fontów) i `FONT_SIZE_DEFAULT=11` to legacy.
  Toolbar używa **schema** (5 fontów, default 10pt, step 0.25, min 8, max 14). OK-do-użycia z
  `constants.ts`: `APP_NAME`, `SECTION_LABELS`, `LANGUAGE_LEVELS`, `RODO_STANDARD`, `RODO_FUTURE`,
  `DEFAULT_SECTION_ORDER`.

## 8. Reguły kodu specyficzne

- **API routes**: zawsze `export const runtime = "nodejs"` + `maxDuration` + Zod parse +
  same-origin. AI dodatkowo: `sanitizeUserInput` + `abortSignal.timeout(...)`.
- **Zustand**: nowe pole w CV → nowa migracja `version+1` w `src/lib/cv/store.ts`.
  **Nigdy** nie zmieniaj kształtu istniejącej migracji.
- **Animacje**: Motion v12 only. GSAP tylko w izolowanym `useEffect`. **Nigdy** GSAP + Motion
  w tym samym drzewie. Animuj wyłącznie `transform` + `opacity`.
- **`/kreator` = Client tree** (`'use client'` wysoko). **Landing = Server Components** domyślnie,
  push `'use client'` do najniższego możliwego poziomu.
- **Tailwind v4**: wartości z custom properties (`var(--ink)`) zamiast hex-ów w klasach.

## 9. SEO & brand

`metadataBase: "https://agentcv.pl"`, `lang: "pl-PL"`. JsonLd w `src/components/seo/JsonLd.tsx`
(Organization · SoftwareApplication z 3 ofertami Free/Pro/Unlimited · FAQPage · HowTo · Breadcrumb).
**Przy zmianie pricing/FAQ aktualizuj JsonLd jednym strumieniem** (landing content + schema).

## 10. Treść

Landing content **wyłącznie** w `src/lib/landing/content.ts` (pricing, FAQ, testimonials,
features, templates). Zero hardkodowania w komponentach. Zero "Acme/Seamless/Elevate/John Doe".

## 11. Komendy

```bash
npm run dev
npm run build && npm run lint && npx tsc --noEmit
npx shadcn@latest add @magicui/<name> | @aceternity/<name> | @motion-primitives/<name>
```

`ANTHROPIC_API_KEY` jest wymagany. `.env*` są w `.gitignore`.

## 12. Mapa sub-CLAUDE

- `src/app/api/CLAUDE.md` — warstwa API, AI, PDF, rate limit, security.
- `src/components/landing/CLAUDE.md` — landing page: sekcje, motion, content, Lenis.
- `src/components/kreator/CLAUDE.md` — edytor CV: shell, toolbar, AI inline, Zustand.
- `src/components/cv/CLAUDE.md` — 5 szablonów, auto-fit, PageA4, print safety.

## 13. Guardrails (projektowe, oprócz globalnych)

- Nie importuj z `src/types/cv.ts` — użyj `src/lib/cv/schema.ts` (`CVData`, `cvDataSchema`).
- Nie proponuj 6-tego szablonu CV bez decyzji produktowej.
- Nie dodawaj nowego endpointu bez wpisu rate-limita w `src/proxy.ts`.
- Nie ruszaj `serverExternalPackages` w `next.config.ts` (Puppeteer + chromium).
- Nie bump'uj `package.json` dependencies bez `context7` docs + build/lint/tsc pass.
- **Nie dodawaj branży do `src/lib/ai/industries.ts` bez pełnego profilu w `src/lib/ai/knowledge-base.ts`**
  (spójność UI dropdown ⇄ Pracuś knowledge base — każda wybieralna branża musi mieć ESCO/skills/ATS).
- Nie commituj bez jawnej prośby użytkownika.
