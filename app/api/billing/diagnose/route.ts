import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { diagnoseAsaasConnection } from "@/lib/billing-asaas";
import { isPlatformAdminEmail } from "@/lib/platform-admin";
import { prisma } from "@/lib/db";

/** GET /api/billing/diagnose — testa API Asaas (owner ou super admin). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Faça login primeiro." }, { status: 401 });
  }

  const isPlatformAdmin =
    session.user.isPlatformAdmin ?? isPlatformAdminEmail(session.user.email);

  if (!isPlatformAdmin) {
    const sessionOrgId = session.user.activeOrgId || session.user.orgId;
    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        ...(sessionOrgId ? { organizationId: sessionOrgId } : {}),
        role: "OWNER",
      },
    });
    if (!membership) {
      return NextResponse.json({ error: "Apenas o proprietário pode diagnosticar cobrança." }, { status: 403 });
    }
  }

  const result = await diagnoseAsaasConnection();
  return NextResponse.json(result);
}
