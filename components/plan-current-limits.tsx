import { getPlan } from "@/lib/plans";
import {
  formatBranchLimit,
  formatUserLimit,
  getPlanLimits,
  getOrgUsage,
  canAccessFeature,
} from "@/lib/plan-limits";
import {
  filterModulesByPlan,
  getLockedModulesForPlan,
} from "@/lib/plan-enforcement";
import { resolveSegmentModules } from "@/lib/segment-modules";
import { MODULES } from "@/modules";
import { Icon } from "@/components/icon";
import type { ModuleId } from "@/modules/types";

type Props = {
  orgId: string;
  planId: string;
  segmentId: string;
};

export async function PlanCurrentLimits({ orgId, planId, segmentId }: Props) {
  const plan = getPlan(planId);
  const limits = getPlanLimits(planId);
  const usage = await getOrgUsage(orgId);
  const segmentModules = resolveSegmentModules(segmentId);
  const activeModules = filterModulesByPlan(segmentModules, planId);
  const lockedModules = getLockedModulesForPlan(segmentModules, planId);

  const features: { label: string; ok: boolean }[] = [
    { label: "WhatsApp automático", ok: canAccessFeature(planId, "whatsapp_reminders") },
    { label: "Agendamento online público", ok: canAccessFeature(planId, "public_booking") },
    { label: "Relatórios avançados", ok: canAccessFeature(planId, "advanced_reports") },
    { label: "Exportação CSV/Excel", ok: canAccessFeature(planId, "data_export") },
    { label: "Estoque e ordens de serviço", ok: canAccessFeature(planId, "extra_modules") },
    { label: "Relatórios consolidados", ok: canAccessFeature(planId, "consolidated_reports") },
  ];

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-4">
      <h2 className="text-sm font-semibold text-slate-900">
        Seu plano: {plan?.name ?? planId}
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Usuários: {usage.userCount}/{formatUserLimit(planId)} · Filiais:{" "}
        {usage.branchCount}/{formatBranchLimit(planId)}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recursos incluídos
          </p>
          <ul className="mt-2 space-y-1.5">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-2 text-sm text-slate-700">
                <Icon
                  name={f.ok ? "Check" : "X"}
                  className={`h-4 w-4 shrink-0 ${f.ok ? "text-green-600" : "text-slate-300"}`}
                />
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Módulos ativos ({activeModules.length})
          </p>
          <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto text-sm text-slate-600">
            {activeModules.map((id: ModuleId) => (
              <li key={id}>{MODULES[id]?.name ?? id}</li>
            ))}
          </ul>
          {lockedModules.length > 0 && (
            <p className="mt-3 text-xs text-amber-700">
              Bloqueados neste plano:{" "}
              {lockedModules.map((id) => MODULES[id]?.name ?? id).join(", ")}
            </p>
          )}
        </div>
      </div>

      {(usage.usersOverLimit || usage.branchesOverLimit) && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Conta acima do limite do plano. Faça upgrade para adicionar usuários ou filiais.
        </p>
      )}
    </div>
  );
}
