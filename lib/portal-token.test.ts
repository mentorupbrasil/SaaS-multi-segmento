import { describe, expect, it } from "vitest";
import {
  createPortalToken,
  portalQuoteUrl,
  portalWorkOrderUrl,
  verifyPortalToken,
} from "./portal-token";

describe("portal-token", () => {
  const orgId = "org_test_123";
  const resourceId = "res_abc";

  it("creates deterministic 32-char tokens", () => {
    const t1 = createPortalToken("work_order", resourceId, orgId);
    const t2 = createPortalToken("work_order", resourceId, orgId);
    expect(t1).toBe(t2);
    expect(t1).toHaveLength(32);
  });

  it("verifies valid tokens", () => {
    const token = createPortalToken("quote", resourceId, orgId);
    expect(verifyPortalToken("quote", resourceId, orgId, token)).toBe(true);
  });

  it("rejects invalid tokens", () => {
    const token = createPortalToken("quote", resourceId, orgId);
    expect(verifyPortalToken("quote", resourceId, orgId, "x".repeat(32))).toBe(false);
    expect(verifyPortalToken("work_order", resourceId, orgId, token)).toBe(false);
    expect(verifyPortalToken("quote", "other", orgId, token)).toBe(false);
  });

  it("builds portal URLs with token query", () => {
    const woUrl = portalWorkOrderUrl("barbearia-demo", resourceId, orgId);
    expect(woUrl).toMatch(/^\/portal\/barbearia-demo\/os\/res_abc\?token=/);

    const qUrl = portalQuoteUrl("barbearia-demo", resourceId, orgId);
    expect(qUrl).toMatch(/^\/portal\/barbearia-demo\/orcamentos\/res_abc\?token=/);
  });
});
