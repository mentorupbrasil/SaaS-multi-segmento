"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuthContext, requireRole } from "@/lib/auth-context";
import { setIntegration } from "@/lib/integrations-service";

export interface IntegrationActionState {
  error?: string;
  ok?: boolean;
}

const toggleSchema = z.object({
  provider: z.enum(["whatsapp", "pix", "google_calendar"]),
  enabled: z.enum(["true", "false"]),
});

export async function toggleIntegrationAction(
  _prev: IntegrationActionState,
  formData: FormData,
): Promise<IntegrationActionState> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = toggleSchema.safeParse({
    provider: formData.get("provider"),
    enabled: formData.get("enabled"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await setIntegration(ctx.orgId, parsed.data.provider, {
    enabled: parsed.data.enabled === "true",
  });

  revalidatePath("/conexoes");
  return { ok: true };
}
