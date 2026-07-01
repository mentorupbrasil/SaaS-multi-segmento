"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { signIn } from "@/auth";
import { getSegment } from "@/segments";
import { getPlan, PLANS } from "@/lib/plans";
import { isSubscriptionActive } from "@/lib/subscription";
import { seedDefaultMasterData } from "@/lib/master-data";
import { slugify } from "@/lib/utils";
import { isPlatformAdminEmail } from "@/lib/platform-admin";
import {
  checkLoginRateLimit,
  checkSignupRateLimit,
  rateLimitErrorMessage,
} from "@/lib/rate-limit";

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
  cpfCnpj: z
    .string()
    .min(1, "Informe CPF ou CNPJ")
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length === 11 || digits.length === 14;
    }, "CPF ou CNPJ inválido"),
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
    cpfCnpj: formData.get("cpfCnpj"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, email, password, businessName, segmentId, planId, cpfCnpj } = parsed.data;

  const signupLimit = checkSignupRateLimit(email);
  if (!signupLimit.ok) {
    return { error: rateLimitErrorMessage(signupLimit.retryAfterMs) };
  }

  const segment = getSegment(segmentId);
  if (!segment) return { error: "Segmento inválido" };

  const plan = getPlan(planId) ?? PLANS[0];

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) return { error: "Já existe uma conta com este e-mail" };

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = await uniqueSlug(businessName);

  let organizationId: string;

  // Conta criada aguardando pagamento — acesso liberado após confirmação via Asaas.
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
        subscriptionStatus: "PAST_DUE",
        trialEndsAt: null,
        config: { billingCpfCnpj: cpfCnpj.replace(/\D/g, "") },
        memberships: {
          create: { userId: user.id, role: "OWNER", title: segment.terms.professional },
        },
      },
    });

    organizationId = organization.id;

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

  await seedDefaultMasterData(organizationId!, segmentId);

  // Loga e redireciona. signIn lanca NEXT_REDIRECT em caso de sucesso.
  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirectTo: "/assinatura?welcome=1",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (String(error.type) === "Configuration") {
        return {
          error:
            "Conta criada, mas falhou ao entrar (configuração do servidor). Tente fazer login manualmente.",
        };
      }
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

  const email = parsed.data.email.toLowerCase();
  const loginLimit = checkLoginRateLimit(email);
  if (!loginLimit.ok) {
    return { error: rateLimitErrorMessage(loginLimit.retryAfterMs) };
  }

  let redirectTo = isPlatformAdminEmail(email) ? "/admin" : "/dashboard";
  if (!isPlatformAdminEmail(email)) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          take: 1,
          include: { organization: true },
        },
      },
    });
    const org = user?.memberships[0]?.organization;
    if (org && !isSubscriptionActive(org)) {
      redirectTo = "/assinatura";
    }
  }

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "E-mail ou senha incorretos" };
      }
      if (String(error.type) === "Configuration") {
        return {
          error:
            "Erro de configuração do servidor (AUTH_SECRET ou URL). Reinicie o dev server após ajustar o .env.",
        };
      }
      return { error: "E-mail ou senha incorretos" };
    }
    throw error;
  }

  return {};
}
