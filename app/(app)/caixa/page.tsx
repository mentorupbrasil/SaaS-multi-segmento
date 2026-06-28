import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { OpenShiftForm, CloseShiftForm } from "@/modules/financial/cash-shift-form";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function CaixaPage() {
  const ctx = await getAuthContext();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [openShift, todayIncome, todaySales] = await Promise.all([
    prisma.cashShift.findFirst({
      where: { organizationId: ctx.orgId, closedAt: null },
      include: { operator: { include: { user: true } } },
    }),
    prisma.financialEntry.aggregate({
      where: {
        organizationId: ctx.orgId,
        type: "INCOME",
        status: "PAID",
        paidAt: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { amount: true },
    }),
    prisma.sale.aggregate({
      where: {
        organizationId: ctx.orgId,
        status: "PAID",
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { total: true },
      _count: true,
    }),
  ]);

  const todayTotal = todayIncome._sum.amount ?? 0;

  return (
    <div>
      <PageHeader
        title="Caixa"
        description="Turnos de caixa e totais do dia."
        action={!openShift ? <OpenShiftForm /> : undefined}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Receitas pagas hoje</p>
          <p className="mt-1 text-xl font-bold text-green-600">{formatCurrency(todayTotal)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Vendas PDV hoje</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(todaySales._sum.total ?? 0)}</p>
          <p className="text-xs text-slate-500">{todaySales._count} venda(s)</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Status do caixa</p>
          <p className={`mt-1 text-xl font-bold ${openShift ? "text-green-600" : "text-slate-500"}`}>
            {openShift ? "Aberto" : "Fechado"}
          </p>
        </div>
      </div>

      {openShift ? (
        <div className="card p-6">
          <h2 className="mb-2 text-lg font-semibold">Turno aberto</h2>
          <p className="text-sm text-slate-600">
            Operador: {openShift.operator.user.name} · Aberto em {formatDateTime(openShift.openedAt)}
          </p>
          <p className="text-sm text-slate-600">
            Fundo de caixa: {formatCurrency(openShift.openingFloat)}
          </p>
          <CloseShiftForm shiftId={openShift.id} />
        </div>
      ) : (
        <div className="card p-10 text-center text-slate-500">
          Nenhum turno aberto. Clique em &quot;Abrir caixa&quot; para iniciar.
        </div>
      )}
    </div>
  );
}
