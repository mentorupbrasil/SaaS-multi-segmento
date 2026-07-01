import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { AttendanceForm } from "@/modules/education/attendance-form";
import { listAttendanceRecords } from "@/modules/education/actions";

function todayIso() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default async function FrequenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; date?: string }>;
}) {
  const { classId, date: dateParam } = await searchParams;
  const ctx = await getAuthContext();
  const date = dateParam || todayIso();

  const classes = await prisma.schoolClass.findMany({
    where: { organizationId: ctx.orgId, active: true },
    select: { id: true, name: true, grade: true, shift: true },
    orderBy: { name: "asc" },
  });

  const selectedClassId = classId ?? classes[0]?.id;
  const attendance =
    selectedClassId != null
      ? await listAttendanceRecords(selectedClassId, date)
      : { class: null, records: [], enrollments: [] };

  const recordByCustomer = new Map(
    attendance.records.map((r) => [r.customerId, r]),
  );

  const students = attendance.enrollments.map((e) => {
    const record = recordByCustomer.get(e.customerId);
    return {
      customerId: e.customerId,
      name: e.customer.name,
      present: record?.present ?? false,
      notes: record?.notes ?? null,
    };
  });

  return (
    <div>
      <PageHeader
        title="Frequência"
        description="Registro de presença por turma e data."
      />

      <form className="card mb-6 grid gap-4 p-4 sm:grid-cols-3">
        <div>
          <label className="label">Turma</label>
          <select name="classId" className="input" defaultValue={selectedClassId ?? ""}>
            {classes.length === 0 ? (
              <option value="">Nenhuma turma ativa</option>
            ) : (
              classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {[c.name, c.grade, c.shift].filter(Boolean).join(" · ")}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="label">Data</label>
          <input name="date" type="date" className="input" defaultValue={date} />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-secondary">
            Carregar
          </button>
        </div>
      </form>

      {classes.length === 0 ? (
        <EmptyState icon="CalendarCheck" description="Cadastre uma turma ativa para registrar frequência. 
          <Link href=/turmas className=text-primary hover:underline>
            Ir para turmas
          </Link>" />
      ) : selectedClassId && attendance.class ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Turma: <span className="font-medium">{attendance.class.name}</span> —{" "}
            {new Intl.DateTimeFormat("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date(`${date}T12:00:00`))}
          </p>
          <AttendanceForm classId={selectedClassId} date={date} students={students} />
        </>
      ) : null}
    </div>
  );
}
