import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { MarkPaidButton } from "@/components/mark-paid-button";
import { deleteFinancialEntry } from "@/modules/financial/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Em aberto",
  PAID: "Pago",
  OVERDUE: "Vencido",
};

export default async function FinanceiroDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const entry = await prisma.financialEntry.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      customer: { select: { id: true, name: true } },
      workOrder: { select: { id: true, title: true } },
      quote: { select: { id: true, title: true } },
      sale: { select: { id: true, total: true } },
    },
  });

  if (!entry) notFound();

  return (
    <div>
      <PageHeader title={entry.description} description="Lançamento financeiro" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/financeiro" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {entry.status !== "PAID" && <MarkPaidButton id={entry.id} />}
          <DeleteButton
            action={deleteFinancialEntry.bind(null, entry.id)}
            redirectTo="/financeiro"
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Valor</p>
          <p
            className={`text-2xl font-bold ${entry.type === "INCOME" ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(entry.amount)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Tipo</p>
          <p className="font-medium">{TYPE_LABEL[entry.type] ?? entry.type}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="font-medium">{STATUS_LABEL[entry.status] ?? entry.status}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Vencimento</p>
          <p className="font-medium">{entry.dueDate ? formatDate(entry.dueDate) : "—"}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entry.customer && (
          <div className="card p-4">
            <p className="text-xs text-slate-500">Cliente</p>
            <Link href={`/clientes/${entry.customer.id}`} className="font-medium hover:text-brand-600">
              {entry.customer.name}
            </Link>
          </div>
        )}
        {entry.workOrder && (
          <div className="card p-4">
            <p className="text-xs text-slate-500">Ordem de serviço</p>
            <Link
              href={`/ordens-de-servico/${entry.workOrder.id}`}
              className="font-medium hover:text-brand-600"
            >
              {entry.workOrder.title ?? "Ver OS"}
            </Link>
          </div>
        )}
        {entry.quote && (
          <div className="card p-4">
            <p className="text-xs text-slate-500">Orçamento</p>
            <Link href={`/orcamentos/${entry.quote.id}`} className="font-medium hover:text-brand-600">
              {entry.quote.title ?? "Ver orçamento"}
            </Link>
          </div>
        )}
        {entry.sale && (
          <div className="card p-4">
            <p className="text-xs text-slate-500">Venda PDV</p>
            <Link href={`/pdv/vendas`} className="font-medium hover:text-brand-600">
              {formatCurrency(entry.sale.total)}
            </Link>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Criado em {formatDate(entry.createdAt)}
        {entry.paidAt ? ` · Pago em ${formatDate(entry.paidAt)}` : ""}
      </p>
    </div>
  );
}
