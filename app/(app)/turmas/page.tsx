import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams, paginate } from "@/lib/list-params";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { ClassForm } from "@/modules/education/class-form";
import { deleteSchoolClass, listSchoolClasses } from "@/modules/education/actions";
import { formatDate } from "@/lib/utils";

export default async function TurmasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();

  const [allClasses, teachers] = await Promise.all([
    listSchoolClasses(params.q || undefined),
    prisma.membership.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: { select: { name: true } } },
      orderBy: { user: { name: "asc" } },
    }),
  ]);

  const { items: classes, total, page, totalPages } = paginate(allClasses, params.page, params.pageSize);

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

      <form className="mb-4 flex flex-wrap items-center gap-2">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Buscar por nome, série, turno ou sala..."
          className="input min-w-[240px] flex-1"
        />
        <button type="submit" className="btn-secondary">
          Buscar
        </button>
        {params.q && (
          <Link href="/turmas" className="text-sm text-brand-600 hover:underline">
            Limpar
          </Link>
        )}
      </form>

      {classes.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q ? "Nenhuma turma encontrada para a busca." : "Nenhuma turma cadastrada ainda."}
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
                    <td className="px-4 py-3 text-slate-600">
                      {c.teacher?.user.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c._count.enrollments}/{c.capacity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.active
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.active ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/turmas/${c.id}`}
                          className="text-sm text-brand-600 hover:underline"
                        >
                          Ver matrículas
                        </Link>
                        <DeleteButton action={deleteSchoolClass.bind(null, c.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>
                {total} turma(s) — página {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/turmas?q=${encodeURIComponent(params.q)}&page=${page - 1}`}
                    className="btn-secondary"
                  >
                    Anterior
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/turmas?q=${encodeURIComponent(params.q)}&page=${page + 1}`}
                    className="btn-secondary"
                  >
                    Próxima
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
