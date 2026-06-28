import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getAuthContext } from "@/lib/auth-context";

export default async function IaLayout({ children }: { children: React.ReactNode }) {
  if (!isFeatureEnabled("IA")) {
    redirect("/dashboard");
  }

  const ctx = await getAuthContext();
  const premiumPlans = ["pro", "premium", "enterprise"];
  if (!premiumPlans.includes(ctx.organization.plan)) {
    redirect("/assinatura");
  }

  return children;
}
