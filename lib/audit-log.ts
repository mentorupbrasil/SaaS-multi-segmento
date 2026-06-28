import { prisma } from "@/lib/db";
import type { AuthContext } from "@/lib/auth-context";

type AuditLogDelegate = {
  create: (args: {
    data: {
      organizationId: string;
      userId: string;
      action: string;
      metadata?: unknown;
    };
  }) => Promise<unknown>;
};

function getAuditLogClient(): AuditLogDelegate | undefined {
  return (prisma as unknown as { auditLog?: AuditLogDelegate }).auditLog;
}

/** Registra ação de auditoria quando o model AuditLog existir no schema. */
export async function logAudit(
  ctx: AuthContext,
  action: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const auditLog = getAuditLogClient();
  if (!auditLog) return;

  try {
    await auditLog.create({
      data: {
        organizationId: ctx.orgId,
        userId: ctx.userId,
        action,
        metadata: metadata ?? {},
      },
    });
  } catch {
    // Model pode não estar migrado ainda — não interrompe o fluxo principal.
  }
}
