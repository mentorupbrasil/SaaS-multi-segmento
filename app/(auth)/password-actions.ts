"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export interface PasswordActionState {
  error?: string;
  ok?: boolean;
  message?: string;
}

function appBaseUrl(): string {
  return process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? "http://localhost:3000";
}

function randomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function forgotPasswordAction(
  _prev: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = randomToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    });

    const link = `${appBaseUrl()}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Redefinir senha — GestorPro",
      text: `Olá ${user.name},\n\nUse o link abaixo para redefinir sua senha (válido por 1 hora):\n${link}\n\nSe você não solicitou, ignore este e-mail.`,
    });
  }

  return {
    ok: true,
    message: "Se o e-mail existir em nossa base, você receberá instruções em instantes.",
  };
}

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  confirmPassword: z.string().min(6),
});

export async function resetPasswordAction(
  _prev: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: parsed.data.token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return { error: "Link inválido ou expirado. Solicite uma nova redefinição." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { ok: true, message: "Senha redefinida com sucesso. Faça login." };
}

export async function sendVerificationEmail(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.emailVerified) return;

  const token = randomToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken: token },
  });

  const link = `${appBaseUrl()}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: "Confirme seu e-mail — GestorPro",
    text: `Olá ${user.name},\n\nConfirme seu e-mail acessando:\n${link}`,
  });
}

export async function verifyEmailAction(token: string): Promise<PasswordActionState> {
  if (!token) return { error: "Token inválido." };

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    return { error: "Link inválido ou já utilizado." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verificationToken: null },
  });

  revalidatePath("/verify-email");
  return { ok: true, message: "E-mail confirmado com sucesso!" };
}
