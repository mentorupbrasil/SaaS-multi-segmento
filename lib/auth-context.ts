import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { Organization, Role } from "@prisma/client";

export interface AuthContext {
  userId: string;
  orgId: string;
  role: Role;
  organization: Organization;
}

/**
 * Fonte unica de verdade para multi-tenant.
 * Le userId/orgId da SESSAO (nunca do cliente) e valida o membership no banco.
 * Deve ser chamado no inicio de TODA Server Action / query com dados do tenant.
 */
export const getAuthContext = cache(async (): Promise<AuthContext> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Nao autenticado");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!membership) {
    throw new Error("Sem organizacao ativa");
  }

  return {
    userId: session.user.id,
    orgId: membership.organizationId,
    role: membership.role,
    organization: membership.organization,
  };
});

/** Versao que retorna null em vez de lancar (para layouts/paginas). */
export const getOptionalAuthContext = cache(async (): Promise<AuthContext | null> => {
  try {
    return await getAuthContext();
  } catch {
    return null;
  }
});

/** Garante que o papel do usuario esta entre os permitidos. */
export function requireRole(ctx: AuthContext, roles: Role[]): void {
  if (!roles.includes(ctx.role)) {
    throw new Error("Permissao insuficiente");
  }
}
