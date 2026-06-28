import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
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

export default async function ReservationDetailPage({
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

  const reservation = await prisma.reservation.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      room: true,
      customer: true,
    },
  });

  if (!reservation) notFound();

  return (
    <div>
      <PageHeader
        title={`Quarto ${reservation.room.number}`}
        description={`${term(terms, "reservation")} · ${STATUS_LABEL[reservation.status] ?? reservation.status}`}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/reservas" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <DeleteButton action={deleteReservation.bind(null, reservation.id)} redirectTo="/reservas" />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">{term(terms, "customer")}</p>
          <p className="font-medium">
            <Link href={`/clientes/${reservation.customer.id}`} className="hover:text-brand-600">
              {reservation.customer.name}
            </Link>
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Quarto</p>
          <p className="font-medium">
            {reservation.room.number}
            {reservation.room.type ? ` · ${reservation.room.type}` : ""}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Check-in / Check-out</p>
          <p className="font-medium">
            {formatDate(reservation.checkIn)} — {formatDate(reservation.checkOut)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(reservation.total)}</p>
        </div>
      </div>

      {reservation.notes && (
        <div className="card mb-6 p-4">
          <p className="text-xs text-slate-500">Observações</p>
          <p className="text-sm">{reservation.notes}</p>
        </div>
      )}

      <ReservationStatusButtons id={reservation.id} status={reservation.status} />

      <p className="mt-4 text-xs text-slate-400">Criada em {formatDate(reservation.createdAt)}</p>
    </div>
  );
}
