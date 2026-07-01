import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getMasterDataOptions } from "@/lib/master-data";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { DeleteButton } from "@/components/delete-button";
import { InventoryForm } from "@/modules/inventory/item-form";
import { deleteInventoryItem } from "@/modules/inventory/actions";
import { MovementForm } from "@/modules/inventory/movement-form";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

const MOVEMENT_LABEL: Record<string, string> = {
  IN: "Entrada",
  OUT: "Saída",
  ADJUST: "Ajuste",
};

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const label = terms.inventory ?? "Estoque";

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, items, allItems, movements, suppliers, categoryItems, unitItems] =
    await Promise.all([
      prisma.inventoryItem.count({ where }),
      prisma.inventoryItem.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (params.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
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
      getMasterDataOptions(ctx.orgId, "PRODUCT_CATEGORY"),
      getMasterDataOptions(ctx.orgId, "PRODUCT_UNIT"),
    ]);

  const lowStock = allItems.filter((i) => i.minQuantity > 0 && i.quantity <= i.minQuantity);

  return (
    <div>
      <PageHeader
        title={label}
        description="Produtos, materiais e controle de quantidade."
        action={
          <div className="flex flex-wrap gap-2">
            <MovementForm
              items={allItems.map((i) => ({ id: i.id, label: `${i.name} (qtd: ${i.quantity})` }))}
              suppliers={suppliers.map((s) => ({ id: s.id, label: s.name }))}
            />
            <InventoryForm categoryItems={categoryItems} unitItems={unitItems} />
          </div>
        }
      />

      {lowStock.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {lowStock.length} item(ns) abaixo do estoque mínimo.
        </div>
      )}

      <ListToolbar searchValue={params.q} searchPlaceholder="Buscar item por nome..." />

      {items.length === 0 ? (
        <EmptyState
          icon="Package"
          description={
            params.q ? "Nenhum resultado para a busca." : "Nenhum item cadastrado ainda."
          }
        />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Qtd</th>
                  <th className="px-4 py-3">Mín.</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/estoque/${item.id}`} className="hover:text-primary">
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.sku ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.minQuantity}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deleteInventoryItem.bind(null, item.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            total={total}
            page={params.page}
            pageSize={PAGE_SIZE}
            basePath="/estoque"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}

      <h2 className="mb-2 mt-8 text-lg font-semibold">Movimentações recentes</h2>
      {movements.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada ainda.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Qtd</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3">Fornecedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-muted">
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(m.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{m.inventoryItem.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {MOVEMENT_LABEL[m.type] ?? m.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.quantity}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.reason ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.supplier?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
