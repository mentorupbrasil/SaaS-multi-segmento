import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PrintLayout } from "@/components/print-layout";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  CANCELED: "Cancelada",
};

export default async function WorkOrderPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);

  const order = await prisma.workOrder.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      customer: true,
      vehicle: true,
      staff: { include: { user: true } },
      items: { orderBy: { id: "asc" } },
    },
  });

  if (!order) notFound();

  return (
    <PrintLayout title={`Imprimir ${term(terms, "work_order")}`}>
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
        <p className="text-sm text-slate-600">{term(terms, "work_order")}</p>
      </div>

      <div className="mb-6 flex flex-wrap justify-between gap-4 text-sm">
        <div>
          <p className="font-semibold text-slate-900">{order.title}</p>
          <p className="text-slate-600">Status: {STATUS_LABEL[order.status] ?? order.status}</p>
          <p className="text-slate-600">Criada em {formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-600">{term(terms, "customer")}: {order.customer?.name ?? "—"}</p>
          {order.vehicle && (
            <p className="text-slate-600">
              Veículo: {order.vehicle.plate} — {order.vehicle.model}
            </p>
          )}
          <p className="text-slate-600">Responsável: {order.staff?.user.name ?? "—"}</p>
        </div>
      </div>

      {order.description && (
        <p className="mb-6 text-sm text-slate-700">{order.description}</p>
      )}

      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
            <th className="py-2 pr-4">Descrição</th>
            <th className="py-2 pr-4 text-right">Qtd</th>
            <th className="py-2 pr-4 text-right">Unit.</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="py-2 pr-4">{item.description}</td>
              <td className="py-2 pr-4 text-right">{item.quantity}</td>
              <td className="py-2 pr-4 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="pt-4 text-right font-semibold">
              Total
            </td>
            <td className="pt-4 text-right text-lg font-bold">{formatCurrency(order.total)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="text-center text-xs text-slate-400 print:hidden">
        <Link href={`/ordens-de-servico/${order.id}`} className="text-brand-600 hover:underline">
          ← Voltar ao detalhe
        </Link>
      </p>
    </PrintLayout>
  );
}
