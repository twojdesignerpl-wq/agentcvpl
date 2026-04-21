export default function Loading() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-2 border-muted" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Ładowanie...</p>
      </div>
    </main>
  );
}
