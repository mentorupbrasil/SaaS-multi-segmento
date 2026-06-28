import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { DeleteButton } from "@/components/delete-button";
import { GroupForm } from "@/modules/groups/group-form";
import { deleteGroup } from "@/modules/groups/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function GruposPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();

  const where = {
    organizationId: ctx.orgId,
    ...(params.q ? { name: { contains: params.q, mode: "insensitive" as const } } : {}),
  };

  const [total, groups, groupTypeItems] = await Promise.all([
    prisma.group.count({ where }),
    prisma.group.findMany({
      where,
      include: { _count: { select: { members: true } } },
      orderBy: { name: "asc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar grupo..." />
        <ExportCsvLink module="grupos" searchParams={{ q: params.q || undefined }} />
      </div>

      {groups.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q ? "Nenhum resultado." : "Nenhum grupo cadastrado ainda."}
        </div>
      ) : (
        <>
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
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/grupos/${g.id}`} className="hover:text-brand-600">
                        {g.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{g.groupType ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{g._count.members}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(g.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deleteGroup.bind(null, g.id)} />
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
            basePath="/grupos"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
