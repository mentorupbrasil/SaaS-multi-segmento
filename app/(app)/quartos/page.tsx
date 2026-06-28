import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { RoomForm } from "@/modules/rooms/room-form";
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

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  OCCUPIED: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  BLOCKED: "bg-red-100 text-red-700",
};

export default async function QuartosPage() {
  const ctx = await getAuthContext();

  const [rooms, roomTypeItems] = await Promise.all([
    prisma.room.findMany({
      where: { organizationId: ctx.orgId },
      orderBy: { number: "asc" },
    }),
    getMasterDataOptions(ctx.orgId, "ROOM_TYPE"),
  ]);

  return (
    <div>
      <PageHeader
        title="Quartos"
        description="Gestão de quartos e acomodações."
        action={<RoomForm roomTypeItems={roomTypeItems} />}
      />

      {rooms.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum quarto cadastrado ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Número</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Diária</th>
                <th className="px-4 py-3">Cadastro</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.number}</td>
                  <td className="px-4 py-3 text-slate-600">{r.type ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}
                    >
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(r.dailyRate)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <RoomEditForm
                        id={r.id}
                        roomTypeItems={roomTypeItems}
                        defaultValues={{
                          number: r.number,
                          type: r.type,
                          dailyRate: r.dailyRate,
                          notes: r.notes,
                        }}
                      />
                      <RoomStatusButtons id={r.id} status={r.status} />
                      <DeleteButton action={deleteRoom.bind(null, r.id)} />
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
