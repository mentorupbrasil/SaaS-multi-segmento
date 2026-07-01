import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrganizationAdminDetail } from "@/lib/admin-queries";
import { getSegment } from "@/segments";
import { formatDate } from "@/lib/utils";
import { EnterOrganizationButton } from "@/components/enter-organization-button";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  TRIALING: "Trial",
  PAST_DUE: "Inadimplente",
  CANCELED: "Cancelada",
};

export default async function AdminOrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getOrganizationAdminDetail(id);
  if (!org) notFound();

  const segment = getSegment(org.segmentId);

  return (
    <div>
      <Link href="/admin/organizacoes" className="text-sm font-medium text-primary hover:underline">
        ← Organizações
      </Link>

      <div className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {segment?.label ?? org.segmentId} · Plano {org.plan} ·{" "}
            {STATUS_LABEL[org.subscriptionStatus] ?? org.subscriptionStatus}
          </p>
        </div>
        {segment && (
          <div className="flex flex-wrap gap-2">
            <EnterOrganizationButton orgId={org.id} />
            <Link href={`/${segment.slug}`} className="btn-secondary" target="_blank">
              Ver landing do segmento
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Membros da equipe", value: org.memberships.length },
          { label: "Clientes cadastrados", value: org._count.customers },
          { label: "Serviços", value: org._count.services },
          { label: "Agendamentos", value: org._count.appointments },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Usuários vinculados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Papel</th>
                <th className="px-4 py-3">Desde</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {org.memberships.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{m.user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(m.user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
        Use <strong>Entrar nesta organização</strong> para operar clientes, agenda e financeiro desta conta com
        acesso total (super admin).
      </div>
    </div>
  );
}
