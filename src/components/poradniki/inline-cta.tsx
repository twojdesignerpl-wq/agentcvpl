import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type Props = {
  headline: string;
  subhead?: string;
  utmCampaign: string;
};

export function InlineCTA({ headline, subhead, utmCampaign }: Props) {
  const href = `/kreator?utm_source=poradniki&utm_medium=inline&utm_campaign=${encodeURIComponent(utmCampaign)}`;
  return (
    <aside className="my-10 flex flex-col gap-4 rounded-2xl border border-[color:var(--saffron)]/40 bg-[color:color-mix(in_oklab,var(--saffron)_10%,var(--cream-soft))] p-6 sm:flex-row sm:items-center sm:gap-5">
      <Image
        src="/brand/pracus/ikona-1.png"
        alt="Pracuś AI"
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 select-none rounded-xl"
      />
      <div className="flex-1">
        <p className="font-display text-[1.15rem] font-semibold leading-snug text-[color:var(--ink)]">
          {headline}
        </p>
        {subhead ? (
          <p className="mt-1 font-body text-[0.92rem] leading-relaxed text-[color:var(--ink-soft)]">
            {subhead}
          </p>
        ) : null}
      </div>
      <Link
        href={href}
        style={{ color: "var(--cream)", textDecoration: "none" }}
        className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--ink)] px-5 py-3 font-body text-[0.9rem] font-semibold transition-opacity hover:opacity-90"
      >
        Otwórz kreator
        <ArrowRight size={14} weight="bold" />
      </Link>
    </aside>
  );
}
