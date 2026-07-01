import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
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
          <p className="text-sm text-muted-foreground">Receitas pagas hoje</p>
          <p className="mt-1 text-xl font-bold text-green-600">{formatCurrency(todayTotal)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted-foreground">Vendas PDV hoje</p>
          <p className="mt-1 text-xl font-bold text-foreground">{formatCurrency(todaySales._sum.total ?? 0)}</p>
          <p className="text-xs text-muted-foreground">{todaySales._count} venda(s)</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted-foreground">Status do caixa</p>
          <p className={`mt-1 text-xl font-bold ${openShift ? "text-green-600" : "text-muted-foreground"}`}>
            {openShift ? "Aberto" : "Fechado"}
          </p>
        </div>
      </div>

      {openShift ? (
        <div className="card p-6">
          <h2 className="mb-2 text-lg font-semibold">Turno aberto</h2>
          <p className="text-sm text-muted-foreground">
            Operador: {openShift.operator.user.name} · Aberto em {formatDateTime(openShift.openedAt)}
          </p>
          <p className="text-sm text-muted-foreground">
            Fundo de caixa: {formatCurrency(openShift.openingFloat)}
          </p>
          <CloseShiftForm shiftId={openShift.id} />
        </div>
      ) : (
        <EmptyState icon="Wallet" description="Nenhum turno aberto. Clique em Abrir caixa para iniciar." />
      )}
    </div>
  );
}
