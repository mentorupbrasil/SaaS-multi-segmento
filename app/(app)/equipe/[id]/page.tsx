import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { formatCurrency, formatDate } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  STAFF: "Membro",
};

export default async function EquipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const member = await prisma.membership.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: { user: true },
  });

  if (!member) notFound();

  const [appointments, workOrders, commissions, services] = await Promise.all([
    prisma.appointment.findMany({
      where: { organizationId: ctx.orgId, staffId: member.id },
      include: { customer: { select: { name: true } }, service: { select: { name: true } } },
      orderBy: { startAt: "desc" },
      take: 10,
    }),
    prisma.workOrder.findMany({
      where: { organizationId: ctx.orgId, staffId: member.id },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.commissionEntry.findMany({
      where: { organizationId: ctx.orgId, staffId: member.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.serviceStaff.findMany({
      where: { membershipId: member.id },
      include: { service: { select: { id: true, name: true, price: true } } },
    }),
  ]);

  const pendingCommissions = commissions
    .filter((c) => !c.paidAt)
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div>
      <PageHeader title={member.user.name} description={member.title ?? "Membro da equipe"} />

      <div className="mb-4">
        <Link href="/equipe" className="text-sm text-primary hover:underline">
          ← Voltar
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">E-mail</p>
          <p className="font-medium">{member.user.email}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Permissão</p>
          <p className="font-medium">{ROLE_LABELS[member.role] ?? member.role}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Comissões pendentes</p>
          <p className="text-xl font-bold text-amber-600">{formatCurrency(pendingCommissions)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Serviços vinculados</p>
          <p className="font-medium">{services.length}</p>
        </div>
      </div>

      {services.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold">Serviços</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <Link
                key={s.service.id}
                href={`/servicos/${s.service.id}`}
                className="rounded-full bg-brand-50 px-3 py-1 text-sm text-primary hover:bg-primary/15"
              >
                {s.service.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">Agendamentos recentes</h2>
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum agendamento.</p>
          ) : (
            <div className="card divide-y divide-border text-sm">
              {appointments.map((a) => (
                <div key={a.id} className="flex justify-between px-4 py-3">
                  <div>
                    <p className="font-medium">{a.customer.name}</p>
                    <p className="text-muted-foreground">{a.service?.name ?? "—"}</p>
                  </div>
                  <span className="text-muted-foreground">{formatDate(a.startAt)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Ordens de serviço recentes</h2>
          {workOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma OS.</p>
          ) : (
            <div className="card divide-y divide-border text-sm">
              {workOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/ordens-de-servico/${o.id}`}
                  className="flex justify-between px-4 py-3 hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{o.title ?? o.customer?.name ?? "OS"}</p>
                    <p className="text-muted-foreground">{o.customer?.name ?? "—"}</p>
                  </div>
                  <span className="text-muted-foreground">{formatDate(o.createdAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {commissions.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">Comissões recentes</h2>
          <div className="card divide-y divide-border text-sm">
            {commissions.map((c) => (
              <Link
                key={c.id}
                href={`/comissoes/${c.id}`}
                className="flex justify-between px-4 py-3 hover:bg-muted"
              >
                <span>{c.description.replace(/ \[apt:[^\]]+\]/, "")}</span>
                <span className={c.paidAt ? "text-green-600" : "text-amber-600"}>
                  {formatCurrency(c.amount)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
