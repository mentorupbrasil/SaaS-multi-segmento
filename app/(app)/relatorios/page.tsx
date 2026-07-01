import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { canAccessFeature } from "@/lib/plan-limits";
import { PageHeader } from "@/components/page-header";
import { ExportButtons } from "@/components/export-link";
import { formatCurrency } from "@/lib/utils";

function parseDateParam(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from: fromParam, to: toParam } = await searchParams;
  const ctx = await getAuthContext();
  const orgId = ctx.orgId;
  const plan = ctx.organization.plan;
  const hasAdvanced = canAccessFeature(plan, "advanced_reports");
  const hasConsolidated = canAccessFeature(plan, "consolidated_reports");

  if (!hasAdvanced) {
    return (
      <div>
        <PageHeader
          title="Relatórios"
          description="Indicadores avançados do desempenho do negócio."
        />
        <div className="card p-10 text-center">
          <p className="text-slate-600">
            Relatórios avançados estão disponíveis a partir do plano Profissional.
          </p>
          <Link href="/assinatura" className="btn-primary mt-4 inline-flex">
            Ver planos
          </Link>
        </div>
      </div>
    );
  }

  const defaultTo = new Date();
  const defaultFrom = new Date();
  defaultFrom.setMonth(defaultFrom.getMonth() - 5);
  defaultFrom.setDate(1);
  defaultFrom.setHours(0, 0, 0, 0);

  const fromDate = parseDateParam(fromParam, defaultFrom);
  const toDate = parseDateParam(toParam, defaultTo);
  toDate.setHours(23, 59, 59, 999);

  const rangeStart = fromDate <= toDate ? fromDate : toDate;
  const rangeEnd = fromDate <= toDate ? toDate : fromDate;

  const [paidIncome, appointments, topServicesRaw, lowStock, pdvSales, openCashShift] =
    await Promise.all([
    prisma.financialEntry.findMany({
      where: {
        organizationId: orgId,
        type: "INCOME",
        status: "PAID",
        paidAt: { gte: rangeStart, lte: rangeEnd },
      },
      select: { amount: true, paidAt: true },
    }),
    prisma.appointment.groupBy({
      by: ["status"],
      where: {
        organizationId: orgId,
        startAt: { gte: rangeStart, lte: rangeEnd },
      },
      _count: { id: true },
    }),
    prisma.appointment.groupBy({
      by: ["serviceId"],
      where: {
        organizationId: orgId,
        serviceId: { not: null },
        startAt: { gte: rangeStart, lte: rangeEnd },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.inventoryItem.findMany({
      where: {
        organizationId: orgId,
        minQuantity: { gt: 0 },
      },
      orderBy: { quantity: "asc" },
    }),
    prisma.sale.aggregate({
      where: {
        organizationId: orgId,
        status: "PAID",
        createdAt: { gte: rangeStart, lte: rangeEnd },
      },
      _sum: { total: true },
      _count: true,
    }),
    prisma.cashShift.findFirst({
      where: { organizationId: orgId, closedAt: null },
      select: { id: true, openedAt: true },
    }),
  ]);

  const serviceIds = topServicesRaw
    .map((s) => s.serviceId)
    .filter((id): id is string => id !== null);
  const services = serviceIds.length
    ? await prisma.service.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, name: true },
      })
    : [];
  const serviceNameMap = new Map(services.map((s) => [s.id, s.name]));

  const monthLabels: string[] = [];
  const revenueByMonth = new Map<string, number>();
  const cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  const endMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);

  while (cursor <= endMonth) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    const label = cursor.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    monthLabels.push(label);
    revenueByMonth.set(key, 0);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  for (const entry of paidIncome) {
    if (!entry.paidAt) continue;
    const key = `${entry.paidAt.getFullYear()}-${String(entry.paidAt.getMonth() + 1).padStart(2, "0")}`;
    if (revenueByMonth.has(key)) {
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + entry.amount);
    }
  }

  const revenueRows = Array.from(revenueByMonth.entries()).map(([key, total], i) => ({
    month: monthLabels[i] ?? key,
    total,
  }));

  const appointmentTotal = appointments.reduce((sum, a) => sum + a._count.id, 0);
  const lowStockItems = lowStock.filter((i) => i.quantity <= i.minQuantity);

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Visão geral do desempenho do negócio."
        action={
          <ExportButtons
            plan={plan}
            module="financial"
            searchParams={{ from: toInputDate(rangeStart), to: toInputDate(rangeEnd) }}
          />
        }
      />

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="from" className="label">
            De
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={toInputDate(rangeStart)}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="to" className="label">
            Até
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={toInputDate(rangeEnd)}
            className="input"
          />
        </div>
        <button type="submit" className="btn-secondary">
          Filtrar
        </button>
      </form>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Agendamentos (período)</p>
          <p className="text-2xl font-bold text-slate-900">{appointmentTotal}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Receita (período)</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(revenueRows.reduce((s, r) => s + r.total, 0))}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Vendas PDV (período)</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(pdvSales._sum.total ?? 0)}
          </p>
          <p className="text-xs text-slate-500">{pdvSales._count} venda(s)</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Caixa</p>
          <p className={`text-2xl font-bold ${openCashShift ? "text-green-600" : "text-slate-500"}`}>
            {openCashShift ? "Aberto" : "Fechado"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Itens em estoque baixo</p>
          <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card overflow-hidden">
          <h2 className="border-b border-slate-100 px-4 py-3 text-lg font-semibold">
            Receita por mês
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Mês</th>
                <th className="px-4 py-3 text-right">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {revenueRows.map((row) => (
                <tr key={row.month}>
                  <td className="px-4 py-3 font-medium capitalize text-slate-900">{row.month}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatCurrency(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card overflow-hidden">
          <h2 className="border-b border-slate-100 px-4 py-3 text-lg font-semibold">
            Agendamentos por status
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Quantidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-slate-500">
                    Nenhum agendamento no período.
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.status}>
                    <td className="px-4 py-3 font-medium text-slate-900">{a.status}</td>
                    <td className="px-4 py-3 text-right">{a._count.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="card overflow-hidden">
          <h2 className="border-b border-slate-100 px-4 py-3 text-lg font-semibold">
            Top serviços (agendamentos)
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Serviço</th>
                <th className="px-4 py-3 text-right">Agendamentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topServicesRaw.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-slate-500">
                    Sem dados no período.
                  </td>
                </tr>
              ) : (
                topServicesRaw.map((s) => (
                  <tr key={s.serviceId ?? "unknown"}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {s.serviceId ? (serviceNameMap.get(s.serviceId) ?? "—") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">{s._count.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="card overflow-hidden">
          <h2 className="border-b border-slate-100 px-4 py-3 text-lg font-semibold">
            Estoque baixo
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 text-right">Qtd</th>
                <th className="px-4 py-3 text-right">Mín.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                    Nenhum item abaixo do mínimo.
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-right text-amber-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{item.minQuantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      {hasConsolidated && (
        <section className="card mt-8 overflow-hidden">
          <h2 className="border-b border-slate-100 px-4 py-3 text-lg font-semibold">
            Visão consolidada (Premium)
          </h2>
          <div className="grid gap-4 p-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Receita financeira</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(revenueRows.reduce((s, r) => s + r.total, 0))}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">PDV no período</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(pdvSales._sum.total ?? 0)}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Ticket médio PDV</p>
              <p className="text-xl font-bold text-slate-900">
                {pdvSales._count > 0
                  ? formatCurrency((pdvSales._sum.total ?? 0) / pdvSales._count)
                  : formatCurrency(0)}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
