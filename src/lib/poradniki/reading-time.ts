const WORDS_PER_MINUTE_PL = 200;

export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE_PL));
}

export function formatReadingTime(min: number): string {
  return `${min} min czytania`;
}
