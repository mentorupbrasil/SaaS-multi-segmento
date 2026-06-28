import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { DeleteButton } from "@/components/delete-button";
import { RecordForm } from "@/modules/records/record-form";
import { deleteCustomerRecord } from "@/modules/records/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function ProntuarioPage({
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
            { title: { contains: params.q, mode: "insensitive" as const } },
            { customer: { name: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [total, records, customers] = await Promise.all([
    prisma.customerRecord.count({ where }),
    prisma.customerRecord.findMany({
      where,
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title={term(terms, "records")}
        description={`Histórico e anotações por ${customerLabel.toLowerCase()}.`}
        action={<RecordForm customers={customers} customerLabel={customerLabel} />}
      />

      <ListToolbar searchValue={params.q} searchPlaceholder="Buscar por título ou cliente..." />

      {records.length === 0 ? (
        <EmptyState icon="FileText" description={params.q ? "Nenhum resultado." : "Nenhum registro ainda."} />
      ) : (
        <>
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link href={`/prontuario/${r.id}`} className="font-semibold text-slate-900 hover:text-brand-600">
                      {r.title}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {r.customer.name} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <DeleteButton action={deleteCustomerRecord.bind(null, r.id)} />
                </div>
                {r.content && (
                  <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm text-slate-700">{r.content}</p>
                )}
              </div>
            ))}
          </div>

          <Pagination
            total={total}
            page={params.page}
            pageSize={PAGE_SIZE}
            basePath="/prontuario"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
