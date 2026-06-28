import { NextResponse } from "next/server";
import path from "path";
import { auth } from "@/auth";
import { checkApiRateLimit, apiRateLimitResponse } from "@/lib/api-rate-limit";
import { storeUploadedFile } from "@/lib/file-upload";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const rl = checkApiRateLimit(`upload:${session.user.id}`, 20, 60_000);
  if (!rl.ok) return apiRateLimitResponse(rl.retryAfterMs);

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande (máx. 5 MB)" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await storeUploadedFile(buffer, safeName, file.type);

  if (!stored.ok || !stored.url) {
    return NextResponse.json({ error: stored.error ?? "Falha no upload" }, { status: 500 });
  }

  return NextResponse.json({ url: stored.url });
}
