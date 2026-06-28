import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getMasterDataOptions } from "@/lib/master-data";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { EventForm } from "@/modules/events/event-form";
import { EventStatusButtons } from "@/components/event-status-buttons";
import { DeleteButton } from "@/components/delete-button";
import { deleteBusinessEvent } from "@/modules/events/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<string, string> = {
  PLANNING: "Planejamento",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluído",
  CANCELED: "Cancelado",
};

export default async function EventosPage({
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

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, events, customers, eventTypeItems] = await Promise.all([
    prisma.businessEvent.count({ where }),
    prisma.businessEvent.findMany({
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
    getMasterDataOptions(ctx.orgId, "EVENT_TYPE"),
  ]);

  return (
    <div>
      <PageHeader
        title="Eventos"
        description="Gestão de eventos e produções."
        action={
          <EventForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            eventTypeItems={eventTypeItems}
          />
        }
      />

      <ListToolbar searchValue={params.q} searchPlaceholder="Buscar evento por nome..." />

      {events.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q ? "Nenhum resultado para a busca." : "Nenhum evento cadastrado ainda."}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">{term(terms, "customer")}</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/eventos/${e.id}`} className="hover:text-brand-600">
                        {e.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{e.customer?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{e.eventType ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {e.eventDate ? formatDate(e.eventDate) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {STATUS_LABEL[e.status] ?? e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(e.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <EventStatusButtons id={e.id} status={e.status} />
                        <DeleteButton action={deleteBusinessEvent.bind(null, e.id)} />
                      </div>
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
            basePath="/eventos"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
