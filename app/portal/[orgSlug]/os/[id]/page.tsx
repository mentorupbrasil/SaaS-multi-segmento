import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { getOrganizationByPortalSlug } from "@/lib/public-booking";
import { getPublicWorkOrder } from "@/lib/public-portal";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  CANCELED: "Cancelada",
};

export default async function PortalWorkOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orgSlug, id } = await params;
  const { token = "" } = await searchParams;
  const org = await getOrganizationByPortalSlug(orgSlug);
  if (!org) notFound();

  const order = await getPublicWorkOrder(org.id, id, token);
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-muted px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link
          href={`/portal/${org.slug}/os`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <Icon name="ArrowLeft" className="h-4 w-4" />
          Voltar
        </Link>

        <div className="card p-6">
          <p className="text-sm text-muted-foreground">{org.name}</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{order.title}</h1>
          <p className="mt-2 text-sm">
            Status:{" "}
            <span className="font-medium">{STATUS_LABEL[order.status] ?? order.status}</span>
          </p>

          {order.customer && (
            <p className="mt-1 text-sm text-muted-foreground">Cliente: {order.customer.name}</p>
          )}
          {order.vehicle && (
            <p className="text-sm text-muted-foreground">
              Veículo: {order.vehicle.plate} — {order.vehicle.model}
            </p>
          )}

          <div className="mt-6 border-t border-border pt-4">
            <h2 className="mb-2 font-semibold">Itens</h2>
            {order.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem itens lançados ainda.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.description}</span>
                    <span>{formatCurrency(item.quantity * item.unitPrice)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-right text-lg font-bold">{formatCurrency(order.total)}</p>
          </div>

          {order.dueDate && (
            <p className="mt-4 text-xs text-muted-foreground">Previsão: {formatDate(order.dueDate)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
