import Link from "next/link";
import { ArrowLeft, Envelope, Gear, ListChecks, UsersThree } from "@phosphor-icons/react/dist/ssr";

const TABS: Array<{ href: string; label: string; icon: React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "fill" }> }> = [
  { href: "/admin", label: "Dashboard", icon: Gear },
  { href: "/admin/users", label: "Użytkownicy", icon: UsersThree },
  { href: "/admin/grants", label: "Historia planów", icon: ListChecks },
  { href: "/admin/poczta", label: "Poczta", icon: Envelope },
];

export function AdminNav({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color:var(--cream)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[color:var(--saffron)] text-[color:var(--cream)] font-bold">
              P
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight">
              agentcv <span className="text-[color:var(--saffron)]">/admin</span>
            </span>
          </Link>

          <nav className="hidden gap-1 md:flex">
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-[color:var(--ink-soft)] transition-colors hover:bg-[color:var(--cream-soft)] hover:text-ink"
              >
                <t.icon size={14} weight="bold" />
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden truncate text-[12px] text-[color:var(--ink-muted)] sm:block">
            {email}
          </span>
          <Link
            href="/konto"
            className="mono-label inline-flex items-center gap-1 text-[0.56rem] text-[color:var(--ink-muted)] hover:text-ink"
          >
            <ArrowLeft size={10} weight="bold" />
            Konto
          </Link>
        </div>
      </div>

      {/* Mobile tabs */}
      <nav className="flex gap-1 overflow-x-auto border-t border-[color:color-mix(in_oklab,var(--ink)_8%,transparent)] px-4 py-2 md:hidden">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[color:var(--cream-soft)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--ink-soft)]"
          >
            <t.icon size={12} weight="bold" />
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
