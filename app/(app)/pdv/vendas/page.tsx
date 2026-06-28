import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PdvVendasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const ctx = await getAuthContext();
  const params = parseListParams(await searchParams);
  const skip = (params.page - 1) * params.pageSize;

  const where = {
    organizationId: ctx.orgId,
    status: "PAID" as const,
    ...(params.q
      ? {
          OR: [
            { tableLabel: { contains: params.q, mode: "insensitive" as const } },
            { customer: { name: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: params.pageSize,
    }),
    prisma.sale.count({ where }),
  ]);

  return (
    <div>
      <PageHeader
        title="Vendas finalizadas"
        description="Histórico de vendas pagas no PDV."
        action={
          <Link href="/pdv" className="btn-secondary">
            Voltar ao PDV
          </Link>
        }
      />

      <form method="get" className="mb-4 flex gap-2">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Buscar por mesa ou cliente..."
          className="input max-w-xs"
        />
        <button type="submit" className="btn-secondary">
          Buscar
        </button>
      </form>

      {sales.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma venda encontrada.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Identificador</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Pagamento</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-4 py-3">{formatDate(sale.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">
                    {sale.tableLabel ?? `#${sale.id.slice(-6)}`}
                  </td>
                  <td className="px-4 py-3">{sale.customer?.name ?? "—"}</td>
                  <td className="px-4 py-3">{sale.paymentMethod ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(sale.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/pdv/${sale.id}/print`}
                      className="text-brand-600 hover:underline"
                    >
                      Cupom
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        total={total}
        page={params.page}
        pageSize={params.pageSize}
        basePath="/pdv/vendas"
        searchParams={{ q: params.q || undefined }}
      />
    </div>
  );
}
