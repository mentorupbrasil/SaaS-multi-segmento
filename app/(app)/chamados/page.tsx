import { PageHeader } from "@/components/page-header";
import { formatDateTime } from "@/lib/utils";
import { SUPPORT_TICKET_STATUS_LABELS, labelFor } from "@/lib/status-labels";
import { createTenantTicketAction, listTenantTickets } from "./actions";
import { TenantTicketForm } from "./tenant-ticket-form";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  IN_PROGRESS: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CLOSED: "bg-muted text-muted-foreground",
};

export default async function ChamadosPage() {
  const tickets = await listTenantTickets();

  return (
    <div>
      <PageHeader
        title="Suporte"
        description="Abra chamados e acompanhe o atendimento da nossa equipe."
      />

      <div className="mb-8">
        <TenantTicketForm action={createTenantTicketAction} />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Seus chamados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Assunto</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aberto em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                    Nenhum chamado ainda. Use o formulário acima para falar conosco.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="align-top hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{ticket.subject}</p>
                      <p className="mt-1 max-w-lg text-xs text-muted-foreground line-clamp-2">{ticket.body}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[ticket.status] ?? "bg-muted text-foreground"}`}
                      >
                        {labelFor(SUPPORT_TICKET_STATUS_LABELS, ticket.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDateTime(ticket.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
