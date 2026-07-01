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
        <h1 className="text-2xl font-bold text-foreground">Organizações</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orgs.length} contas na plataforma</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
            <tbody className="divide-y divide-border">
              {orgs.map((org) => {
                const segment = getSegment(org.segmentId);
                return (
                  <tr key={org.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link href={`/admin/organizacoes/${org.id}`} className="font-medium text-primary hover:underline">
                        {org.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{org.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{segment?.label ?? org.segmentId}</td>
                    <td className="px-4 py-3 capitalize text-foreground">{org.plan}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {STATUS_LABEL[org.subscriptionStatus] ?? org.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{org._count.memberships}</td>
                    <td className="px-4 py-3 text-foreground">{org._count.customers}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(org.createdAt)}</td>
                  </tr>
                );
              })}
              {orgs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
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
