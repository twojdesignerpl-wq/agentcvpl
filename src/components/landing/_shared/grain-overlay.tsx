export function GrainOverlay({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-multiply dark:mix-blend-screen"
      style={{
        backgroundImage: "url(/grain.svg)",
        backgroundSize: "240px 240px",
        opacity,
      }}
    />
  );
}
