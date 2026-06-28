import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { ReservationForm } from "@/modules/reservations/reservation-form";
import { ReservationStatusButtons } from "@/components/reservation-status-buttons";
import { DeleteButton } from "@/components/delete-button";
import { deleteReservation } from "@/modules/reservations/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CHECKED_IN: "Check-in",
  CHECKED_OUT: "Check-out",
  CANCELED: "Cancelada",
};

export default async function ReservasPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const customerLabel = term(terms, "customer");

  const [reservations, rooms, customers] = await Promise.all([
    prisma.reservation.findMany({
      where: { organizationId: ctx.orgId },
      include: {
        room: { select: { number: true } },
        customer: { select: { name: true } },
      },
      orderBy: { checkIn: "desc" },
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

      {reservations.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma reserva cadastrada ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
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
            <tbody className="divide-y divide-slate-100">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.room.number}</td>
                  <td className="px-4 py-3 text-slate-600">{r.customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(r.checkIn)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(r.checkOut)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(r.total)}</td>
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
      )}
    </div>
  );
}
