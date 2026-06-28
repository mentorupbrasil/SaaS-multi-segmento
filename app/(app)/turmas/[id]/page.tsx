import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { ClassForm } from "@/modules/education/class-form";
import { EnrollmentForm } from "@/modules/education/enrollment-form";
import { deleteEnrollment, deleteSchoolClass } from "@/modules/education/actions";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
};

export default async function TurmaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const schoolClass = await prisma.schoolClass.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      teacher: { include: { user: { select: { name: true } } } },
      enrollments: {
        include: { customer: true },
        orderBy: { customer: { name: "asc" } },
      },
      _count: { select: { enrollments: true } },
    },
  });
  if (!schoolClass) notFound();

  const [teachers, customers] = await Promise.all([
    prisma.membership.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: { select: { name: true } } },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const enrolledIds = new Set(schoolClass.enrollments.map((e) => e.customerId));
  const availableCustomers = customers.filter((c) => !enrolledIds.has(c.id));

  const teacherOptions = teachers.map((t) => ({
    id: t.id,
    label: t.user.name,
  }));

  return (
    <div>
      <PageHeader
        title={schoolClass.name}
        description="Matrículas e detalhes da turma."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <EnrollmentForm
              classes={[{ id: schoolClass.id, label: schoolClass.name }]}
              customers={availableCustomers.map((c) => ({ id: c.id, label: c.name }))}
              defaultClassId={schoolClass.id}
            />
            <ClassForm
              teachers={teacherOptions}
              schoolClass={{
                id: schoolClass.id,
                name: schoolClass.name,
                grade: schoolClass.grade,
                shift: schoolClass.shift,
                capacity: schoolClass.capacity,
                room: schoolClass.room,
                teacherId: schoolClass.teacherId,
                active: schoolClass.active,
              }}
            />
            <DeleteButton
              action={deleteSchoolClass.bind(null, schoolClass.id)}
              redirectTo="/turmas"
            />
          </div>
        }
      />

      <div className="mb-4">
        <Link href="/turmas" className="text-sm text-brand-600 hover:underline">
          ← Voltar às turmas
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Série / Nível</p>
          <p className="font-medium">{schoolClass.grade ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Turno</p>
          <p className="font-medium">{schoolClass.shift ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Professor</p>
          <p className="font-medium">{schoolClass.teacher?.user.name ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Vagas</p>
          <p className="font-medium">
            {schoolClass._count.enrollments}/{schoolClass.capacity}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={`/frequencia?classId=${schoolClass.id}`}
          className="text-sm text-brand-600 hover:underline"
        >
          Registrar frequência desta turma
        </Link>
      </div>

      {schoolClass.enrollments.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma matrícula ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Aluno</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Matrícula</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schoolClass.enrollments.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/clientes/${e.customer.id}`} className="hover:text-brand-600">
                      {e.customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{e.customer.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{e.customer.email ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {STATUS_LABEL[e.status] ?? e.status}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(e.enrolledAt)}</td>
                  <td className="px-4 py-3">
                    <DeleteButton
                      label="Remover"
                      confirmMessage="Remover esta matrícula?"
                      action={deleteEnrollment.bind(null, e.id)}
                    />
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
