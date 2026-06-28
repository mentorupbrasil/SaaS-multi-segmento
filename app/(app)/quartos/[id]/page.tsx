import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { RoomEditForm } from "@/modules/rooms/room-edit-form";
import { RoomStatusButtons } from "@/components/room-status-buttons";
import { DeleteButton } from "@/components/delete-button";
import { deleteRoom } from "@/modules/rooms/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  OCCUPIED: "Ocupado",
  MAINTENANCE: "Manutenção",
  BLOCKED: "Bloqueado",
};

export default async function QuartoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const [room, roomTypeItems, reservations] = await Promise.all([
    prisma.room.findFirst({ where: { id, organizationId: ctx.orgId } }),
    getMasterDataOptions(ctx.orgId, "ROOM_TYPE"),
    prisma.reservation.findMany({
      where: { roomId: id, organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
      orderBy: { checkIn: "desc" },
      take: 10,
    }),
  ]);

  if (!room) notFound();

  return (
    <div>
      <PageHeader title={`Quarto ${room.number}`} description="Detalhes da acomodação" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/quartos" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <RoomEditForm
            id={room.id}
            roomTypeItems={roomTypeItems}
            defaultValues={{
              number: room.number,
              type: room.type,
              dailyRate: room.dailyRate,
              notes: room.notes,
            }}
          />
          <RoomStatusButtons id={room.id} status={room.status} />
          <DeleteButton action={deleteRoom.bind(null, room.id)} redirectTo="/quartos" />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Tipo</p>
          <p className="font-medium">{room.type ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p className="font-medium">{STATUS_LABEL[room.status] ?? room.status}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Diária</p>
          <p className="font-medium">{formatCurrency(room.dailyRate)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Cadastro</p>
          <p className="font-medium">{formatDate(room.createdAt)}</p>
        </div>
      </div>

      {room.notes && (
        <div className="card mb-6 p-4">
          <p className="text-xs text-slate-500">Observações</p>
          <p className="text-sm">{room.notes}</p>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Reservas recentes</h2>
        {reservations.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">Nenhuma reserva.</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Hóspede</th>
                  <th className="px-4 py-3">Check-in</th>
                  <th className="px-4 py-3">Check-out</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/reservas/${r.id}`} className="font-medium hover:text-brand-600">
                        {r.customer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(r.checkIn)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(r.checkOut)}</td>
                    <td className="px-4 py-3 text-slate-600">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
