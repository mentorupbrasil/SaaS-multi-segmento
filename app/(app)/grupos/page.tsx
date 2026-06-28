import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { GroupForm } from "@/modules/groups/group-form";
import { deleteGroup } from "@/modules/groups/actions";
import { formatDate } from "@/lib/utils";

export default async function GruposPage() {
  const ctx = await getAuthContext();

  const [groups, groupTypeItems] = await Promise.all([
    prisma.group.findMany({
      where: { organizationId: ctx.orgId },
      include: { _count: { select: { members: true } } },
      orderBy: { name: "asc" },
    }),
    getMasterDataOptions(ctx.orgId, "GROUP_TYPE"),
  ]);

  return (
    <div>
      <PageHeader
        title="Grupos"
        description="Turmas, células e grupos de participantes."
        action={<GroupForm groupTypeItems={groupTypeItems} />}
      />

      {groups.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum grupo cadastrado ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Membros</th>
                <th className="px-4 py-3">Cadastro</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{g.name}</td>
                  <td className="px-4 py-3 text-slate-600">{g.groupType ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{g._count.members}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(g.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/grupos/${g.id}`} className="text-sm text-brand-600 hover:underline">
                        Ver membros
                      </Link>
                      <DeleteButton action={deleteGroup.bind(null, g.id)} />
                    </div>
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
