import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { MovementForm } from "@/modules/inventory/movement-form";
import { deleteInventoryItem } from "@/modules/inventory/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const MOVEMENT_LABEL: Record<string, string> = {
  IN: "Entrada",
  OUT: "Saída",
  ADJUST: "Ajuste",
};

export default async function EstoqueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const item = await prisma.inventoryItem.findFirst({
    where: { id, organizationId: ctx.orgId },
  });

  if (!item) notFound();

  const suppliers = await prisma.supplier.findMany({
    where: { organizationId: ctx.orgId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const movements = await prisma.inventoryMovement.findMany({
    where: { organizationId: ctx.orgId, inventoryItemId: id },
    include: { supplier: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const lowStock = item.minQuantity > 0 && item.quantity <= item.minQuantity;

  return (
    <div>
      <PageHeader title={item.name} description="Detalhe do item de estoque" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/estoque" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <DeleteButton action={deleteInventoryItem.bind(null, item.id)} redirectTo="/estoque" />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Quantidade</p>
          <p className={`text-2xl font-bold ${lowStock ? "text-amber-600" : "text-slate-900"}`}>
            {item.quantity} {item.unit}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Mínimo</p>
          <p className="font-medium">{item.minQuantity}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Preço</p>
          <p className="font-medium">{formatCurrency(item.price)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">SKU / Marca</p>
          <p className="font-medium">{item.sku ?? "—"} · {item.brand ?? "—"}</p>
        </div>
      </div>

      {lowStock && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Estoque abaixo do mínimo configurado.
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold">Registrar movimentação</h2>
      <MovementForm
        items={[{ id: item.id, label: item.name }]}
        suppliers={suppliers.map((s) => ({ id: s.id, label: s.name }))}
        defaultItemId={item.id}
        defaultOpen
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Histórico</h2>
      {movements.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhuma movimentação ainda.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Qtd</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3">Fornecedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3">{formatDate(m.createdAt)}</td>
                  <td className="px-4 py-3">{MOVEMENT_LABEL[m.type] ?? m.type}</td>
                  <td className="px-4 py-3">{m.quantity}</td>
                  <td className="px-4 py-3">{m.reason ?? "—"}</td>
                  <td className="px-4 py-3">{m.supplier?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
