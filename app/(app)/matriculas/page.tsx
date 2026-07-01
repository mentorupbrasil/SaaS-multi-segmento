import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { ExportButtons } from "@/components/export-link";
import { DeleteButton } from "@/components/delete-button";
import { EnrollmentForm } from "@/modules/education/enrollment-form";
import { deleteEnrollment } from "@/modules/education/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  COMPLETED: "Concluída",
  CANCELED: "Cancelada",
};

export default async function MatriculasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  const raw = await searchParams;
  const params = parseListParams(raw);
  const statusFilter = raw.status?.trim() || undefined;
  const ctx = await getAuthContext();

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? {
          OR: [
            { customer: { name: { contains: params.q, mode: "insensitive" as const } } },
            { class: { name: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(statusFilter
      ? { status: statusFilter as "ACTIVE" | "SUSPENDED" | "COMPLETED" | "CANCELED" }
      : {}),
  };

  const [total, enrollments, classes, customers] = await Promise.all([
    prisma.enrollment.count({ where }),
    prisma.enrollment.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true } },
        class: { select: { id: true, name: true } },
      },
      orderBy: { enrolledAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
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

  const paginationParams = {
    q: params.q || undefined,
    status: statusFilter,
  };

  return (
    <div>
      <PageHeader
        title="Matrículas"
        description="Todas as matrículas de alunos nas turmas."
        action={<EnrollmentForm classes={classOptions} customers={customers.map((c) => ({ id: c.id, label: c.name }))} />}
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar
          searchValue={params.q}
          searchPlaceholder="Buscar aluno ou turma..."
          filters={[
            {
              name: "status",
              label: "Status",
              value: statusFilter,
              options: Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
            },
          ]}
        />
        <ExportButtons plan={ctx.organization.plan} module="matriculas" searchParams={paginationParams} />
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon="GraduationCap"
          description={
            params.q || statusFilter
              ? "Nenhum resultado para os filtros."
              : "Nenhuma matrícula registrada ainda."
          }
        />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Aluno</th>
                  <th className="px-4 py-3">Turma</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Matrícula</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/matriculas/${e.id}`} className="hover:text-primary">
                        {e.customer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <Link href={`/turmas/${e.class.id}`} className="hover:text-primary">
                        {e.class.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{STATUS_LABEL[e.status] ?? e.status}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(e.enrolledAt)}</td>
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

          <Pagination
            total={total}
            page={params.page}
            pageSize={PAGE_SIZE}
            basePath="/matriculas"
            searchParams={paginationParams}
          />
        </>
      )}
    </div>
  );
}
