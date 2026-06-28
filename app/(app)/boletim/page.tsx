import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/utils";

export default async function BoletimPage() {
  const ctx = await getAuthContext();

  const enrollments = await prisma.enrollment.findMany({
    where: { organizationId: ctx.orgId, status: "ACTIVE" },
    include: {
      customer: { select: { id: true, name: true } },
      class: { select: { id: true, name: true } },
    },
    orderBy: [{ class: { name: "asc" } }, { customer: { name: "asc" } }],
  });

  const attendance = await prisma.attendanceRecord.findMany({
    where: { organizationId: ctx.orgId },
    select: { classId: true, customerId: true, present: true },
  });

  const stats = new Map<string, { present: number; total: number }>();
  for (const row of attendance) {
    const key = `${row.classId}:${row.customerId}`;
    const current = stats.get(key) ?? { present: 0, total: 0 };
    current.total += 1;
    if (row.present) current.present += 1;
    stats.set(key, current);
  }

  const byClass = new Map<string, typeof enrollments>();
  for (const e of enrollments) {
    const key = e.class.name;
    const list = byClass.get(key) ?? [];
    list.push(e);
    byClass.set(key, list);
  }

  return (
    <div>
      <PageHeader
        title="Boletim escolar"
        description="Resumo de frequência e desempenho por turma e aluno."
      />

      {byClass.size === 0 ? (
        <EmptyState icon="BookOpen" description="Nenhuma matrícula ativa. Cadastre turmas e matrículas primeiro." />
      ) : (
        <div className="space-y-6">
          {[...byClass.entries()].map(([className, students]) => (
            <section key={className}>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">{className}</h2>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Aluno</th>
                      <th className="px-4 py-3">Frequência</th>
                      <th className="px-4 py-3">Presenças</th>
                      <th className="px-4 py-3">Matrícula</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((e) => {
                      const s = stats.get(`${e.classId}:${e.customerId}`);
                      const rate = s && s.total > 0 ? Math.round((s.present / s.total) * 100) : null;
                      return (
                        <tr key={e.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{e.customer.name}</td>
                          <td className="px-4 py-3">
                            {rate != null ? (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  rate >= 75 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {rate}%
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {s ? `${s.present}/${s.total}` : "0/0"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{formatDate(e.enrolledAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
