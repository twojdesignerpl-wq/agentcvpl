"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-6xl font-extrabold font-[family-name:var(--font-display)] text-destructive">
          Ups!
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Coś poszło nie tak
        </h1>
        <p className="mt-2 text-muted-foreground">
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-muted-foreground/60">
            Kod: {error.digest}
          </p>
        ) : null}
      </div>
      <button
        onClick={reset}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Spróbuj ponownie
      </button>
    </main>
  );
}
