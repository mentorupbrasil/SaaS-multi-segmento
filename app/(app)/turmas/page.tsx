import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-link";
import { DeleteButton } from "@/components/delete-button";
import { ClassForm } from "@/modules/education/class-form";
import { deleteSchoolClass, listSchoolClasses } from "@/modules/education/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function TurmasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();

  const allClasses = await listSchoolClasses(params.q || undefined);
  const total = allClasses.length;
  const start = (params.page - 1) * PAGE_SIZE;
  const classes = allClasses.slice(start, start + PAGE_SIZE);

  const teachers = await prisma.membership.findMany({
    where: { organizationId: ctx.orgId },
    include: { user: { select: { name: true } } },
    orderBy: { user: { name: "asc" } },
  });

  const teacherOptions = teachers.map((t) => ({
    id: t.id,
    label: t.user.name,
  }));

  return (
    <div>
      <PageHeader
        title="Turmas"
        description="Cadastro de turmas, séries, turnos e capacidade."
        action={<ClassForm teachers={teacherOptions} />}
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar por nome, série, turno ou sala..." />
        <ExportButtons module="turmas" searchParams={{ q: params.q || undefined }} />
      </div>

      {classes.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q ? "Nenhuma turma encontrada." : "Nenhuma turma cadastrada ainda."}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Série</th>
                  <th className="px-4 py-3">Turno</th>
                  <th className="px-4 py-3">Sala</th>
                  <th className="px-4 py-3">Professor</th>
                  <th className="px-4 py-3">Alunos</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/turmas/${c.id}`} className="hover:text-brand-600">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.grade ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{c.shift ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{c.room ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{c.teacher?.user.name ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {c._count.enrollments}/{c.capacity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.active ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deleteSchoolClass.bind(null, c.id)} />
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
            basePath="/turmas"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
