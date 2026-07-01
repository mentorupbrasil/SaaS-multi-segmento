import type { AuthContext } from "@/lib/auth-context";

/** Filtro padrão multi-tenant — use em queries Prisma para isolar dados da organização. */
export function tenantWhere(ctx: AuthContext): { organizationId: string } {
  return { organizationId: ctx.orgId };
}

/** Combina filtro de tenant com condições extras. */
export function tenantWhereWith<T extends Record<string, unknown>>(
  ctx: AuthContext,
  extra: T,
): { organizationId: string } & T {
  return { organizationId: ctx.orgId, ...extra };
}
