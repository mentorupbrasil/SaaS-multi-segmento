interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs?: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true };
}

const LOGIN_LIMIT = Number(process.env.RATE_LIMIT_LOGIN ?? 10);
const LOGIN_WINDOW_MS = Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS ?? 15 * 60 * 1000);
const SIGNUP_LIMIT = Number(process.env.RATE_LIMIT_SIGNUP ?? 5);
const SIGNUP_WINDOW_MS = Number(process.env.RATE_LIMIT_SIGNUP_WINDOW_MS ?? 60 * 60 * 1000);

export function checkLoginRateLimit(email: string): RateLimitResult {
  return rateLimit(`login:${email.toLowerCase()}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
}

export function checkSignupRateLimit(email: string): RateLimitResult {
  return rateLimit(`signup:${email.toLowerCase()}`, SIGNUP_LIMIT, SIGNUP_WINDOW_MS);
}

export function rateLimitErrorMessage(retryAfterMs?: number): string {
  const minutes = Math.max(1, Math.ceil((retryAfterMs ?? 60_000) / 60_000));
  return `Muitas tentativas. Aguarde ${minutes} minuto${minutes > 1 ? "s" : ""} e tente novamente.`;
}
