import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getSegment } from "@/segments";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ExportCsvLink } from "@/components/export-csv-link";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { DeleteButton } from "@/components/delete-button";
import { CustomerForm } from "@/modules/clients/customer-form";
import { deleteCustomer } from "@/modules/clients/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const segment = getSegment(org.segmentId);
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const customerLabel = term(terms, "customer");
  const customerPlural = term(terms, "customer_plural");

  const where = {
    organizationId: org.id,
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title={customerPlural}
        description={`Gerencie os ${customerPlural.toLowerCase()} do seu negócio.`}
        action={
          <CustomerForm customerLabel={customerLabel} customFields={segment?.customerFields ?? []} />
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar
          searchValue={params.q}
          searchPlaceholder={`Buscar ${customerLabel.toLowerCase()} por nome...`}
        />
        <ExportCsvLink plan={org.plan} module="clientes" searchParams={{ q: params.q || undefined }} />
      </div>

      {customers.length === 0 ? (
        <EmptyState
          description={
            params.q
              ? "Nenhum resultado para a busca."
              : `Nenhum ${customerLabel.toLowerCase()} cadastrado ainda.`
          }
          action={
            !params.q ? (
              <CustomerForm customerLabel={customerLabel} customFields={segment?.customerFields ?? []} />
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/clientes/${c.id}`} className="hover:text-primary">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone ?? "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email ?? "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deleteCustomer.bind(null, c.id)} />
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
            basePath="/clientes"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
