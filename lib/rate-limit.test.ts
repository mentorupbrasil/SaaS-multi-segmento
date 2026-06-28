import { describe, expect, it } from "vitest";
import { rateLimit, rateLimitErrorMessage } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests under the limit", () => {
    const key = `test-ok-${Date.now()}`;
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const key = `test-block-${Date.now()}`;
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    const blocked = rateLimit(key, 2, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets after the window expires", () => {
    const key = `test-window-${Date.now()}`;
    rateLimit(key, 1, 1);
    expect(rateLimit(key, 1, 1).ok).toBe(false);
    // Small delay so the 1ms window elapses
    const start = Date.now();
    while (Date.now() - start < 5) {
      /* spin */
    }
    expect(rateLimit(key, 1, 1).ok).toBe(true);
  });
});

describe("rateLimitErrorMessage", () => {
  it("returns a user-facing message in Portuguese", () => {
    expect(rateLimitErrorMessage(120_000)).toMatch(/Muitas tentativas/);
    expect(rateLimitErrorMessage(120_000)).toMatch(/2 minutos/);
  });
});
