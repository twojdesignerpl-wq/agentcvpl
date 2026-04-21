import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article" | "header" | "footer";
  tone?: "cream" | "ink" | "cream-deep";
  bleed?: boolean;
  grain?: boolean;
  container?: boolean;
};

export function Section({
  as: Tag = "section",
  tone = "cream",
  bleed = false,
  grain = true,
  container = true,
  className,
  children,
  ...rest
}: SectionProps) {
  const toneClass =
    tone === "ink"
      ? "bg-[var(--ink)] text-[var(--cream)]"
      : tone === "cream-deep"
        ? "bg-[var(--cream-deep)] text-[var(--ink)]"
        : "bg-[var(--cream)] text-[var(--ink)]";

  return (
    <Tag
      className={cn(
        "relative w-full",
        toneClass,
        grain && "grain",
        !bleed && "py-[var(--section-y)]",
        className,
      )}
      {...rest}
    >
      {container ? (
        <div className="relative mx-auto w-full max-w-[var(--content-max)] px-6 sm:px-8 lg:px-12">
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}
