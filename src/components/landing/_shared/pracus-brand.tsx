import Image from "next/image";

type Variant = "icon" | "icon-circle" | "portrait";

const SOURCES: Record<Variant, string> = {
  icon: "/brand/pracus/ikona-1.png",          // app-icon (cream rounded square, robot + pen)
  "icon-circle": "/brand/pracus/ikona-2.png", // chat-bubble circle (ink bg, white robot)
  portrait: "/brand/pracus/podobizna.png",    // same as icon — brand-portrait use
};

type Props = {
  variant?: Variant;
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function PracusBrandImage({
  variant = "icon",
  size = 64,
  className,
  priority = false,
  alt = "Pracuś AI",
}: Props) {
  return (
    <Image
      src={SOURCES[variant]}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={`select-none ${className ?? ""}`}
    />
  );
}
