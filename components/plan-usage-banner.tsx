import { getOrgUsage } from "@/lib/plan-limits";
import { PlanUpgradePrompt } from "@/components/plan-upgrade-prompt";

type Props = {
  orgId: string;
};

export async function PlanUsageBanner({ orgId }: Props) {
  const usage = await getOrgUsage(orgId);

  if (!usage.usersOverLimit && !usage.branchesOverLimit) return null;

  const parts: string[] = [];
  if (usage.usersOverLimit && usage.limits.maxUsers !== null) {
    parts.push(
      `${usage.userCount} usuários ativos (limite do plano: ${usage.limits.maxUsers})`,
    );
  }
  if (usage.branchesOverLimit && usage.limits.maxBranches !== null) {
    parts.push(
      `${usage.branchCount} filiais (limite do plano: ${usage.limits.maxBranches})`,
    );
  }

  return (
    <PlanUpgradePrompt
      className="mb-6"
      message={`Sua conta está acima do limite do plano atual (${parts.join("; ")}). Faça upgrade para continuar adicionando membros ou unidades.`}
    />
  );
}
