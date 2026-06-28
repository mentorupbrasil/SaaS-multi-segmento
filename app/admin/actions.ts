"use server";

import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/db";
import { isPlatformAdminEmail } from "@/lib/platform-admin";
import { ALL_SEGMENTS } from "@/segments";
import { getOrCreateDemoOrganization } from "@/lib/demo-org";

async function assertPlatformAdmin() {
  const session = await auth();
  const isAdmin =
    session?.user?.isPlatformAdmin ?? isPlatformAdminEmail(session?.user?.email);
  if (!isAdmin) return { error: "Sem permissão" as const };
  return { session };
}

export async function switchOrganizationAction(orgId: string) {
  const check = await assertPlatformAdmin();
  if ("error" in check) return check;

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    return { error: "Organização não encontrada" };
  }

  await unstable_update({ activeOrgId: orgId, previewSegmentId: org.segmentId });
  revalidatePath("/", "layout");

  return { ok: true };
}

/** Alterna a interface operacional para qualquer segmento registrado ({@link ALL_SEGMENTS}). */
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
  revalidatePath("/", "layout");

  return { ok: true };
}
