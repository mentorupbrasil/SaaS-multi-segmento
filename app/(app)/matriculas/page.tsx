import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { EnrollmentForm } from "@/modules/education/enrollment-form";
import { deleteEnrollment, listEnrollments } from "@/modules/education/actions";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
};

export default async function MatriculasPage() {
  const ctx = await getAuthContext();

  const [enrollments, classes, customers] = await Promise.all([
    listEnrollments(),
    prisma.schoolClass.findMany({
      where: { organizationId: ctx.orgId, active: true },
      select: { id: true, name: true, grade: true, shift: true },
      orderBy: { name: "asc" },
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const classOptions = classes.map((c) => ({
    id: c.id,
    label: [c.name, c.grade, c.shift].filter(Boolean).join(" · "),
  }));

  const customerOptions = customers.map((c) => ({
    id: c.id,
    label: c.name,
  }));

  return (
    <div>
      <PageHeader
        title="Matrículas"
        description="Todas as matrículas de alunos nas turmas."
        action={<EnrollmentForm classes={classOptions} customers={customerOptions} />}
      />

      {enrollments.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma matrícula registrada ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Aluno</th>
                <th className="px-4 py-3">Turma</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Matrícula</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollments.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/clientes/${e.customer.id}`} className="hover:text-brand-600">
                      {e.customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <Link href={`/turmas/${e.class.id}`} className="hover:text-brand-600">
                      {e.class.name}
                    </Link>
                  </td>
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
