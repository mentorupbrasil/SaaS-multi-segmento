import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getAuthContext } from "@/lib/auth-context";
import { hasGrowthPlanAccess } from "@/lib/plan-limits";

export default async function IaLayout({ children }: { children: React.ReactNode }) {
  if (!isFeatureEnabled("IA")) {
    redirect("/dashboard");
  }

  const ctx = await getAuthContext();
  if (!hasGrowthPlanAccess(ctx.organization.plan)) {
    redirect("/assinatura");
  }

  return children;
}
