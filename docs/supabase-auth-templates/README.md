# Supabase Auth Email Templates — agentcv.pl

Szablony zgodne z identyfikacją wizualną agentcv.pl (Pracuś AI, editorial cream/ink/saffron).

## Gdzie wkleić

Supabase Dashboard → Project `agentcvpl-prod` → **Authentication** → **Emails** → **Email Templates**.

Każdy z 4 szablonów poniżej:

| Template w Supabase | Plik |
|---|---|
| **Confirm signup** | `confirm-signup.html` |
| **Reset password** | `reset-password.html` |
| **Magic link** | `magic-link.html` |
| **Change email address** | `change-email.html` |

## Sender

Wszystkie używają `Agent CV - Pracuś AI <hej@agentcv.pl>` (ustawiony w Authentication → SMTP Settings, wysyłka przez Resend SMTP bridge `smtp.resend.com`).

## Zmienne Supabase

Szablony używają Go template syntax:

- `{{ .ConfirmationURL }}` — link aktywacyjny (signup, recovery, magic link, email change)
- `{{ .Email }}` — e-mail obecnego konta
- `{{ .NewEmail }}` — nowy e-mail (tylko change-email)
- `{{ .SiteURL }}` — base URL z config (https://agentcv.pl)

## Testowanie

1. **Confirm signup**: Dashboard → Authentication → Users → Invite user (wyśle confirm email z Twoim template).
2. **Reset password**: Na `/zaloguj` kliknij "Zapomniałem hasła" → wpisz email → sprawdź skrzynkę.
3. **Magic link**: W aplikacji wywołaj `supabase.auth.signInWithOtp({ email })` (nie używamy w produkcji, ale template gotowy).
4. **Change email**: Zalogowany user wywołuje `supabase.auth.updateUser({ email: new })`.

## Custom subjects (w Dashboard → Authentication → Emails)

- Confirm signup: `Potwierdź konto w agentcv`
- Reset password: `Zresetuj hasło w agentcv`
- Magic link: `Twój link do logowania w agentcv`
- Change email: `Potwierdź zmianę e-maila w agentcv`

## Brand

- Logo: `https://agentcv.pl/brand/pracus/ikona-1.png` (hostowane z produkcji)
- Fonty: Syne (display) · Manrope (body) · Playfair Display (serif) · JetBrains Mono (mono)
  — ładowane przez Google Fonts link w `<head>`. Fallback: system-sans/Georgia.
- Kolory: cream `#F5F1E8` · ink `#0A0E1A` · saffron `#E08E3C` · jade `#3D8B6E`

## Dark mode

Wszystkie templates mają `<meta name="color-scheme" content="light only">` — klient **nie**
odwraca kolorów. Gmail/Apple Mail dark mode nie zaburzy kontrastu.
