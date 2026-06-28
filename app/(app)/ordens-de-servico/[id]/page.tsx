import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { LineItemForm } from "@/components/line-item-form";
import { WorkOrderStatusButtons } from "@/components/work-order-status-buttons";
import { addWorkOrderItem } from "@/modules/work-orders/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  CANCELED: "Cancelada",
};

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [order, services, inventory] = await Promise.all([
    prisma.workOrder.findFirst({
      where: { id, organizationId: ctx.orgId },
      include: {
        customer: true,
        vehicle: true,
        staff: { include: { user: true } },
        items: { orderBy: { id: "asc" } },
        quote: true,
      },
    }),
    prisma.service.findMany({
      where: { organizationId: ctx.orgId, active: true },
      select: { id: true, name: true, price: true },
    }),
    prisma.inventoryItem.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true, quantity: true, price: true },
    }),
  ]);

  if (!order) notFound();

  return (
    <div>
      <PageHeader
        title={order.title}
        description={`${term(terms, "work_order")} · ${STATUS_LABEL[order.status] ?? order.status}`}
      />

      <div className="mb-4">
        <Link href="/ordens-de-servico" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">{term(terms, "customer")}</p>
          <p className="font-medium">{order.customer?.name ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Veículo</p>
          <p className="font-medium">
            {order.vehicle ? `${order.vehicle.plate} — ${order.vehicle.model}` : "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Responsável</p>
          <p className="font-medium">{order.staff?.user.name ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</p>
        </div>
      </div>

      {order.description && (
        <p className="mb-4 text-sm text-slate-600">{order.description}</p>
      )}

      <WorkOrderStatusButtons id={order.id} status={order.status} />

      <h2 className="mb-2 mt-8 text-lg font-semibold">Itens</h2>
      {order.items.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum item ainda.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Qtd</th>
                <th className="px-4 py-3">Unit.</th>
                <th className="px-4 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {order.status !== "DONE" && order.status !== "CANCELED" && (
        <LineItemForm
          parentIdField="workOrderId"
          parentId={order.id}
          action={addWorkOrderItem}
          services={services.map((s) => ({ id: s.id, label: `${s.name} (${formatCurrency(s.price)})` }))}
          inventory={inventory.map((i) => ({
            id: i.id,
            label: `${i.name} (est: ${i.quantity})`,
          }))}
        />
      )}

      <p className="mt-4 text-xs text-slate-400">Criada em {formatDate(order.createdAt)}</p>
    </div>
  );
}
