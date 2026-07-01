import { prisma } from "@/lib/db";
import type { AuthContext } from "@/lib/auth-context";
import type { Prisma } from "@prisma/client";

function toJson(metadata?: Record<string, unknown>): Prisma.InputJsonValue {
  return (metadata ?? {}) as Prisma.InputJsonValue;
}

/** Registra ação de auditoria na organização ativa. */
export async function logAudit(
  ctx: AuthContext,
  action: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: ctx.orgId,
        userId: ctx.userId,
        action,
        metadata: toJson(metadata),
      },
    });
  } catch {
    // Não interrompe o fluxo principal.
  }
}

/** Registra ação de plataforma (super admin) sem org obrigatória. */
export async function logPlatformAudit(
  userId: string,
  action: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata: toJson(metadata),
      },
    });
  } catch {
    // Não interrompe o fluxo principal.
  }
}
