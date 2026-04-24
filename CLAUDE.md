@AGENTS.md

# agentcv — kreator CV "Pracuś" · instrukcje projektu

Marka: **agentcv.pl**. Produkt: darmowy kreator CV z asystentem AI dla polskiego rynku pracy
(ATS-friendly, RODO-compliant, B2C). Persona agenta: **Pracuś** — 15 lat rekrutacji,
polskie realia, zero korpo-żargonu, zero fabrykowania metryk.

> Ten plik **nadpisuje** globalny `~/.claude/CLAUDE.md` v6.0 tam, gdzie są różnice
> (fonty, stack). Reszta globalnego obowiązuje: 9-fazowy workflow,
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
- **Auth + DB**: `@supabase/supabase-js ^2.48.0` + `@supabase/ssr ^0.7.0`. Service role client
  w webhooks/admin. Tabele: `cvs`, `newsletter_subscribers`, `admins`, `plan_grants`,
  `usage_logs`, `emails`, `email_dispatches`. Function `is_admin(uuid)`.
- **Payments**: `stripe ^22.0.2` + `@stripe/stripe-js ^9.2.0` (TEST mode na start).
  Checkout: `/api/stripe/checkout`. Webhook: `/api/stripe/webhook` → update
  `user.app_metadata.plan` + audit w `plan_grants`.
- **Email**: `resend ^4` + `@react-email/components` + `isomorphic-dompurify`. Nadawca:
  `Agent CV - Pracuś AI <hej@agentcv.pl>`. Transactional: `src/lib/email/send.ts`
  (welcome, payment, plan_granted). Inbound: `/api/resend/inbound` (Svix signature) → tabela
  `emails`. Admin inbox: `/admin/poczta` (wątki + reply).
- **UI**: shadcn (style `base-nova`, baseColor `neutral`, iconLibrary `lucide`), Base UI `^1.4.0`,
  Phosphor + Lucide + react-icons. Rejestry shadcn: `@magicui`, `@aceternity`, `@motion-primitives`.
- **Observability**: `@vercel/analytics`, `@vercel/speed-insights`.

## 2. Czego NIE ma (nie wymyślaj)

i18n (hardcoded PL) · Edge runtime · `tailwind.config.*` · `vercel.json` ·
dynamiczny sitemap (jest statyczny `src/app/sitemap.ts`). `/api/newsletter` to **mock** —
TODO: Resend full integration (obecnie newsletter używa Supabase tabeli, emaile
transactional i inbox idą przez Resend).

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

| Endpoint | Runtime | maxDuration | Model/Lib | Gating |
|---|---|---|---|---|
| `/api/chat` | Node | 30s | `claude-sonnet-4-6` | auth + `canUseAI("chat")` |
| `/api/cv/ai` | Node | 30s | `claude-sonnet-4-6` | auth + `canUseAI("cv")` |
| `/api/pdf` | Node | 60s | Puppeteer | auth + `canDownload()` |
| `/api/docx` | Node | 30s | `docx` | auth + `canDownload()` |
| `/api/newsletter` | Node | 10s | mock (Supabase) | — |
| `/api/stripe/checkout` | Node | 10s | Stripe SDK | `requireUser()` |
| `/api/stripe/webhook` | Node | 30s | Stripe SDK | Stripe signature |
| `/api/resend/inbound` | Node | 10s | — | Svix signature |

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
(Organization · SoftwareApplication z 4 ofertami Free/Pro/Pro Pack/Unlimited · FAQPage · HowTo ·
Breadcrumb). Pro Pack generowany automatycznie przez `pricingPlans.flatMap` gdy `plan.oneTime`.
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

## 13. Admin + Plans + Email

- **Admin role** — hybrid: `ADMIN_EMAILS` env (comma-separated) **OR**
  `user.app_metadata.role="admin"`. Layout `src/app/admin/layout.tsx` wymusza guard.
  Przy pierwszym wejściu admina `ensureAdminRole()` seeduje `app_metadata.role` i wpis w
  `public.admins`. Guard helper: `src/lib/auth/admin.ts` → `isAdminUser()`, `requireAdmin()`.
