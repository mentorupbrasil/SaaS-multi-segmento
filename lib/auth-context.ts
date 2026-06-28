import { cache } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isPlatformAdminEmail } from "@/lib/platform-admin";
import type { Organization, Role } from "@prisma/client";

export interface AuthContext {
  userId: string;
  orgId: string;
  role: Role;
  organization: Organization;
  isPlatformAdmin: boolean;
  /** Segmento exibido no painel (preview ou org real). */
  effectiveSegmentId: string;
  /** Modo preview: interface de outro segmento na org ativa. */
  isSegmentPreview: boolean;
}

async function resolveOrganization(
  userId: string,
  sessionOrgId: string | undefined,
  isPlatformAdmin: boolean,
): Promise<{ org: Organization; role: Role } | null> {
  if (isPlatformAdmin) {
    if (sessionOrgId) {
      const org = await prisma.organization.findUnique({ where: { id: sessionOrgId } });
      if (org) return { org, role: "OWNER" };
    }
    const org = await prisma.organization.findFirst({ orderBy: { name: "asc" } });
    if (org) return { org, role: "OWNER" };
    return null;
  }

  const membership = await prisma.membership.findFirst({
    where: { userId, ...(sessionOrgId ? { organizationId: sessionOrgId } : {}) },
    include: { organization: true },
  });
  if (membership) {
    return { org: membership.organization, role: membership.role };
  }

  const fallback = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
  });
  if (fallback) {
    return { org: fallback.organization, role: fallback.role };
  }

  return null;
}

/**
 * Fonte unica de verdade para multi-tenant.
 * Platform admin pode alternar organizacao via sessao (activeOrgId).
 */
export const getAuthContext = cache(async (): Promise<AuthContext> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Nao autenticado");
  }

  const isPlatformAdmin =
    session.user.isPlatformAdmin ?? isPlatformAdminEmail(session.user.email);

  const resolved = await resolveOrganization(
    session.user.id,
    session.user.activeOrgId || session.user.orgId,
    isPlatformAdmin,
  );

  if (!resolved) {
    throw new Error("Sem organizacao ativa");
  }

  const previewSegmentId = isPlatformAdmin
    ? session.user.previewSegmentId ?? session.previewSegmentId
    : undefined;
  const effectiveSegmentId =
    previewSegmentId && previewSegmentId !== resolved.org.segmentId
      ? previewSegmentId
      : resolved.org.segmentId;

  const organization =
    effectiveSegmentId === resolved.org.segmentId
      ? resolved.org
      : { ...resolved.org, segmentId: effectiveSegmentId };

  return {
    userId: session.user.id,
    orgId: resolved.org.id,
    role: resolved.role,
    organization,
    isPlatformAdmin,
    effectiveSegmentId,
    isSegmentPreview: Boolean(
      isPlatformAdmin && previewSegmentId && previewSegmentId !== resolved.org.segmentId,
    ),
  };
});

export const getOptionalAuthContext = cache(async (): Promise<AuthContext | null> => {
  try {
    return await getAuthContext();
  } catch {
    return null;
  }
});

export function requireRole(ctx: AuthContext, roles: Role[]): void {
  if (ctx.isPlatformAdmin) return;
  if (!roles.includes(ctx.role)) {
    throw new Error("Permissao insuficiente");
  }
}

export async function listOrganizationsForSwitcher() {
  return prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, segmentId: true, slug: true },
  });
}
