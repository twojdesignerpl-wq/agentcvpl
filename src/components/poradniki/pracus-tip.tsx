import { PracusBrandImage } from "@/components/landing/_shared/pracus-brand";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function PracusTip({ title = "Podpowiedź Pracusia", children }: Props) {
  return (
    <aside className="my-8 flex flex-col gap-3 rounded-2xl border border-[color:var(--saffron)]/40 bg-[color:color-mix(in_oklab,var(--saffron)_8%,var(--cream-soft))] p-5 sm:flex-row sm:gap-5">
      <PracusBrandImage
        variant="icon"
        size={52}
        className="h-12 w-12 shrink-0 rounded-xl"
      />
      <div className="flex-1">
        <p className="mono-label mb-1.5 text-[color:var(--saffron)]">{title}</p>
        <div className="font-body text-[0.98rem] leading-relaxed text-[color:var(--ink-soft)]">
          {children}
        </div>
      </div>
    </aside>
  );
}
