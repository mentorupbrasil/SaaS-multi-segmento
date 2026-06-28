import { rateLimit, type RateLimitResult } from "@/lib/rate-limit";

const PORTAL_LIMIT = Number(process.env.RATE_LIMIT_PORTAL ?? 20);
const PORTAL_WINDOW_MS = Number(process.env.RATE_LIMIT_PORTAL_WINDOW_MS ?? 15 * 60 * 1000);

export function checkPortalLookupRateLimit(key: string): RateLimitResult {
  return rateLimit(`portal:${key.toLowerCase()}`, PORTAL_LIMIT, PORTAL_WINDOW_MS);
}
