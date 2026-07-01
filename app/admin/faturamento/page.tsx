import Link from "next/link";
import { getBillingOverview } from "@/lib/admin-queries";
import { getSegment } from "@/segments";
import { formatDate } from "@/lib/utils";
import { getPlan } from "@/lib/plans";
import { SUBSCRIPTION_STATUS_LABELS, labelFor } from "@/lib/status-labels";

export default async function AdminBillingPage() {
  const { orgs, byPlan, byStatus } = await getBillingOverview();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Faturamento</h1>
        <p className="mt-1 text-sm text-muted-foreground">Assinaturas e planos de todas as organizações</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-muted-foreground">Por plano</h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(byPlan).map(([plan, count]) => (
              <li key={plan} className="flex justify-between text-sm">
                <span className="capitalize text-foreground">{getPlan(plan)?.name ?? plan}</span>
                <span className="font-semibold text-foreground">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-muted-foreground">Por status</h2>
          <ul className="mt-3 space-y-2">
            {Object.entries(byStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between text-sm">
                <span className="text-foreground">{labelFor(SUBSCRIPTION_STATUS_LABELS, status)}</span>
                <span className="font-semibold text-foreground">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Organização</th>
                <th className="px-4 py-3">Segmento</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cliente desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orgs.map((org) => {
                const segment = getSegment(org.segmentId);
                const plan = getPlan(org.plan);
                return (
                  <tr key={org.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/organizacoes/${org.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {org.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground">{segment?.label ?? org.segmentId}</td>
                    <td className="px-4 py-3 text-foreground">{plan?.name ?? org.plan}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {labelFor(SUBSCRIPTION_STATUS_LABELS, org.subscriptionStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(org.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Cobrança recorrente via Asaas (webhook em /api/billing/webhook). Status também pode ser ajustado manualmente
        no cadastro da organização.
      </p>
    </div>
  );
}
