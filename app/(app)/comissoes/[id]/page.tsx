import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { MarkCommissionPaidButton } from "@/modules/commission/mark-paid-button";
import { deleteCommissionEntry } from "@/modules/commission/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ComissaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const commission = await prisma.commissionEntry.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      staff: { include: { user: { select: { id: true, name: true } } } },
      customer: { select: { id: true, name: true } },
      workOrder: { select: { id: true, title: true } },
    },
  });

  if (!commission) notFound();

  const description = commission.description.replace(/ \[apt:[^\]]+\]/, "");

  return (
    <div>
      <PageHeader title={description} description="Detalhe da comissão" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/comissoes" className="text-sm text-primary hover:underline">
          ← Voltar
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {!commission.paidAt && <MarkCommissionPaidButton id={commission.id} />}
          <DeleteButton
            action={deleteCommissionEntry.bind(null, commission.id)}
            redirectTo="/comissoes"
          />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Valor</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(commission.amount)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Profissional</p>
          <Link href={`/equipe/${commission.staff.id}`} className="font-medium hover:text-primary">
            {commission.staff.user.name}
          </Link>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="font-medium">{commission.paidAt ? "Pago" : "Pendente"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Data</p>
          <p className="font-medium">{formatDate(commission.createdAt)}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {commission.customer && (
          <div className="card p-4">
            <p className="text-xs text-muted-foreground">Cliente</p>
            <Link
              href={`/clientes/${commission.customer.id}`}
              className="font-medium hover:text-primary"
            >
              {commission.customer.name}
            </Link>
          </div>
        )}
        {commission.workOrder && (
          <div className="card p-4">
            <p className="text-xs text-muted-foreground">Ordem de serviço</p>
            <Link
              href={`/ordens-de-servico/${commission.workOrder.id}`}
              className="font-medium hover:text-primary"
            >
              {commission.workOrder.title ?? "Ver OS"}
            </Link>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Registrado em {formatDate(commission.createdAt)}
        {commission.paidAt ? ` · Pago em ${formatDate(commission.paidAt)}` : ""}
      </p>
    </div>
  );
}
