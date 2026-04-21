import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

const redis: Redis | null = hasUpstash ? Redis.fromEnv() : null;

const limiters = new Map<string, Ratelimit>();

function getUpstashLimiter(
  scope: string,
  limit: number,
  windowSec: number,
): Ratelimit | null {
  if (!redis) return null;
  const key = `${scope}:${limit}:${windowSec}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: `agentcv:rl`,
      analytics: false,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;

function pruneBuckets(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

function checkMemory(
  key: string,
  limit: number,
  windowMs: number,
): RateResult {
  const now = Date.now();
  pruneBuckets(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }
  if (bucket.count >= limit) {
    return { success: false, limit, remaining: 0, reset: bucket.resetAt };
  }
  bucket.count += 1;
  return { success: true, limit, remaining: limit - bucket.count, reset: bucket.resetAt };
}

/**
 * Sprawdza limit zapytań. Jeśli skonfigurowane są env vars Upstash (prod/preview) —
 * używa persistent Redis. W dev (bez env vars) — in-memory fallback jak wcześniej.
 *
 * @param scope — logiczna grupa licznika (np. nazwa endpointa, "global:/api/chat", "day:/api/chat")
 * @param identifier — klucz per-użytkownik (ip) lub "global"
 * @param limit — maks liczba zapytań w oknie
 * @param windowSec — okno w sekundach (domyślnie 60)
 */
export async function checkLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSec = 60,
): Promise<RateResult> {
  const limiter = getUpstashLimiter(scope, limit, windowSec);
  if (limiter) {
    try {
      const res = await limiter.limit(`${scope}:${identifier}`);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    } catch (err) {
      console.error("[rate-limit] Upstash nieosiągalny, używam pamięci:", err);
    }
  }
  return checkMemory(`${scope}:${identifier}`, limit, windowSec * 1_000);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}
