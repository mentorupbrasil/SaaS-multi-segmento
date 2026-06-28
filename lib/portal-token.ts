import { createHmac, timingSafeEqual } from "crypto";

type PortalResource = "work_order" | "quote";

function secret(): string {
  return process.env.AUTH_SECRET ?? "gestorpro-dev-secret";
}

export function createPortalToken(resource: PortalResource, id: string, organizationId: string): string {
  return createHmac("sha256", secret())
    .update(`${resource}:${id}:${organizationId}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyPortalToken(
  resource: PortalResource,
  id: string,
  organizationId: string,
  token: string,
): boolean {
  if (!token || token.length !== 32) return false;
  const expected = createPortalToken(resource, id, organizationId);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

export function portalWorkOrderUrl(orgSlug: string, id: string, organizationId: string): string {
  const token = createPortalToken("work_order", id, organizationId);
  return `/portal/${orgSlug}/os/${id}?token=${token}`;
}

export function portalQuoteUrl(orgSlug: string, id: string, organizationId: string): string {
  const token = createPortalToken("quote", id, organizationId);
  return `/portal/${orgSlug}/orcamentos/${id}?token=${token}`;
}
