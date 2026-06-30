import Link from "next/link";
import { getBillingOverview } from "@/lib/admin-queries";
import { getSegment } from "@/segments";
import { formatDate } from "@/lib/utils";
import { getPlan } from "@/lib/plans";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  TRIALING: "Trial",
  PAST_DUE: "Inadimplente",
  CANCELED: "Cancelada",
};

export default async function AdminBillingPage() {
  const { orgs, byPlan, byStatus } = await getBillingOverview();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Faturamento</h1>
        <p className="mt-1 text-sm text-slate-500">Assinaturas e planos de todas as organizações</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-500">Por plano</h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(byPlan).map(([plan, count]) => (
              <li key={plan} className="flex justify-between text-sm">
                <span className="capitalize text-slate-700">{getPlan(plan)?.name ?? plan}</span>
                <span className="font-semibold text-slate-900">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-500">Por status</h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(byStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between text-sm">
                <span className="text-slate-700">{STATUS_LABEL[status] ?? status}</span>
                <span className="font-semibold text-slate-900">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Organização</th>
                <th className="px-4 py-3">Segmento</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cliente desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgs.map((org) => {
                const segment = getSegment(org.segmentId);
                const plan = getPlan(org.plan);
                return (
                  <tr key={org.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/organizacoes/${org.id}`}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        {org.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{segment?.label ?? org.segmentId}</td>
                    <td className="px-4 py-3 text-slate-700">{plan?.name ?? org.plan}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {STATUS_LABEL[org.subscriptionStatus] ?? org.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(org.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Cobrança recorrente via Asaas (webhook em /api/billing/webhook). Status também pode ser ajustado manualmente
        no cadastro da organização.
      </p>
    </div>
  );
}
