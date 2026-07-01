import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { EnrollmentStatusSelect } from "@/components/enrollment-status-select";
import { deleteEnrollment } from "@/modules/education/actions";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
};

export default async function MatriculaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const enrollment = await prisma.enrollment.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      customer: true,
      class: { include: { teacher: { include: { user: { select: { name: true } } } } } },
    },
  });

  if (!enrollment) notFound();

  const [attendance, financialOpen] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: {
        organizationId: ctx.orgId,
        customerId: enrollment.customerId,
        classId: enrollment.classId,
      },
      orderBy: { date: "desc" },
      take: 15,
    }),
    prisma.financialEntry.findMany({
      where: {
        organizationId: ctx.orgId,
        customerId: enrollment.customerId,
        status: { in: ["PENDING", "OVERDUE"] },
        type: "INCOME",
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
  ]);

  const present = attendance.filter((a) => a.present).length;
  const rate = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : null;

  return (
    <div>
      <PageHeader title="Matrícula" description={`${enrollment.customer.name} · ${enrollment.class.name}`} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/matriculas" className="text-sm text-primary hover:underline">
          ← Voltar
        </Link>
        <DeleteButton
          action={deleteEnrollment.bind(null, enrollment.id)}
          redirectTo="/matriculas"
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Aluno</p>
          <Link href={`/clientes/${enrollment.customer.id}`} className="font-medium hover:text-primary">
            {enrollment.customer.name}
          </Link>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Turma</p>
          <Link href={`/turmas/${enrollment.class.id}`} className="font-medium hover:text-primary">
            {enrollment.class.name}
          </Link>
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Status</p>
          <EnrollmentStatusSelect id={enrollment.id} status={enrollment.status} />
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Frequência recente</p>
          <p className="text-xl font-bold text-primary">{rate != null ? `${rate}%` : "—"}</p>
        </div>
      </div>

      {enrollment.notes && (
        <p className="mb-6 text-sm text-muted-foreground">{enrollment.notes}</p>
      )}

      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">Presenças recentes</h2>
          {attendance.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem registros de frequência.</p>
          ) : (
            <div className="card divide-y divide-border text-sm">
              {attendance.map((a) => (
                <div key={a.id} className="flex justify-between px-4 py-3">
                  <span>{formatDate(a.date)}</span>
                  <span className={a.present ? "text-green-600" : "text-red-600"}>
                    {a.present ? "Presente" : "Falta"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Mensalidades em aberto</h2>
          {financialOpen.length === 0 ? (
            <p className="text-sm text-green-600">Nenhuma pendência.</p>
          ) : (
            <div className="card divide-y divide-border text-sm">
              {financialOpen.map((f) => (
                <div key={f.id} className="flex justify-between px-4 py-3">
                  <span>{f.description}</span>
                  <span className="text-amber-600">
                    {f.dueDate ? formatDate(f.dueDate) : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <p className="text-xs text-muted-foreground">
        Matriculado em {formatDate(enrollment.enrolledAt)} · Status: {STATUS_LABEL[enrollment.status] ?? enrollment.status}
      </p>
    </div>
  );
}
