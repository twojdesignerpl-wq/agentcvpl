import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  ctaPrimary?: { href: string; label: string };
  ctaSecondary?: { href: string; label: string };
  meta?: React.ReactNode;
  align?: "left" | "center";
};

export function SubpageHero({
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  meta,
  align = "left",
}: Props) {
  return (
    <header
      className={
        align === "center"
          ? "mb-14 flex flex-col items-center gap-6 border-b border-[color:var(--ink)]/10 pb-12 text-center"
          : "mb-14 flex flex-col gap-6 border-b border-[color:var(--ink)]/10 pb-12"
      }
    >
      <p className="mono-label text-[color:var(--saffron)]">{eyebrow}</p>
      <h1 className="max-w-4xl font-display text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-[color:var(--ink)]">
        {title}
      </h1>
      <p className="max-w-2xl font-body text-[1.1rem] leading-relaxed text-[color:var(--ink-soft)]">
        {subtitle}
      </p>
      {(ctaPrimary || ctaSecondary) && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {ctaPrimary && (
            <MagneticButton href={ctaPrimary.href} variant="ink" size="md">
              {ctaPrimary.label}
              <ArrowRight size={16} weight="bold" />
            </MagneticButton>
          )}
          {ctaSecondary && (
            <MagneticButton href={ctaSecondary.href} variant="ghost-ink" size="md">
              {ctaSecondary.label}
            </MagneticButton>
          )}
        </div>
      )}
      {meta ? <div className="pt-2">{meta}</div> : null}
    </header>
  );
}