- **Plan quotas** — single source of truth w `src/lib/plans/quotas.ts`:
  - Free: 1 pobranie/mc, 0 AI.
  - Pro: 10 pobrań/mc, 100 req/dzień chat, 100 req/dzień inline AI, 20 job-match/mc.
  - Unlimited: ∞ pobrań, 500 req/dzień AI, ∞ job-match.
- **Usage tracking** — `src/lib/plans/usage.ts` → `canDownload()`, `canUseAI()`,
  `recordUsage()`. Tabela `usage_logs(user_id, action, created_at)`. Count-based quota z
  `WHERE created_at >= first_of_month` (brak cron reset).
- **Plan gating w API** — każdy AI/export endpoint sprawdza plan **przed** wywołaniem modelu
  i zwraca 402 `plan_limit`/`no_access` z kodem polskim + CTA do `/subskrypcja`.
- **Stripe TEST** — trzy produkty: `agentcv Pro` (19 PLN/mo, subscription), `agentcv Unlimited`
  (39 PLN/mo, subscription), `agentcv Pro Pack` (19 PLN one-time, payment). Price IDs:
  `STRIPE_PRICE_PRO`, `STRIPE_PRICE_UNLIMITED`, `STRIPE_PRICE_PRO_PACK`. Webhook aktualizuje
  `app_metadata.plan` (subscription) lub wstawia wiersz do `plan_credits` (pack, 10 credits) +
  audit log `plan_grants` (source=stripe).
- **Email (Resend)** — nadawca `Agent CV - Pracuś AI <hej@agentcv.pl>`. Supabase Auth SMTP
  skonfigurowany na Resend (recovery/confirmation/magic link idą przez ten sam SMTP).
  Transactional `src/lib/email/send.ts`: `sendWelcome` (idempotentne przez `email_dispatches`
  unique), `sendPaymentConfirmation`, `sendPlanGranted`.
- **Inbox** — `/admin/poczta` wątkowe (grupowanie po `thread_id`, matching `in_reply_to`).
  HTML render w `<iframe sandbox>` + DOMPurify (XSS protection). Reply przez Resend API.
- **Env vars** — patrz `.env.example`. Krytyczne: `ADMIN_EMAILS`, `STRIPE_*` (6),
  `RESEND_API_KEY`, `EMAIL_FROM`, `RESEND_INBOUND_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.

## 14. Guardrails (projektowe, oprócz globalnych)

- Nie importuj z `src/types/cv.ts` — użyj `src/lib/cv/schema.ts` (`CVData`, `cvDataSchema`).
- Nie proponuj 6-tego szablonu CV bez decyzji produktowej.
- Nie dodawaj nowego endpointu bez wpisu rate-limita w `src/proxy.ts`.
- Nie ruszaj `serverExternalPackages` w `next.config.ts` (Puppeteer + chromium).
- Nie bump'uj `package.json` dependencies bez `context7` docs + build/lint/tsc pass.
- **Nie dodawaj branży do `src/lib/ai/industries.ts` bez pełnego profilu w `src/lib/ai/knowledge-base.ts`**
  (spójność UI dropdown ⇄ Pracuś knowledge base — każda wybieralna branża musi mieć ESCO/skills/ATS).
- Nie commituj bez jawnej prośby użytkownika.
- Nie dodawaj funkcji pod AI bez gate'u `canUseAI()` — Free nie ma AI.
- Nie zwracaj surowego HTML z `public.emails` do JSX bez `<HtmlSandbox>` (XSS).
- Nie wyłączaj Svix signature verification w `/api/resend/inbound`.
- Nie usuwaj `force-dynamic` z `/admin/*` — layout używa service_role, nie można prerender.
- Nie zmieniaj `source` w `plan_grants` insert z `stripe`/`admin`/`system` — RLS + audit polegają.
