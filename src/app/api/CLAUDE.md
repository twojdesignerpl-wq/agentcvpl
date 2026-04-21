# API · instrukcje dla `src/app/api/**`

Wszystkie endpointy: **Node runtime** (nie Edge — Puppeteer, Anthropic SDK),
Zod-walidowane wejście, rate-limited przez `src/proxy.ts`, same-origin only,
headers `Cache-Control: no-store` + `X-Robots-Tag: noindex, nofollow, noarchive` (z `next.config.ts`).

## 1. Kontrakty

| Endpoint | File | maxDuration | Model | Input | Output | Limit/min |
|---|---|---|---|---|---|---|
| `POST /api/chat` | `chat/route.ts` | 30s | `claude-sonnet-4-6` | `{messages[≤30], context}` | UIMessage SSE | 10 |
| `POST /api/cv/ai` | `cv/ai/route.ts` | 30s | `claude-sonnet-4-6` | `{action, field, currentText≤5000, context≤8000, industry, position}` | text stream | 15 |
| `POST /api/pdf` | `pdf/route.ts` | 60s | Puppeteer | `{cvData, effectiveFontSize?}` | `application/pdf` ≤ 8MB | 10 |
| `POST /api/docx` | `docx/route.ts` | 30s | `docx` lib | `{cvData}` | `.docx` blob | 20 |
| `POST /api/newsletter` | `newsletter/route.ts` | 10s | **MOCK** | `{email, source?}` | `{ok}` | 5 |
| `POST /api/fetch-job` | `fetch-job/route.ts` | 15s | — (fetch) | `{url: https://...}` | `{ok, title, content, hostname, source}` | 5 |

`action`: `"generate" | "improve" | "shorten"` (`/api/cv/ai`) lub
`"generate" | "improve" | "job-match"` (`/api/chat`).

## 2. AI layer (`src/lib/ai/`)

- **`prompts.ts`** — `BASE_PERSONA` (Pracuś, 15 lat rekrutacji), `buildSystemPrompt(ctx)`,
  `sanitizeUserInput(s, cap)`. Caps: `currentText 5000 · context 8000 · jobListing 8000 ·
  position 200 · industry 64 · field 64 · fieldLabel 128`.
- **`knowledge-base.ts`** — 26 branż PL (ESCO · O*NET · Barometr Zawodów 2026 · BKL PARP · PRK/ZSK),
  spójne z `src/lib/ai/industries.ts` (UI dropdown). Sync industries.ts ⇄ knowledge-base.ts jest
  twardym kontraktem: każda branża w dropdown ma dedykowany profil.
  Per branża: `topRoles, coreSkills, actionVerbs, achievementTemplates, certifications, atsKeywords,
  toneHint`. **Używaj istniejących** profili — dodanie nowej branży = update `IndustryId` union +
  pełny profil (wszystkie 7 pól).

## 3. Reguły dla AI routes

1. **Zawsze** `sanitizeUserInput` przed wrzuceniem stringów użytkownika do promptu —
   nawet dla pól "zaufanych" (role markers, code fences, control chars, dividers).
2. **Zawsze** `abortSignal: AbortSignal.timeout(msBelowMaxDuration)` na `streamText`/`generateText`.
3. **Streaming**: `/api/chat` → `result.toUIMessageStreamResponse()`;
   `/api/cv/ai` → `result.toTextStreamResponse()`.
4. **Prompt caching — włączone w `/api/chat`** (BASE_PERSONA cached ephemeral, ~60% oszczędności
   na kolejnych wiadomościach w 5-min oknie). Dla `/api/cv/ai` — nie używamy (prompty są krótsze
   i bardziej zróżnicowane).
5. **Modele — stringi dokładnie te**:
   - Chat/generation: `anthropic("claude-sonnet-4-6")`
   - Opus — nie używamy w runtime (tylko code review agent).

## 4. Rate limiter (`src/proxy.ts` + `src/lib/rate-limit.ts`)

**Backend**: Upstash Redis przez `@upstash/ratelimit` (env vars `UPSTASH_REDIS_REST_URL`,
`UPSTASH_REDIS_REST_TOKEN`). W dev bez env vars — automatyczny fallback na in-memory Map
(logika z `src/lib/rate-limit.ts:checkMemory`).

