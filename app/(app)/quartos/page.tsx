import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { RoomForm } from "@/modules/rooms/room-form";
import { RoomEditForm } from "@/modules/rooms/room-edit-form";
import { RoomStatusButtons } from "@/components/room-status-buttons";
import { DeleteButton } from "@/components/delete-button";
import { deleteRoom } from "@/modules/rooms/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

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

export default async function QuartosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();

  const where = {
    organizationId: ctx.orgId,
    ...(params.q ? { number: { contains: params.q, mode: "insensitive" as const } } : {}),
  };

  const [total, rooms, roomTypeItems] = await Promise.all([
    prisma.room.count({ where }),
    prisma.room.findMany({
      where,
      orderBy: { number: "asc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar por número..." />
        <ExportCsvLink plan={ctx.organization.plan} module="quartos" searchParams={{ q: params.q || undefined }} />
      </div>

      {rooms.length === 0 ? (
        <EmptyState icon="Bed" description={params.q ? "Nenhum resultado." : "Nenhum quarto cadastrado ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Diária</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/quartos/${r.id}`} className="hover:text-primary">
                        {r.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.type ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}
                      >
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCurrency(r.dailyRate)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(r.createdAt)}</td>
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

          <Pagination
            total={total}
            page={params.page}
            pageSize={PAGE_SIZE}
            basePath="/quartos"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
