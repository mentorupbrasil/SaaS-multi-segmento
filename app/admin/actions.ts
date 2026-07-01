"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/db";
import { isPlatformAdminEmail } from "@/lib/platform-admin";
import { ALL_SEGMENTS } from "@/segments";
import { getOrCreateDemoOrganization } from "@/lib/demo-org";
import { logPlatformAudit } from "@/lib/audit-log";

const PLAN_IDS = ["free", "starter", "pro", "premium", "enterprise"] as const;
const SUBSCRIPTION_STATUSES = ["ACTIVE", "TRIALING", "PAST_DUE", "CANCELED"] as const;

async function assertPlatformAdmin() {
  const session = await auth();
  const isAdmin =
    session?.user?.isPlatformAdmin ?? isPlatformAdminEmail(session?.user?.email);
  if (!isAdmin || !session?.user?.id) return { error: "Sem permissão" as const };
  return { session, userId: session.user.id };
}

export async function switchOrganizationAction(orgId: string) {
  const check = await assertPlatformAdmin();
  if ("error" in check) return check;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    return { error: "Organização não encontrada" };
  }

  await unstable_update({ activeOrgId: orgId, previewSegmentId: org.segmentId });
  await logPlatformAudit(check.userId, "admin.switch_organization", {
    organizationId: orgId,
    organizationName: org.name,
  });
  revalidatePath("/", "layout");

  return { ok: true };
}

/** Alterna a interface operacional para qualquer segmento registrado. */
export async function switchSegmentAction(segmentId: string) {
  const check = await assertPlatformAdmin();
  if ("error" in check) return check;

  if (!ALL_SEGMENTS.some((s) => s.id === segmentId)) {
    return { error: "Segmento inválido" };
  }

  const demoOrg = await getOrCreateDemoOrganization(segmentId);
  if (!demoOrg) {
    return { error: "Não foi possível abrir este segmento" };
  }

  await unstable_update({ activeOrgId: demoOrg.id, previewSegmentId: segmentId });
  await logPlatformAudit(check.userId, "admin.switch_segment", {
    segmentId,
    organizationId: demoOrg.id,
  });
  revalidatePath("/", "layout");

  return { ok: true };
}

const updateOrgSchema = z.object({
  orgId: z.string().min(1),
  plan: z.enum(PLAN_IDS),
  subscriptionStatus: z.enum(SUBSCRIPTION_STATUSES),
});

export interface AdminOrgActionState {
  error?: string;
  ok?: boolean;
}

export async function updateOrganizationAdminAction(
  _prev: AdminOrgActionState,
  formData: FormData,
): Promise<AdminOrgActionState> {
  const check = await assertPlatformAdmin();
  if ("error" in check) return check;

  const parsed = updateOrgSchema.safeParse({
    orgId: formData.get("orgId"),
    plan: formData.get("plan"),
    subscriptionStatus: formData.get("subscriptionStatus"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const before = await prisma.organization.findUnique({
    where: { id: parsed.data.orgId },
    select: { plan: true, subscriptionStatus: true, name: true },
  });
  if (!before) return { error: "Organização não encontrada" };

  await prisma.organization.update({
    where: { id: parsed.data.orgId },
    data: {
      plan: parsed.data.plan,
      subscriptionStatus: parsed.data.subscriptionStatus,
    },
  });

  await logPlatformAudit(check.userId, "admin.update_organization", {
    organizationId: parsed.data.orgId,
    organizationName: before.name,
    before: { plan: before.plan, subscriptionStatus: before.subscriptionStatus },
    after: { plan: parsed.data.plan, subscriptionStatus: parsed.data.subscriptionStatus },
  });

  revalidatePath("/admin/organizacoes");
  revalidatePath(`/admin/organizacoes/${parsed.data.orgId}`);
  revalidatePath("/admin/faturamento");
  return { ok: true };
}
