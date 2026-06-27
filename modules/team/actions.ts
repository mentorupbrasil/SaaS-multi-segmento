"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getAuthContext, requireRole } from "@/lib/auth-context";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  name: z.string().min(2, "Informe o nome"),
  email: z.string().email("E-mail invalido"),
  password: z.string().min(6, "Senha de ao menos 6 caracteres"),
  role: z.enum(["ADMIN", "STAFF"]),
  title: z.string().optional(),
});

export async function inviteMember(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    title: formData.get("title") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
    include: { memberships: true },
  });

  if (existing) {
    const already = existing.memberships.some((m) => m.organizationId === ctx.orgId);
    if (already) return { error: "Este usuario ja faz parte da equipe" };
    await prisma.membership.create({
      data: {
        userId: existing.id,
        organizationId: ctx.orgId,
        role: parsed.data.role,
        title: parsed.data.title || null,
      },
    });
  } else {
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        memberships: {
          create: {
            organizationId: ctx.orgId,
            role: parsed.data.role,
            title: parsed.data.title || null,
          },
        },
      },
    });
  }

  revalidatePath("/equipe");
  return { ok: true };
}
