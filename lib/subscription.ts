import { redirect } from "next/navigation";
import type { Organization } from "@prisma/client";
import type { AuthContext } from "@/lib/auth-context";

const SUBSCRIPTION_EXEMPT_PREFIXES = ["/assinatura", "/configuracoes"];

type OrgSubscription = Pick<Organization, "subscriptionStatus" | "trialEndsAt">;

export function isSubscriptionActive(org: OrgSubscription): boolean {
  if (org.subscriptionStatus === "ACTIVE") return true;

  if (org.subscriptionStatus === "TRIALING") {
    if (org.trialEndsAt && org.trialEndsAt < new Date()) return false;
    return true;
  }

  return false;
}

function isExemptPath(pathname: string): boolean {
  return SUBSCRIPTION_EXEMPT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Redireciona para /assinatura se a organização não tiver assinatura ativa. */
export function requireActiveSubscription(ctx: AuthContext, pathname?: string): void {
  if (ctx.isPlatformAdmin) return;
  if (pathname && isExemptPath(pathname)) return;
  if (!isSubscriptionActive(ctx.organization)) {
    redirect("/assinatura");
  }
}
