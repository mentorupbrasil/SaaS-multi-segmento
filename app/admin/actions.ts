"use server";

import { revalidatePath } from "next/cache";
import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/db";
import { isPlatformAdminEmail } from "@/lib/platform-admin";

export async function switchOrganizationAction(orgId: string) {
  const session = await auth();
  const isAdmin =
    session?.user?.isPlatformAdmin ?? isPlatformAdminEmail(session?.user?.email);
  if (!isAdmin) {
    return { error: "Sem permissão" };
  }

  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    return { error: "Organização não encontrada" };
  }

  await unstable_update({ activeOrgId: orgId });
  revalidatePath("/", "layout");

  return { ok: true };
}
