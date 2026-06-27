import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { MemberForm } from "@/modules/team/member-form";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  STAFF: "Membro",
};

export default async function EquipePage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const professionalLabel = term(terms, "professional");

  const members = await prisma.membership.findMany({
    where: { organizationId: org.id },
    include: { user: true },
    orderBy: { role: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Equipe"
        description="Membros, papéis e permissões."
        action={<MemberForm professionalLabel={professionalLabel} />}
      />

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Permissão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{m.user.name}</td>
                <td className="px-4 py-3 text-slate-600">{m.user.email}</td>
                <td className="px-4 py-3 text-slate-600">{m.title ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    {ROLE_LABELS[m.role]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
