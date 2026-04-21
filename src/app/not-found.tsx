import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold font-[family-name:var(--font-display)] text-gradient-primary">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Strona nie została znaleziona
        </h1>
        <p className="mt-2 text-muted-foreground">
          Nie mogliśmy znaleźć strony, której szukasz.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Wróć na stronę główną
      </Link>
    </main>
  );
}
