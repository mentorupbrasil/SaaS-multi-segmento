import { NextRequest, NextResponse } from "next/server";
import { processPendingAutomations } from "@/lib/automations";

/**
 * Processa fila de automações. Configure Vercel Cron apontando para esta rota.
 * Protegido por CRON_SECRET (header Authorization: Bearer <secret>).
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const processed = await processPendingAutomations(50);
  return NextResponse.json({ ok: true, processed });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
