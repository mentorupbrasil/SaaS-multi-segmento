import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getSegment } from "@/segments";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { CustomerForm } from "@/modules/clients/customer-form";
import { formatDate } from "@/lib/utils";

export default async function ClientesPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const segment = getSegment(org.segmentId);
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const customerLabel = term(terms, "customer");

  const customers = await prisma.customer.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title={term(terms, "customer_plural")}
        description={`Gerencie os ${term(terms, "customer_plural").toLowerCase()} do seu negócio.`}
        action={
          <CustomerForm customerLabel={customerLabel} customFields={segment?.customerFields ?? []} />
        }
      />

      {customers.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          Nenhum {customerLabel.toLowerCase()} cadastrado ainda.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/clientes/${c.id}`} className="hover:text-brand-600">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.phone ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
