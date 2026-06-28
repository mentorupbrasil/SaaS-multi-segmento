import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { MemberForm } from "@/modules/groups/member-form";
import { DeleteButton } from "@/components/delete-button";
import { deleteGroup, removeGroupMember } from "@/modules/groups/actions";
import { formatDate } from "@/lib/utils";

export default async function GrupoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();

  const group = await prisma.group.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      members: { include: { customer: true }, orderBy: { customer: { name: "asc" } } },
    },
  });
  if (!group) notFound();

  const customers = await prisma.customer.findMany({
    where: { organizationId: ctx.orgId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const memberIds = new Set(group.members.map((m) => m.customerId));
  const availableCustomers = customers.filter((c) => !memberIds.has(c.id));

  return (
    <div>
      <PageHeader
        title={group.name}
        description={group.description ?? "Membros do grupo"}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <MemberForm
              groupId={group.id}
              customers={availableCustomers.map((c) => ({ id: c.id, label: c.name }))}
            />
            <DeleteButton
              action={deleteGroup.bind(null, group.id)}
              redirectTo="/grupos"
            />
          </div>
        }
      />

      <div className="mb-4">
        <Link href="/grupos" className="text-sm text-brand-600 hover:underline">
          ← Voltar aos grupos
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Tipo</p>
          <p className="font-medium">{group.groupType ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Membros</p>
          <p className="font-medium">{group.members.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Cadastro</p>
          <p className="font-medium">{formatDate(group.createdAt)}</p>
        </div>
      </div>

      {group.members.length === 0 ? (
        <EmptyState
          icon="UsersRound"
          description="Nenhum membro ainda. Adicione clientes ao grupo."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {group.members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/clientes/${m.customer.id}`} className="hover:text-brand-600">
                      {m.customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.customer.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{m.customer.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <DeleteButton
                      label="Remover"
                      confirmMessage="Remover este membro do grupo?"
                      action={removeGroupMember.bind(null, group.id, m.customerId)}
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

