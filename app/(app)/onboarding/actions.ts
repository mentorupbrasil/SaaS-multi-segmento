"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole } from "@/lib/action-auth";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const serviceSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  durationMin: z.coerce.number().int().min(0).default(30),
});

export async function onboardingCreateService(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = serviceSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    durationMin: formData.get("durationMin"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.service.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      price: parsed.data.price,
      durationMin: parsed.data.durationMin,
    },
  });

  return { ok: true };
}

export async function onboardingEnableBooking(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const enabled = formData.get("publicBookingEnabled") === "true";

  await prisma.organization.update({
    where: { id: ctx.orgId },
    data: { publicBookingEnabled: enabled },
  });

  return { ok: true };
}

export async function completeOnboarding(): Promise<void> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existingConfig = (ctx.organization.config as Record<string, unknown>) ?? {};

  await prisma.organization.update({
    where: { id: ctx.orgId },
    data: {
      config: {
        ...existingConfig,
        onboardingCompleted: true,
      },
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
