import { describe, expect, it } from "vitest";
import { checkPortalLookupRateLimit } from "./portal-rate-limit";

describe("portal-rate-limit", () => {
  it("allows first lookups", () => {
    const key = `test-${Date.now()}@example.com`;
    expect(checkPortalLookupRateLimit(key).ok).toBe(true);
  });
});
