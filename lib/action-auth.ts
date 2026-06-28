import type { Role } from "@prisma/client";
import type { AuthContext } from "@/lib/auth-context";

/** Exige papel adequado em server actions (mutações). Platform admin sempre passa. */
export function requireMutationRole(ctx: AuthContext, roles: Role[]): void {
  if (ctx.isPlatformAdmin) return;
  if (!roles.includes(ctx.role)) {
    throw new Error("Permissão insuficiente para esta ação");
  }
}
