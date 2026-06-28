import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EventForm } from "@/modules/events/event-form";
import { EventStatusButtons } from "@/components/event-status-buttons";
import { DeleteButton } from "@/components/delete-button";
import { deleteBusinessEvent } from "@/modules/events/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  PLANNING: "Planejamento",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluído",
  CANCELED: "Cancelado",
};

export default async function EventosPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [events, customers] = await Promise.all([
    prisma.businessEvent.findMany({
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
        title="Eventos"
        description="Gestão de eventos e produções."
        action={<EventForm customers={customers.map((c) => ({ id: c.id, label: c.name }))} />}
      />

      {events.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum evento cadastrado ainda.</div>
      ) : (
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
                  <td className="px-4 py-3 font-medium text-slate-900">{e.name}</td>
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
      )}
    </div>
  );
}
