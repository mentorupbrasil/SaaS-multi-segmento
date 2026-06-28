import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { RecordForm } from "@/modules/records/record-form";
import { formatDate } from "@/lib/utils";

export default async function ProntuarioPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const customerLabel = term(terms, "customer");

  const [records, customers] = await Promise.all([
    prisma.customerRecord.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
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

      {records.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum registro ainda.</div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{r.title}</p>
                  <p className="text-sm text-slate-500">
                    {r.customer.name} · {formatDate(r.createdAt)}
                  </p>
                </div>
              </div>
              {r.content && <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{r.content}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