**Trzy warstwy limitów** (każda per endpoint):
1. **Per-IP 60s** (`LIMITS` w `proxy.ts`) — podstawowy limit dla użytkownika.
2. **Global cap 60s** (`GLOBAL_LIMITS`) — killswitch całego endpointa, chroni przed rozproszonym
   atakiem kosztowym (500 req/min dla `/api/chat`).
3. **Daily cap per-IP 24h** (`DAILY_LIMITS`) — anti-abuse dla drogich modeli AI (200 req/doba
   na `/api/chat`).

Klucz identyfikacji: `x-forwarded-for` (first) → `x-real-ip` → `anon`. Same-origin check zwraca
403 dla cross-origin. 429 zwraca `{ error: "Za dużo zapytań..." }` + `X-RateLimit-*` + `Retry-After`.

**Przy dodawaniu endpointu**: dopisz limit do `LIMITS` (obowiązkowo) + opcjonalnie do
`GLOBAL_LIMITS` / `DAILY_LIMITS` gdy endpoint odpala płatne modele AI.

## 5. PDF pipeline (`/api/pdf`)

1. Zod `requestSchema` (cvData + `effectiveFontSize? 6–20`).
2. `renderCVToHTML(cvData, fontSize)` z `src/lib/cv/render-html.ts` — HTML-escape całej treści
   użytkownika, Google Fonts po nazwie (5 rodzin), branch per template.
3. Browser: produkcja `@sparticuz/chromium.executablePath()`; lokalnie auto-detect
   (Windows/Mac/Linux) + fallback na `CHROME_PATH` env.
4. Puppeteer args (stałe): `--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage
   --disable-gpu --no-zygote --disable-extensions --mute-audio --hide-scrollbars`.
5. Viewport `794×1123` (A4@2×), `setContent(html, { waitUntil: "networkidle0", timeout: 15_000 })`,
   `emulateMediaType("screen")`.
6. `page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true, margin: 0×4, timeout: 20_000 })`.
7. Guard: size ≤ 8MB (inaczej 500). Filename: `{first}-{last}.pdf` (lowercase, strip).
8. **Nigdy nie zmieniaj tej sekwencji bez testu lokalnego + Vercel preview.**

## 6. DOCX (`/api/docx` + `render-docx.ts`)

To **ATS-friendly**, nie wizualny klon PDF. Paragraphs/TextRuns, bullet lists, borders na nagłówkach,
kolory `PRIMARY #1A1A1A / MUTED #6B6B6B / ACCENT #B84A2E`. Zero grafiki, zero kolumn.

## 7. Bezpieczeństwo

- **CSP** w `next.config.ts` → `connect-src 'self' https://api.anthropic.com
  https://va.vercel-scripts.com`. Nowy provider AI → rozszerz CSP.
- **Output validation**: Zod `safeParse` na wyniku extraction (nie ufaj LLM nawet przy
  structured output).
- **Size limits**: PDF 8MB, input caps per pole (patrz §2), multipart 6MB.
- **Brak auth** na endpointach — zależymy od rate limitera + same-origin. Jeśli dodajesz
  endpoint admin-only → zacznij od wprowadzenia auth warstwy (NextAuth/Clerk) na poziomie projektu.

## 8. Env vars

Wymagane: `ANTHROPIC_API_KEY`.
Opcjonalne: `CHROME_PATH` (local dev), `RESEND_API_KEY` (gdy podpinasz newsletter).
Rate limiter (persistent): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — w prod/preview
provisioned przez Vercel Marketplace integration Upstash; w dev fallback na in-memory.
`.env*` w `.gitignore` — **nigdy** nie commituj.

## 9. Checklist dodawania nowego endpointu

1. Plik `src/app/api/<name>/route.ts` + `export const runtime = "nodejs"` + `maxDuration`.
2. Zod schema input + `safeParse` → 400 na błędzie.
3. Rate-limit: dodaj klucz do `ENDPOINT_LIMITS` w `src/proxy.ts`.
4. Same-origin check (już w proxy).
5. (AI) `sanitizeUserInput` + `abortSignal.timeout(...)`.
6. Headers: `no-store`, content-type, `X-Content-Type-Options: nosniff`.
7. CSP update, jeśli nowy hostname.
8. Dokumentacja w tabeli §1 powyżej.
