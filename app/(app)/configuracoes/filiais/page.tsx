import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getPlanLimits } from "@/lib/plan-limits";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { DeleteButton } from "@/components/delete-button";
import { BranchForm } from "@/modules/branches/branch-form";
import { deleteBranch } from "@/modules/branches/actions";
import { formatDate } from "@/lib/utils";

export default async function FiliaisPage() {
  const ctx = await getAuthContext();
  const limits = getPlanLimits(ctx.organization.plan);

  const branches = await prisma.branch.findMany({
    where: { organizationId: ctx.orgId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  const atLimit =
    limits.maxBranches !== null && branches.length >= limits.maxBranches;

  return (
    <div>
      <PageHeader
        title="Filiais"
        description="Unidades e endereços do seu negócio."
        action={!atLimit ? <BranchForm /> : undefined}
      />

      <Link href="/configuracoes" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Voltar às configurações
      </Link>

      {limits.maxBranches !== null && (
        <p className="mb-4 text-sm text-muted-foreground">
          Plano atual: até {limits.maxBranches} filial(is). Em uso: {branches.length}.
        </p>
      )}

      {atLimit && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Limite de filiais atingido.{" "}
          <Link href="/assinatura" className="font-medium underline">
            Fazer upgrade
          </Link>
        </div>
      )}

      {branches.length === 0 ? (
        <EmptyState
          icon="Building2"
          description="Nenhuma filial cadastrada. A primeira filial criada será a padrão."
          action={!atLimit ? <BranchForm /> : undefined}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Endereço</th>
                <th className="px-4 py-3">Cadastro</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-muted">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {b.name}
                    {b.isDefault && (
                      <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                        Padrão
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{b.address ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(b.createdAt)}</td>
                  <td className="px-4 py-3">
                    {!b.isDefault && (
                      <DeleteButton
                        label="Excluir"
                        action={deleteBranch.bind(null, b.id)}
                      />
                    )}
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
