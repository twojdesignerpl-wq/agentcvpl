import { MagneticButton } from "@/components/landing/_shared/magnetic-button";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type Props = {
  headline: string;
  subhead: string;
  utmCampaign: string;
  primaryLabel?: string;
};

export function ClosingCTA({
  headline,
  subhead,
  utmCampaign,
  primaryLabel = "Stwórz CV za darmo",
}: Props) {
  const href = `/kreator?utm_source=poradniki&utm_medium=closing&utm_campaign=${encodeURIComponent(utmCampaign)}`;
  return (
    <section className="my-16 overflow-hidden rounded-3xl border border-[color:var(--ink)]/10 bg-[color:var(--ink)] p-10 text-[color:var(--cream)] sm:p-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="mono-label text-[color:var(--saffron)]">Teraz Twoja kolej</p>
          <h3 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-tight">
            {headline}
          </h3>
          <p className="mt-4 font-body text-[1rem] leading-relaxed text-[color:var(--cream)]/75">
            {subhead}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <MagneticButton href={href} variant="saffron" size="lg">
            {primaryLabel}
            <ArrowRight size={16} weight="bold" />
          </MagneticButton>
          <p className="mono-label text-[color:var(--cream)]/55">
            Darmowe pierwsze CV · RODO ✓ · Bez karty
          </p>
        </div>
      </div>
    </section>
  );
}
