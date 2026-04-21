import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";
import { ArrowRight, Clock } from "@phosphor-icons/react/dist/ssr";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  readingTimeMin: number;
  updatedAt: string;
  ctaHref: string;
  ctaLabel?: string;
  showMascot?: boolean;
};

export function ArticleHero({
  eyebrow,
  title,
  subtitle,
  readingTimeMin,
  updatedAt,
  ctaHref,
  ctaLabel = "Zacznij tworzyć CV",
  showMascot = true,
}: Props) {
  const updatedDate = new Date(updatedAt).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="mb-14 flex flex-col gap-6 border-b border-[color:var(--ink)]/10 pb-12">
      <div className="flex items-center gap-4">
        {showMascot ? (
          <PracusBrandImage
            variant="icon"
            size={72}
            priority
            className="h-16 w-16 shrink-0 rounded-2xl sm:h-[72px] sm:w-[72px]"
          />
        ) : null}
        <p className="mono-label text-[color:var(--saffron)]">{eyebrow}</p>
      </div>
      <h1 className="font-display text-[clamp(2.5rem,5.8vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)]">
        {title}
      </h1>
      <p className="max-w-2xl font-body text-[1.15rem] leading-relaxed text-[color:var(--ink-soft)]">
        {subtitle}
      </p>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <MagneticButton href={ctaHref} variant="ink" size="md">
          {ctaLabel}
          <ArrowRight size={16} weight="bold" />
        </MagneticButton>
        <div className="flex items-center gap-3 mono-label text-[color:var(--ink-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} weight="regular" />
            {readingTimeMin} min czytania
          </span>
          <span aria-hidden>·</span>
          <span>aktualizacja {updatedDate}</span>
        </div>
      </div>
    </header>
  );
}
