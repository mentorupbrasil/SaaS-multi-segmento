import { listAuditLogs } from "@/lib/admin-queries";
import { formatDateTime } from "@/lib/utils";

export default async function AdminAuditPage() {
  const logs = await listAuditLogs(150);

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Super admin</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Auditoria</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ações de plataforma e alterações registradas recentemente.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Quando</th>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Ação</th>
                <th className="px-4 py-3">Organização</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum registro ainda.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {log.user?.name ?? "—"}
                      {log.user?.email && (
                        <span className="block text-xs text-muted-foreground">{log.user.email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{log.action}</td>
                    <td className="px-4 py-3 text-muted-foreground">{log.organization?.name ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
