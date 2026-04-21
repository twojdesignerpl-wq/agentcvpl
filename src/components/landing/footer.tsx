"use client";

import Link from "next/link";
import { useState } from "react";
import { XLogo, LinkedinLogo, GithubLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./_shared/section";
import { MagneticButton } from "./_shared/magnetic-button";
import { BRAND } from "@/lib/landing/brand";
import { footerGroups } from "@/lib/landing/content";

type NewsletterStatus = "idle" | "loading" | "ok" | "err" | "rate";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (res.status === 429) {
        setStatus("rate");
        return;
      }
      if (!res.ok) {
        setStatus("err");
        return;
      }
      setStatus("ok");
      setEmail("");
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("err");
    }
  };

  return (
    <Section as="footer" tone="ink" className="pt-20 pb-10" grain>
      <div className="grid gap-16 lg:grid-cols-12">
        {/* Brand column */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[2.5rem] font-bold leading-none tracking-tight text-[color:var(--cream)]">
                agentcv
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--saffron)]" />
              <span className="mono-label text-[color:var(--cream)]/50">.pl</span>
            </div>
            <p className="mt-4 max-w-sm font-body text-[0.95rem] leading-relaxed text-[color:var(--cream)]/65">
              Agent {BRAND.agent} pisze CV, które dostają rozmowy. Po polsku, pod ATS, zgodnie z RODO.
            </p>
          </div>

          {/* Newsletter */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="newsletter" className="mono-label text-[color:var(--cream)]/50">
              Inbox {BRAND.agent}a — 1 email na tydzień
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <EnvelopeSimple
                  aria-hidden
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--cream)]/40"
                />
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle" && status !== "loading") setStatus("idle");
                  }}
                  placeholder="twoj@email.pl"
                  required
                  maxLength={254}
                  aria-invalid={status === "err"}
                  aria-describedby="newsletter-status"
                  disabled={status === "loading"}
                  className="h-12 w-full rounded-full border border-[color:var(--cream)]/15 bg-transparent pl-11 pr-4 font-body text-[0.9rem] text-[color:var(--cream)] placeholder:text-[color:var(--cream)]/35 focus:border-[color:var(--saffron)] focus:outline-none disabled:opacity-60"
                />
              </div>
              <MagneticButton
                variant="saffron"
                size="md"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Zapisuję…" : "Zapisz się"}
              </MagneticButton>
            </div>
            <p id="newsletter-status" aria-live="polite" className="min-h-[1.25rem]">
              {status === "ok" && (
                <span className="mono-label text-[color:var(--saffron)]">
                  Zapisano. {BRAND.agent} już pisze do Ciebie ✦
                </span>
              )}
              {status === "err" && (
                <span className="mono-label text-[color:var(--cream)]/60">
                  Hmm, to nie wygląda na email.
                </span>
              )}
              {status === "rate" && (
                <span className="mono-label text-[color:var(--cream)]/60">
                  Spróbuj za chwilę — za dużo zapisów.
                </span>
              )}
            </p>
          </form>

          <div className="flex gap-3">
            {[
              { icon: XLogo, label: "X / Twitter", href: BRAND.social.x },
              { icon: LinkedinLogo, label: "LinkedIn", href: BRAND.social.linkedin },
              { icon: GithubLogo, label: "GitHub", href: BRAND.social.github },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--cream)]/15 text-[color:var(--cream)]/70 transition-all hover:border-[color:var(--saffron)] hover:text-[color:var(--saffron)]"
              >
                <Icon size={18} weight="regular" />
              </a>
            ))}
          </div>
        </div>

        {/* Link groups */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(footerGroups).map(([key, group]) => (
            <div key={key} className="flex flex-col gap-4">
              <h3 className="mono-label text-[color:var(--saffron)]">{group.label}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group relative font-body text-[0.92rem] text-[color:var(--cream)]/70 transition-colors hover:text-[color:var(--cream)]"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[color:var(--saffron)] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-20 flex flex-col gap-4 border-t border-[color:var(--cream)]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-label text-[color:var(--cream)]/45">
          © {new Date().getFullYear()} agentcv.pl · Wszystkie prawa zastrzeżone
        </p>
        <p className="mono-label text-[color:var(--cream)]/45">
          Zbudowane przez agenta {BRAND.agent}a ✦ v1.0
        </p>
      </div>
    </Section>
  );
}
