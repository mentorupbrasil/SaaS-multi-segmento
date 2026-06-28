import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { KitchenOrderStatusButtons } from "@/components/kitchen-order-status-buttons";
import { SendToKitchenButton } from "@/modules/kitchen/send-to-kitchen-button";
import { formatDate } from "@/lib/utils";

type KitchenItem = {
  description: string;
  quantity: number;
  notes?: string;
};

const COLUMNS = [
  { status: "PENDING" as const, title: "Pendente", headerClass: "bg-slate-100 text-slate-700" },
  { status: "PREPARING" as const, title: "Preparando", headerClass: "bg-amber-100 text-amber-800" },
  { status: "DONE" as const, title: "Pronto", headerClass: "bg-green-100 text-green-800" },
];

function parseItems(items: unknown): KitchenItem[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item): item is KitchenItem =>
      typeof item === "object" &&
      item !== null &&
      "description" in item &&
      typeof (item as KitchenItem).description === "string",
  );
}

export default async function CozinhaPage() {
  const ctx = await getAuthContext();

  const [orders, workOrders] = await Promise.all([
    prisma.kitchenOrder.findMany({
      where: {
        organizationId: ctx.orgId,
        status: { in: ["PENDING", "PREPARING", "DONE"] },
      },
      include: {
        workOrder: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.workOrder.findMany({
      where: {
        organizationId: ctx.orgId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const ordersByStatus = Object.fromEntries(
    COLUMNS.map((col) => [col.status, orders.filter((o) => o.status === col.status)]),
  ) as Record<(typeof COLUMNS)[number]["status"], typeof orders>;

  return (
    <div>
      <PageHeader
        title="Cozinha (KDS)"
        description="Painel de produção — acompanhe pedidos em tempo real."
      />

      {workOrders.length > 0 && (
        <div className="card mb-6 p-4">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Enviar ordem de serviço para a cozinha
          </p>
          <div className="flex flex-wrap gap-2">
            {workOrders.map((wo) => (
              <SendToKitchenButton key={wo.id} workOrderId={wo.id} title={wo.title} />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const columnOrders = ordersByStatus[col.status];
          return (
            <section key={col.status} className="flex flex-col">
              <div
                className={`mb-3 rounded-lg px-4 py-2 text-center text-sm font-semibold ${col.headerClass}`}
              >
                {col.title}
                <span className="ml-2 rounded-full bg-white/60 px-2 py-0.5 text-xs">
                  {columnOrders.length}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {columnOrders.length === 0 ? (
                  <div className="card flex flex-1 items-center justify-center p-6 text-center text-sm text-slate-400">
                    Nenhum pedido
                  </div>
                ) : (
                  columnOrders.map((order) => {
                    const items = parseItems(order.items);
                    return (
                      <div key={order.id} className="card p-4">
                        <div className="mb-3">
                          <p className="font-semibold text-slate-900">
                            {order.tableLabel ?? `Pedido #${order.id.slice(-6)}`}
                          </p>
                          <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                          {order.workOrder && (
                            <Link
                              href={`/ordens-de-servico/${order.workOrder.id}`}
                              className="text-xs text-brand-600 hover:underline"
                            >
                              OS: {order.workOrder.title}
                            </Link>
                          )}
                        </div>
                        <ul className="mb-3 space-y-1 text-sm text-slate-700">
                          {items.map((item, idx) => (
                            <li key={idx} className="flex justify-between gap-2">
                              <span>{item.description}</span>
                              <span className="font-medium text-slate-900">×{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                        {order.notes && (
                          <p className="mb-3 rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-600">
                            {order.notes}
                          </p>
                        )}
                        <KitchenOrderStatusButtons id={order.id} status={order.status} />
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
