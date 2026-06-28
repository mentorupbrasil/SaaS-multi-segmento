import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { HousekeepingTaskForm } from "@/modules/housekeeping/task-form";
import { HousekeepingTaskStatusButtons } from "@/components/housekeeping-task-status-buttons";
import { listHousekeepingTasks } from "@/modules/housekeeping/actions";
import { formatDate } from "@/lib/utils";

const ROOM_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponível",
  RESERVED: "Reservado",
  OCCUPIED: "Ocupado",
  MAINTENANCE: "Manutenção",
  BLOCKED: "Bloqueado",
};

const ROOM_STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700 border-green-200",
  RESERVED: "bg-purple-100 text-purple-700 border-purple-200",
  OCCUPIED: "bg-blue-100 text-blue-700 border-blue-200",
  MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
  BLOCKED: "bg-red-100 text-red-700 border-red-200",
};

const TASK_TYPE_LABEL: Record<string, string> = {
  CLEANING: "Limpeza",
  DEEP_CLEAN: "Limpeza profunda",
  TURNDOWN: "Arrumação",
  INSPECTION: "Inspeção",
  OTHER: "Outro",
};

const PRIORITY_LABEL: Record<string, string> = {
  LOW: "Baixa",
  NORMAL: "Normal",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  NORMAL: "bg-slate-100 text-slate-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

export default async function GovernancaPage() {
  const ctx = await getAuthContext();

  const [rooms, staff, pendingTasks, inProgressTasks] = await Promise.all([
    prisma.room.findMany({
      where: { organizationId: ctx.orgId },
      orderBy: { number: "asc" },
    }),
    prisma.membership.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: { select: { name: true } } },
      orderBy: { user: { name: "asc" } },
    }),
    listHousekeepingTasks({ status: "PENDING" }),
    listHousekeepingTasks({ status: "IN_PROGRESS" }),
  ]);

  const activeTasks = [...pendingTasks, ...inProgressTasks];
  const roomOptions = rooms.map((r) => ({
    id: r.id,
    label: `${r.number}${r.type ? ` — ${r.type}` : ""}`,
  }));

  return (
    <div>
      <PageHeader
        title="Governança"
        description="Painel de quartos e tarefas de housekeeping."
        action={
          rooms.length > 0 ? (
            <HousekeepingTaskForm
              rooms={roomOptions}
              staff={staff.map((m) => ({ id: m.id, name: m.user.name }))}
            />
          ) : undefined
        }
      />

      {rooms.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          Cadastre quartos em <strong>Quartos</strong> para usar o painel de governança.
        </div>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Mapa de quartos
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              {rooms.map((room) => {
                const roomTasks = activeTasks.filter((t) => t.roomId === room.id);
                return (
                  <div
                    key={room.id}
                    className={`card border p-4 ${ROOM_STATUS_STYLES[room.status] ?? "border-slate-200"}`}
                  >
                    <p className="text-lg font-bold">{room.number}</p>
                    <p className="text-xs opacity-80">{room.type ?? "—"}</p>
                    <p className="mt-2 text-xs font-medium">
                      {ROOM_STATUS_LABEL[room.status] ?? room.status}
                    </p>
                    {roomTasks.length > 0 && (
                      <p className="mt-2 text-xs font-semibold">
                        {roomTasks.length === 1
                          ? "1 tarefa pendente"
                          : `${roomTasks.length} tarefas pendentes`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Tarefas pendentes
            </h2>
            {activeTasks.length === 0 ? (
              <div className="card p-8 text-center text-slate-500">
                Nenhuma tarefa pendente. Crie uma nova tarefa para a equipe de governança.
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Quarto</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Prioridade</th>
                      <th className="px-4 py-3">Responsável</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Criada</th>
                      <th className="px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {task.room.number}
                          {task.room.type ? ` (${task.room.type})` : ""}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {TASK_TYPE_LABEL[task.taskType] ?? task.taskType}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
                          >
                            {PRIORITY_LABEL[task.priority] ?? task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {task.assignedStaff?.user.name ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {task.status === "IN_PROGRESS" ? "Em andamento" : "Pendente"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(task.createdAt)}</td>
                        <td className="px-4 py-3">
                          <HousekeepingTaskStatusButtons id={task.id} status={task.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
