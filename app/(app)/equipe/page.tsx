import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { formatUserLimit, getOrgUsage } from "@/lib/plan-limits";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { MemberForm } from "@/modules/team/member-form";

const PAGE_SIZE = 20;

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  STAFF: "Membro",
};

export default async function EquipePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const usage = await getOrgUsage(org.id);
  const atUserLimit =
    usage.limits.maxUsers !== null && usage.userCount >= usage.limits.maxUsers;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const professionalLabel = term(terms, "professional");

  const where = {
    organizationId: org.id,
    ...(params.q
      ? {
          OR: [
            { user: { name: { contains: params.q, mode: "insensitive" as const } } },
            { user: { email: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [total, members] = await Promise.all([
    prisma.membership.count({ where }),
    prisma.membership.findMany({
      where,
      include: { user: true },
      orderBy: { role: "asc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Equipe"
        description={`Membros, papéis e permissões · ${usage.userCount}/${formatUserLimit(org.plan)} usuários`}
        action={!atUserLimit ? <MemberForm professionalLabel={professionalLabel} /> : undefined}
      />

      {atUserLimit && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Limite de usuários do plano atingido.{" "}
          <Link href="/assinatura" className="font-semibold underline">
            Faça upgrade
          </Link>{" "}
          para convidar mais membros.
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar por nome ou e-mail..." />
        <ExportCsvLink plan={org.plan} module="equipe" searchParams={{ q: params.q || undefined }} />
      </div>

      {members.length === 0 ? (
        <EmptyState icon="UserCog" description={params.q ? "Nenhum resultado." : "Nenhum membro cadastrado."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Cargo</th>
                  <th className="px-4 py-3">Permissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/equipe/${m.id}`} className="hover:text-primary">
                        {m.user.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.title ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-primary">
                        {ROLE_LABELS[m.role]}
                      </span>
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
            basePath="/equipe"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
