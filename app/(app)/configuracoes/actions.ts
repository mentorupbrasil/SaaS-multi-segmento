"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";
import { canUsePublicBooking } from "@/lib/plan-enforcement";
import { slugify } from "@/lib/utils";
import { DEFAULT_TERMS } from "@/lib/terms";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const settingsSchema = z.object({
  name: z.string().min(2, "Informe o nome do negócio"),
  publicBookingSlug: z.string().optional(),
  publicBookingEnabled: z.enum(["true", "false"]).optional(),
});

export async function updateOrganizationSettings(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    publicBookingSlug: formData.get("publicBookingSlug") ?? undefined,
    publicBookingEnabled: formData.get("publicBookingEnabled") ?? "false",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const bookingSlug = parsed.data.publicBookingSlug?.trim()
    ? slugify(parsed.data.publicBookingSlug.trim())
    : null;

  if (bookingSlug) {
    const conflict = await prisma.organization.findFirst({
      where: {
        publicBookingSlug: bookingSlug,
        NOT: { id: ctx.orgId },
      },
    });
    if (conflict) return { error: "Este slug de agendamento já está em uso" };
  }

  const wantsPublicBooking = parsed.data.publicBookingEnabled === "true";
  if (wantsPublicBooking && !canUsePublicBooking(ctx.organization.plan)) {
    return {
      error: "Agendamento público disponível a partir do plano Profissional.",
    };
  }

  const existingConfig = (ctx.organization.config as Record<string, unknown>) ?? {};
  const termOverrides: Record<string, string> = {};
  for (const key of Object.keys(DEFAULT_TERMS)) {
    const value = formData.get(`term_${key}`);
    if (typeof value === "string" && value.trim()) {
      termOverrides[key] = value.trim();
    }
  }

  await prisma.organization.update({
    where: { id: ctx.orgId },
    data: {
      name: parsed.data.name,
      publicBookingSlug: bookingSlug,
      publicBookingEnabled: wantsPublicBooking && canUsePublicBooking(ctx.organization.plan),
      config: {
        ...existingConfig,
        terms: termOverrides,
      },
    },
  });

  await logAudit(ctx, "organization.settings.update", { name: parsed.data.name });
  revalidatePath("/configuracoes");
  return { ok: true };
}
