import Link from "next/link";
import { listOrganizations } from "@/lib/admin-queries";
import { getSegment } from "@/segments";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  TRIALING: "Trial",
  PAST_DUE: "Inadimplente",
  CANCELED: "Cancelada",
};

export default async function AdminOrganizationsPage() {
  const orgs = await listOrganizations();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Organizações</h1>
        <p className="mt-1 text-sm text-slate-500">{orgs.length} contas na plataforma</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Negócio</th>
                <th className="px-4 py-3">Segmento</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Membros</th>
                <th className="px-4 py-3">Clientes</th>
                <th className="px-4 py-3">Criada em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgs.map((org) => {
                const segment = getSegment(org.segmentId);
                return (
                  <tr key={org.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <Link href={`/admin/organizacoes/${org.id}`} className="font-medium text-brand-700 hover:underline">
                        {org.name}
                      </Link>
                      <p className="text-xs text-slate-400">{org.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{segment?.label ?? org.segmentId}</td>
                    <td className="px-4 py-3 capitalize text-slate-700">{org.plan}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {STATUS_LABEL[org.subscriptionStatus] ?? org.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{org._count.memberships}</td>
                    <td className="px-4 py-3 text-slate-700">{org._count.customers}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(org.createdAt)}</td>
                  </tr>
                );
              })}
              {orgs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Nenhuma organização cadastrada. Rode <code className="text-xs">npm run db:seed</code>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
