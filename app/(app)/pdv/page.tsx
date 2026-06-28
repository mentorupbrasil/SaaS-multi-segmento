import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getOpenCashShift } from "@/lib/cash-shift-utils";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { SaleForm } from "@/modules/pdv/sale-form";
import { SaleItemForm } from "@/modules/pdv/sale-item-form";
import { FinalizeSaleButton } from "@/modules/pdv/finalize-sale-button";
import { CancelSaleButton } from "@/modules/pdv/cancel-sale-button";
import { DeleteButton } from "@/components/delete-button";
import { deleteSale } from "@/modules/pdv/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PdvPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const ctx = await getAuthContext();
  const { table: tableParam } = await searchParams;
  const defaultTableLabel = tableParam?.trim() || undefined;

  const [openSales, customers, services, inventory, paymentMethods, openShift] =
    await Promise.all([
    prisma.sale.findMany({
      where: { organizationId: ctx.orgId, status: "OPEN" },
      include: {
        customer: { select: { name: true } },
        items: { orderBy: { id: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { organizationId: ctx.orgId, active: true },
      select: { id: true, name: true, price: true },
    }),
    prisma.inventoryItem.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true, quantity: true, price: true },
    }),
    getMasterDataOptions(ctx.orgId, "PAYMENT_METHOD"),
    getOpenCashShift(ctx.orgId),
  ]);

  const serviceOptions = services.map((s) => ({
    id: s.id,
    label: `${s.name} (${formatCurrency(s.price)})`,
  }));
  const inventoryOptions = inventory.map((i) => ({
    id: i.id,
    label: `${i.name} (est: ${i.quantity})`,
  }));

  return (
    <div>
      <PageHeader
        title="PDV"
        description="Ponto de venda — vendas abertas e finalização."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/pdv/vendas" className="btn-secondary">
              Histórico de vendas
            </Link>
            <SaleForm
              customers={customers.map((c) => ({ id: c.id, label: c.name }))}
              defaultTableLabel={defaultTableLabel}
            />
          </div>
        }
      />

      {!openShift && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Caixa fechado.{" "}
          <Link href="/caixa" className="font-medium text-amber-900 underline">
            Abra o caixa
          </Link>{" "}
          antes de finalizar vendas.
        </div>
      )}

      {openSales.length === 0 ? (
        <EmptyState icon="ShoppingCart" description="Nenhuma venda aberta. Clique em Nova venda para começar." />
      ) : (
        <div className="space-y-6">
          {openSales.map((sale) => (
            <div key={sale.id} className="card p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {sale.tableLabel ?? `Venda #${sale.id.slice(-6)}`}
                  </p>
                  <p className="text-sm text-slate-500">
                    {sale.customer?.name ?? "Sem cliente"} · {formatDate(sale.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(sale.total)}</p>
                  <FinalizeSaleButton saleId={sale.id} paymentMethods={paymentMethods} />
                  <CancelSaleButton saleId={sale.id} />
                  <DeleteButton action={deleteSale.bind(null, sale.id)} />
                </div>
              </div>

              {sale.items.length > 0 && (
                <table className="mb-2 w-full text-sm">
                  <thead className="text-left text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-2">Item</th>
                      <th className="py-2">Qtd</th>
                      <th className="py-2">Unit.</th>
                      <th className="py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sale.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2">{item.description}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-2">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <SaleItemForm
                saleId={sale.id}
                services={serviceOptions}
                inventory={inventoryOptions}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
