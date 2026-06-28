import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { WorkOrderForm } from "@/modules/work-orders/order-form";
import { deleteWorkOrder } from "@/modules/work-orders/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  CANCELED: "Cancelada",
};

export default async function OrdensDeServicoPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [orders, customers, staff, vehicles] = await Promise.all([
    prisma.workOrder.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.membership.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.vehicle.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, plate: true, model: true },
      orderBy: { plate: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title={term(terms, "work_order_plural")}
        description="Acompanhe serviços, produção e entregas."
        action={
          <WorkOrderForm
            customers={customers}
            staff={staff.map((m) => ({ id: m.id, name: m.user.name }))}
            vehicles={vehicles.map((v) => ({ id: v.id, label: `${v.plate} — ${v.model}` }))}
          />
        }
      />

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma ordem cadastrada ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/ordens-de-servico/${o.id}`} className="hover:text-brand-600">
                      {o.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{o.customer?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <DeleteButton onConfirm={() => deleteWorkOrder(o.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
