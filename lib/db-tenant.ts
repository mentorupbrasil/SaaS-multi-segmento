import { prisma } from "@/lib/db";

/**
 * Executa callback com variável de sessão PostgreSQL para RLS.
 * Requer políticas em prisma/rls-apply.sql aplicadas no banco.
 */
export async function runWithTenantContext<T>(
  organizationId: string,
  userId: string | undefined,
  fn: () => Promise<T>,
): Promise<T> {
  await prisma.$executeRawUnsafe(
    `SELECT set_config('app.current_organization_id', $1, true)`,
    organizationId,
  );
  if (userId) {
    await prisma.$executeRawUnsafe(
      `SELECT set_config('app.current_user_id', $1, true)`,
      userId,
    );
  }
  try {
    return await fn();
  } finally {
    await prisma.$executeRawUnsafe(
      `SELECT set_config('app.current_organization_id', '', true)`,
    );
    await prisma.$executeRawUnsafe(`SELECT set_config('app.current_user_id', '', true)`);
  }
}

export async function isRlsEnabled(): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'app_current_organization_id'
      ) AS exists
    `;
    return rows[0]?.exists === true;
  } catch {
    return false;
  }
}
