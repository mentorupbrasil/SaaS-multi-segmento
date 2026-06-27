"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { signIn } from "@/auth";
import { getSegment } from "@/segments";
import { getPlan, PLANS } from "@/lib/plans";
import { slugify } from "@/lib/utils";

export interface ActionState {
  error?: string;
}

const signupSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  businessName: z.string().min(2, "Informe o nome do negócio"),
  segmentId: z.string().min(1, "Escolha um segmento"),
  planId: z.string().min(1, "Escolha um plano"),
});

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "negocio";
  let slug = root;
  let i = 0;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${root}-${i}`;
  }
  return slug;
}

export async function signupAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    businessName: formData.get("businessName"),
    segmentId: formData.get("segmentId"),
    planId: formData.get("planId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, email, password, businessName, segmentId, planId } = parsed.data;

  const segment = getSegment(segmentId);
  if (!segment) return { error: "Segmento inválido" };

  const plan = getPlan(planId) ?? PLANS[0];

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) return { error: "Já existe uma conta com este e-mail" };

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = await uniqueSlug(businessName);

  // Criacao transacional: User + Organization + Membership (+ servicos padrao).
  // Sem periodo de teste: a conta ja nasce assinante do plano escolhido.
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email: email.toLowerCase(), passwordHash },
    });

    const organization = await tx.organization.create({
      data: {
        name: businessName,
        slug,
        segmentId,
        plan: plan.id,
        subscriptionStatus: "ACTIVE",
        trialEndsAt: null,
        memberships: {
          create: { userId: user.id, role: "OWNER", title: segment.terms.professional },
        },
      },
    });

    if (segment.defaultServices?.length) {
      await tx.service.createMany({
        data: segment.defaultServices.map((s) => ({
          organizationId: organization.id,
          name: s.name,
          price: s.price,
          durationMin: s.durationMin,
        })),
      });
    }
  });

  // Loga e redireciona. signIn lanca NEXT_REDIRECT em caso de sucesso.
  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada, mas falhou ao entrar. Tente fazer login." };
    }
    throw error;
  }

  return {};
}

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha incorretos" };
    }
    throw error;
  }

  return {};
}
