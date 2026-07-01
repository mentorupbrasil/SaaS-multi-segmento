import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EventStatusButtons } from "@/components/event-status-buttons";
import { EventTaskList } from "@/components/event-task-list";
import { EventTaskForm } from "@/modules/events/event-task-form";
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

export default async function EventDetailPage({
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

  const event = await prisma.businessEvent.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      customer: true,
      tasks: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
    },
  });

  if (!event) notFound();

  return (
    <div>
      <PageHeader
        title={event.name}
        description={`Evento · ${STATUS_LABEL[event.status] ?? event.status}`}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/eventos" className="text-sm text-primary hover:underline">
          ← Voltar
        </Link>
        <DeleteButton action={deleteBusinessEvent.bind(null, event.id)} redirectTo="/eventos" />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">{term(terms, "customer")}</p>
          <p className="font-medium">
            {event.customer ? (
              <Link href={`/clientes/${event.customer.id}`} className="hover:text-primary">
                {event.customer.name}
              </Link>
            ) : (
              "—"
            )}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Tipo</p>
          <p className="font-medium">{event.eventType ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Data / Local</p>
          <p className="font-medium">
            {[event.eventDate ? formatDate(event.eventDate) : null, event.location]
              .filter(Boolean)
              .join(" · ") || "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(event.total)}</p>
        </div>
      </div>

      {event.notes && <p className="mb-4 text-sm text-muted-foreground">{event.notes}</p>}

      <EventStatusButtons id={event.id} status={event.status} />

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-semibold">Tarefas</h2>
        <EventTaskForm eventId={event.id} />
        <div className="card overflow-hidden">
          <EventTaskList tasks={event.tasks} />
        </div>
      </section>
    </div>
  );
}
