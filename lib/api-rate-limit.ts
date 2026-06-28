import { rateLimit, type RateLimitResult } from "@/lib/rate-limit";

const API_LIMIT = Number(process.env.RATE_LIMIT_API ?? 60);
const API_WINDOW_MS = Number(process.env.RATE_LIMIT_API_WINDOW_MS ?? 60_000);

export function checkApiRateLimit(key: string, limit = API_LIMIT, windowMs = API_WINDOW_MS): RateLimitResult {
  return rateLimit(`api:${key}`, limit, windowMs);
}

export function apiRateLimitResponse(retryAfterMs?: number): Response {
  const seconds = Math.max(1, Math.ceil((retryAfterMs ?? 60_000) / 1000));
  return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(seconds),
    },
  });
}
