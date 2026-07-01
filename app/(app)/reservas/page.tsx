import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { ReservationForm } from "@/modules/reservations/reservation-form";
import { ReservationStatusButtons } from "@/components/reservation-status-buttons";
import { DeleteButton } from "@/components/delete-button";
import { deleteReservation } from "@/modules/reservations/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CHECKED_IN: "Check-in",
  CHECKED_OUT: "Check-out",
  CANCELED: "Cancelada",
};

export default async function ReservasPage({
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
            { customer: { name: { contains: params.q, mode: "insensitive" as const } } },
            { room: { number: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [total, reservations, rooms, customers] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.reservation.findMany({
      where,
      include: {
        room: { select: { number: true } },
        customer: { select: { name: true } },
      },
      orderBy: { checkIn: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.room.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, number: true, dailyRate: true, status: true },
      orderBy: { number: "asc" },
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
        title="Reservas"
        description="Reservas de quartos e hospedagem."
        action={
          <ReservationForm
            rooms={rooms.map((r) => ({
              id: r.id,
              label: `${r.number} — ${formatCurrency(r.dailyRate)}/dia (${r.status})`,
            }))}
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            customerLabel={customerLabel}
          />
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar hóspede ou quarto..." />
        <ExportCsvLink plan={ctx.organization.plan} module="reservas" />
      </div>

      {reservations.length === 0 ? (
        <EmptyState icon="CalendarCheck" description={params.q ? "Nenhum resultado." : "Nenhuma reserva cadastrada ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Quarto</th>
                  <th className="px-4 py-3">{customerLabel}</th>
                  <th className="px-4 py-3">Check-in</th>
                  <th className="px-4 py-3">Check-out</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/reservas/${r.id}`} className="hover:text-primary">
                        {r.room.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(r.checkIn)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(r.checkOut)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCurrency(r.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <ReservationStatusButtons id={r.id} status={r.status} />
                        <DeleteButton action={deleteReservation.bind(null, r.id)} />
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
            basePath="/reservas"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
