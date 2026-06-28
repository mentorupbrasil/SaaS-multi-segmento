import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/utils";
import {
  createSupportTicketAction,
  listOrganizationsForTickets,
  listSupportTickets,
  updateTicketStatusAction,
} from "./actions";
import { TicketCreateForm } from "./ticket-create-form";
import { TicketStatusSelect } from "./ticket-status-select";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

export default async function AdminTicketsPage() {
  const [tickets, organizations] = await Promise.all([
    listSupportTickets(),
    listOrganizationsForTickets(),
  ]);

  return (
    <div>
      <PageHeader
        title="Chamados"
        description="Central de suporte da plataforma."
        action={<TicketCreateForm organizations={organizations} action={createSupportTicketAction} />}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Assunto</th>
                <th className="px-4 py-3">Organização</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/60 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{ticket.subject}</p>
                    <p className="mt-1 max-w-md text-xs text-slate-500 line-clamp-2">{ticket.body}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {ticket.organization?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {STATUS_LABEL[ticket.status] ?? ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(ticket.createdAt)}</td>
                  <td className="px-4 py-3">
                    <TicketStatusSelect
                      ticketId={ticket.id}
                      currentStatus={ticket.status}
                      action={updateTicketStatusAction}
                    />
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Nenhum chamado registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
