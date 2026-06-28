import { listUsers } from "@/lib/admin-queries";
import { formatDate } from "@/lib/utils";
import { getSegment } from "@/segments";

export default async function AdminUsersPage() {
  const users = await listUsers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
        <p className="mt-1 text-sm text-slate-500">{users.length} contas de acesso</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Organizações</th>
                <th className="px-4 py-3">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {user.memberships.length === 0 ? (
                      <span className="text-slate-400">Sem org</span>
                    ) : (
                      <ul className="space-y-1">
                        {user.memberships.map((m) => {
                          const seg = getSegment(m.organization.segmentId);
                          return (
                            <li key={m.id} className="text-xs">
                              <span className="font-medium">{m.organization.name}</span>
                              <span className="text-slate-400">
                                {" "}
                                · {seg?.label ?? m.organization.segmentId} · {m.role}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
