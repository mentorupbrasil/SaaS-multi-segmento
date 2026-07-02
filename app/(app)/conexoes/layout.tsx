import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { hasGrowthPlanAccess } from "@/lib/plan-limits";

export default async function ConexoesLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAuthContext();
  if (!hasGrowthPlanAccess(ctx.organization.plan)) {
    redirect("/assinatura");
  }
  return children;
}
