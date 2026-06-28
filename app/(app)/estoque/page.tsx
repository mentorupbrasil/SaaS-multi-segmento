import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { InventoryForm } from "@/modules/inventory/item-form";
import { MovementForm } from "@/modules/inventory/movement-form";
import { formatCurrency, formatDate } from "@/lib/utils";

const MOVEMENT_LABEL: Record<string, string> = {
  IN: "Entrada",
  OUT: "Saída",
  ADJUST: "Ajuste",
};

export default async function EstoquePage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const label = terms.inventory ?? "Estoque";

  const [items, movements, suppliers] = await Promise.all([
    prisma.inventoryItem.findMany({
      where: { organizationId: ctx.orgId },
      orderBy: { name: "asc" },
    }),
    prisma.inventoryMovement.findMany({
      where: { organizationId: ctx.orgId },
      include: {
        inventoryItem: { select: { name: true } },
        supplier: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.supplier.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const lowStock = items.filter((i) => i.minQuantity > 0 && i.quantity <= i.minQuantity);

  return (
    <div>
      <PageHeader
        title={label}
        description="Produtos, materiais e controle de quantidade."
        action={
          <div className="flex flex-wrap gap-2">
            <MovementForm
              items={items.map((i) => ({ id: i.id, label: `${i.name} (qtd: ${i.quantity})` }))}
              suppliers={suppliers.map((s) => ({ id: s.id, label: s.name }))}
            />
            <InventoryForm />
          </div>
        }
      />

      {lowStock.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {lowStock.length} item(ns) abaixo do estoque mínimo.
        </div>
      )}

      {items.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum item cadastrado ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Qtd</th>
                <th className="px-4 py-3">Mín.</th>
                <th className="px-4 py-3">Preço</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.sku ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.minQuantity}</td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mb-2 mt-8 text-lg font-semibold">Movimentações recentes</h2>
      {movements.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhuma movimentação registrada ainda.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Qtd</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3">Fornecedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{formatDate(m.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{m.inventoryItem.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {MOVEMENT_LABEL[m.type] ?? m.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.quantity}</td>
                  <td className="px-4 py-3 text-slate-600">{m.reason ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{m.supplier?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
