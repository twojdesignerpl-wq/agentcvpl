# Deployment Guide — agentcv.pl

Krok-po-kroku wdrożenie produkcyjne na Vercel + GitHub + Supabase + OAuth
(Google, Facebook). Stripe jest poza zakresem tego przewodnika (kolejna iteracja).

## Prerequisites

- Konto GitHub (push repo)
- Konto Vercel (bezpłatne wystarczy na start)
- Konto Supabase (bezpłatny plan: 500 MB DB, 50 000 MAU)
- Konto Anthropic ([console.anthropic.com](https://console.anthropic.com)) — API key
- Domena `agentcv.pl` (Vercel Domains / zewnętrzny registrar)

---

## 1. Repo na GitHub

```bash
git init
git add .
git commit -m "feat: initial agentcv.pl release"
git branch -M main
git remote add origin git@github.com:<twoj-user>/agentcv.git
git push -u origin main
```

---

## 2. Supabase — projekt + schema

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
   - Region: `eu-central-1` (Frankfurt) — najbliżej Vercel EU.
   - Nazwa: `agentcv-prod` (osobno `agentcv-preview` dla Preview deployments).
2. **Project Settings → API** — zapisz:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**tajny, backend-only**)
3. **SQL Editor** → wklej `supabase/migrations/0001_init.sql` i uruchom. Utworzy tabele
   `cvs` + `newsletter_subscribers` z RLS.

### OAuth providers

1. **Supabase → Authentication → Providers → Google**
   - [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create OAuth 2.0 Client
   - Authorized redirect URI: `https://<projekt>.supabase.co/auth/v1/callback`
   - Skopiuj Client ID + Secret do Supabase
   - Zapisz, włącz provider
2. **Supabase → Authentication → Providers → Facebook**
   - [Facebook Developers](https://developers.facebook.com/) → Create App → Consumer → Login
   - Valid OAuth Redirect URIs: `https://<projekt>.supabase.co/auth/v1/callback`
   - App ID + App Secret → Supabase
3. **Supabase → Authentication → URL Configuration**
   - Site URL: `https://agentcv.pl`
   - Redirect URLs: `https://agentcv.pl/auth/callback`, `https://*-<twoj-user>.vercel.app/auth/callback`

---

## 3. Vercel — import repo

1. [vercel.com/new](https://vercel.com/new) → Import z GitHub → wybierz `agentcv`.
2. Framework Preset: **Next.js** (auto-detected).
3. Environment Variables (**Production + Preview**):
   ```
   ANTHROPIC_API_KEY              = sk-ant-xxx
   NEXT_PUBLIC_SUPABASE_URL       = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY  = eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY      = eyJhbGci...  (tylko Production, nie Preview)
   ```
4. **Deploy**. Pierwszy build ~2–3 min.

### Upstash Redis (rate limit persistence)

1. Vercel → Project → **Integrations** → Browse Marketplace → **Upstash Redis** → Install.
2. Wybierz region `eu-central-1`, plan Free (10k req/day).
3. Vercel auto-provision env vars:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Redeploy.

### Domena

1. Vercel → Project → **Domains** → Add `agentcv.pl` + `www.agentcv.pl`.
2. W panelu registrar (OVH / nazwa.pl / etc.):
   - Wartości CNAME/A wg instrukcji Vercel.
3. SSL auto-provisioned przez Let's Encrypt.

---

## 4. Post-deploy weryfikacja

- `https://agentcv.pl` — landing ładuje się, Lighthouse mobile ≥90.
- `https://agentcv.pl/kreator` — edytor działa anon, localStorage save.
- `https://agentcv.pl/zaloguj` — OAuth Google → redirect → `/konto` z emailem.
- `https://agentcv.pl/api/og?title=Test` — PNG 1200×630.
- `curl -I https://agentcv.pl/api/og?title=test` — widzisz `X-RateLimit-*`.
- DevTools Console (żadnej strony) — 0 CSP violations.

---

## 5. Monitoring

- **Vercel Analytics** (w projekcie) — domyślnie włączone, statystyki page views + Web Vitals.
- **Vercel Logs** — Project → Logs tab dla errors.
- **Supabase Logs** — Project → Logs dla auth + DB queries.
- **GitHub Actions** — `.github/workflows/ci.yml` weryfikuje każdy PR (lint + tsc + build).

---

## 6. Rollback

W razie regresji:

1. Vercel → Project → **Deployments** → wybierz poprzedni pomyślny → **Promote to Production**.
2. Rollback jest natychmiastowy (edge cache).

---

## 7. Kolejne kroki (post-launch)

- **Stripe** — integracja planów Pro / Unlimited. Webhook → aktualizacja `app_metadata.plan`.
- **Resend** — wpiąć w `/api/newsletter` zamiast mocka.
- **CV sync** — opt-in sync lokalnego Zustand store z tabelą `cvs` (po login).
- **CSP nonce** — migracja z `'unsafe-inline'` na nonce-based CSP.
- **Playwright visual regression** — w GitHub Actions.
