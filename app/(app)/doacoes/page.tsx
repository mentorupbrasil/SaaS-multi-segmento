import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getMasterDataOptions } from "@/lib/master-data";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { DeleteButton } from "@/components/delete-button";
import { DonationForm } from "@/modules/donations/donation-form";
import { deleteDonation } from "@/modules/donations/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function DoacoesPage({
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
  const customerLabel = term(terms, "customer");

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? {
          OR: [
            { description: { contains: params.q, mode: "insensitive" as const } },
            { customer: { name: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [total, donations, customers, donationTypeItems] = await Promise.all([
    prisma.donation.count({ where }),
    prisma.donation.findMany({
      where,
      include: { customer: { select: { name: true } } },
      orderBy: { receivedAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    getMasterDataOptions(ctx.orgId, "DONATION_TYPE"),
  ]);

  return (
    <div>
      <PageHeader
        title="Doações"
        description="Registro de doações recebidas."
        action={
          <DonationForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            customerLabel={customerLabel}
            donationTypeItems={donationTypeItems}
          />
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar doação ou doador..." />
        <ExportCsvLink module="doacoes" />
      </div>

      {donations.length === 0 ? (
        <EmptyState icon="HeartHandshake" description={params.q ? "Nenhum resultado." : "Nenhuma doação registrada ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">{customerLabel}</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Recebida em</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-green-600">{formatCurrency(d.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{d.donationType ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{d.customer?.name ?? "Anônimo"}</td>
                    <td className="px-4 py-3 text-slate-600">{d.description ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(d.receivedAt)}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deleteDonation.bind(null, d.id)} />
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
            basePath="/doacoes"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
