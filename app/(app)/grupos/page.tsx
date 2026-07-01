import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getMasterDataOptions } from "@/lib/master-data";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
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
        <ExportCsvLink plan={ctx.organization.plan} module="grupos" searchParams={{ q: params.q || undefined }} />
      </div>

      {groups.length === 0 ? (
        <EmptyState icon="UsersRound" description={params.q ? "Nenhum resultado." : "Nenhum grupo cadastrado ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Membros</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {groups.map((g) => (
                  <tr key={g.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/grupos/${g.id}`} className="hover:text-primary">
                        {g.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{g.groupType ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{g._count.members}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(g.createdAt)}</td>
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
