import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PrintLayout } from "@/components/print-layout";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default async function PdvPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const org = ctx.organization;

  const sale = await prisma.sale.findFirst({
    where: { id, organizationId: ctx.orgId, status: "PAID" },
    include: {
      customer: { select: { name: true } },
      items: { orderBy: { id: "asc" } },
    },
  });

  if (!sale) notFound();

  return (
    <PrintLayout title="Cupom de venda">
      <div className="mb-6 border-b border-border pb-4 text-center">
        <h1 className="text-xl font-bold text-foreground">{org.name}</h1>
        <p className="text-sm text-muted-foreground">Cupom não fiscal</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(sale.createdAt)}</p>
      </div>

      <div className="mb-4 text-sm">
        <p>
          <span className="text-muted-foreground">Venda:</span>{" "}
          {sale.tableLabel ?? `#${sale.id.slice(-6)}`}
        </p>
        {sale.customer && (
          <p>
            <span className="text-muted-foreground">Cliente:</span> {sale.customer.name}
          </p>
        )}
        {sale.paymentMethod && (
          <p>
            <span className="text-muted-foreground">Pagamento:</span> {sale.paymentMethod}
          </p>
        )}
      </div>

      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <th className="py-2 pr-2">Item</th>
            <th className="py-2 pr-2 text-right">Qtd</th>
            <th className="py-2 pr-2 text-right">Unit.</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sale.items.map((item) => (
            <tr key={item.id}>
              <td className="py-2 pr-2">{item.description}</td>
              <td className="py-2 pr-2 text-right">{item.quantity}</td>
              <td className="py-2 pr-2 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="pt-4 text-right font-semibold">
              Total
            </td>
            <td className="pt-4 text-right text-lg font-bold">{formatCurrency(sale.total)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="text-center text-xs text-muted-foreground">Obrigado pela preferência!</p>

      <p className="mt-6 text-center text-xs text-muted-foreground print:hidden">
        <Link href="/pdv/vendas" className="text-primary hover:underline">
          ← Voltar ao histórico
        </Link>
      </p>
    </PrintLayout>
  );
}
