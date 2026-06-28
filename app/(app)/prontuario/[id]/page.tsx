import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { deleteCustomerRecord } from "@/modules/records/actions";
import { formatDate } from "@/lib/utils";

export default async function ProntuarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const customerLabel = term(terms, "customer");

  const record = await prisma.customerRecord.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      customer: true,
      attachments: true,
    },
  });

  if (!record) notFound();

  return (
    <div>
      <PageHeader title={record.title} description={term(terms, "records")} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/prontuario" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <DeleteButton action={deleteCustomerRecord.bind(null, record.id)} redirectTo="/prontuario" />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-xs text-slate-500">{customerLabel}</p>
          <p className="font-medium">
            <Link href={`/clientes/${record.customer.id}`} className="hover:text-brand-600">
              {record.customer.name}
            </Link>
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Registrado em</p>
          <p className="font-medium">{formatDate(record.createdAt)}</p>
        </div>
      </div>

      {record.content && (
        <div className="card mb-4 p-5">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Conteúdo</p>
          <p className="whitespace-pre-wrap text-sm text-slate-700">{record.content}</p>
        </div>
      )}

      {record.attachments.length > 0 && (
        <div className="card p-5">
          <p className="mb-3 text-xs font-semibold uppercase text-slate-500">Anexos</p>
          <ul className="space-y-2">
            {record.attachments.map((a) => (
              <li key={a.id}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:underline">
                  {a.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
