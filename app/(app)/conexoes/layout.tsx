import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";

export default async function ConexoesLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAuthContext();
  const premiumPlans = ["pro", "premium", "enterprise"];
  if (!premiumPlans.includes(ctx.organization.plan)) {
    redirect("/assinatura");
  }
  return children;
}
