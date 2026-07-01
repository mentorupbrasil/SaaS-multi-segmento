"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAuthContext, requireRole } from "@/lib/auth-context";
import { setIntegration, getIntegration } from "@/lib/integrations-service";
import { TOGGLEABLE_INTEGRATION_PROVIDERS } from "@/lib/integration-definitions";
import type { Prisma } from "@prisma/client";

export interface IntegrationActionState {
  error?: string;
  ok?: boolean;
}

const toggleSchema = z.object({
  provider: z.enum(TOGGLEABLE_INTEGRATION_PROVIDERS),
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

  const existing = await getIntegration(ctx.orgId, parsed.data.provider);
  await setIntegration(ctx.orgId, parsed.data.provider, {
    enabled: parsed.data.enabled === "true",
    config: existing?.config ?? {},
  });

  revalidatePath("/conexoes");
  revalidatePath("/fiscal");
  return { ok: true };
}

const whatsappConfigSchema = z.object({
  provider: z.literal("whatsapp"),
  apiUrl: z.string().url("Informe uma URL válida").or(z.literal("")),
  apiToken: z.string().optional(),
});

const nfeConfigSchema = z.object({
  provider: z.literal("nfe"),
  cnpj: z.string().optional(),
  regime: z.enum(["simples", "presumido", "real"]).optional(),
  ambiente: z.enum(["homologacao", "producao"]).optional(),
});

export async function saveIntegrationConfigAction(
  _prev: IntegrationActionState,
  formData: FormData,
): Promise<IntegrationActionState> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const provider = formData.get("provider");
  const existing = await getIntegration(ctx.orgId, String(provider));

  if (provider === "whatsapp") {
    const parsed = whatsappConfigSchema.safeParse({
      provider,
      apiUrl: formData.get("apiUrl") ?? "",
      apiToken: formData.get("apiToken") ?? "",
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    const prevConfig =
      existing?.config && typeof existing.config === "object"
        ? (existing.config as Record<string, unknown>)
        : {};

    const config: Prisma.InputJsonValue = {
      ...prevConfig,
      apiUrl: parsed.data.apiUrl,
      apiToken: parsed.data.apiToken || prevConfig.apiToken || "",
    };

    await setIntegration(ctx.orgId, "whatsapp", { config, enabled: existing?.enabled ?? false });
    revalidatePath("/conexoes");
    return { ok: true };
  }

  if (provider === "nfe") {
    const parsed = nfeConfigSchema.safeParse({
      provider,
      cnpj: formData.get("cnpj") || undefined,
      regime: formData.get("regime") || undefined,
      ambiente: formData.get("ambiente") || undefined,
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    await setIntegration(ctx.orgId, "nfe", {
      config: {
        cnpj: parsed.data.cnpj ?? "",
        regime: parsed.data.regime ?? "simples",
        ambiente: parsed.data.ambiente ?? "homologacao",
      },
      enabled: existing?.enabled ?? false,
    });
    revalidatePath("/conexoes");
    revalidatePath("/fiscal");
    return { ok: true };
  }

  return { error: "Provedor não suportado para configuração" };
}
