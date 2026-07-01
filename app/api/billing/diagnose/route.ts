import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { diagnoseAsaasConnection } from "@/lib/billing-asaas";

/** GET /api/billing/diagnose — testa API Asaas (requer login). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Faça login primeiro." }, { status: 401 });
  }

  const result = await diagnoseAsaasConnection();
  return NextResponse.json(result);
}
