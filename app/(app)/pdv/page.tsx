import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { SaleForm } from "@/modules/pdv/sale-form";
import { SaleItemForm } from "@/modules/pdv/sale-item-form";
import { FinalizeSaleButton } from "@/modules/pdv/finalize-sale-button";
import { CancelSaleButton } from "@/modules/pdv/cancel-sale-button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PdvPage() {
  const ctx = await getAuthContext();

  const [openSales, customers, services, inventory] = await Promise.all([
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
        action={<SaleForm customers={customers.map((c) => ({ id: c.id, label: c.name }))} />}
      />

      {openSales.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          Nenhuma venda aberta. Clique em &quot;Nova venda&quot; para começar.
        </div>
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
                  <FinalizeSaleButton saleId={sale.id} />
                  <CancelSaleButton saleId={sale.id} />
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
