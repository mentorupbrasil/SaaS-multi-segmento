"use server";



import { revalidatePath } from "next/cache";

import { z } from "zod";

import { prisma } from "@/lib/db";

import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";



export interface FormResult {

  error?: string;

  ok?: boolean;

}



const schema = z.object({

  name: z.string().min(1),

  groupType: z.string().optional(),

  description: z.string().optional(),

});



export async function createGroup(

  _prev: FormResult,

  formData: FormData,

): Promise<FormResult> {

  const ctx = await getAuthContext();

  const parsed = schema.safeParse({

    name: formData.get("name"),

    groupType: formData.get("groupType") ?? undefined,

    description: formData.get("description") ?? undefined,

  });

  if (!parsed.success) {

    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  }



  await prisma.group.create({

    data: {

      organizationId: ctx.orgId,

      name: parsed.data.name,

      groupType: parsed.data.groupType || null,

      description: parsed.data.description || null,

    },

  });



  revalidatePath("/grupos");

  return { ok: true };

}



export async function addGroupMember(groupId: string, customerId: string): Promise<FormResult> {

  const ctx = await getAuthContext();

  const group = await prisma.group.findFirst({

    where: { id: groupId, organizationId: ctx.orgId },

  });

  if (!group) return { error: "Grupo não encontrado" };



  await prisma.groupMember.upsert({

    where: { groupId_customerId: { groupId, customerId } },

    create: { groupId, customerId },

    update: {},

  });



  revalidatePath("/grupos");
  revalidatePath(`/grupos/${groupId}`);

  return { ok: true };

}



export async function deleteGroup(id: string): Promise<FormResult> {

  const ctx = await getAuthContext();

  requireMutationRole(ctx, ["OWNER", "ADMIN"]);



  const existing = await prisma.group.findFirst({

    where: { id, organizationId: ctx.orgId },

  });

  if (!existing) return { error: "Grupo não encontrado" };



  await prisma.group.deleteMany({

    where: { id, organizationId: ctx.orgId },

  });



  await logAudit(ctx, "group.delete", { id, name: existing.name });

  revalidatePath("/grupos");

  return { ok: true };

}



export async function removeGroupMember(groupId: string, customerId: string): Promise<FormResult> {

  const ctx = await getAuthContext();

  requireMutationRole(ctx, ["OWNER", "ADMIN"]);



  const group = await prisma.group.findFirst({

    where: { id: groupId, organizationId: ctx.orgId },

  });

  if (!group) return { error: "Grupo não encontrado" };



  await prisma.groupMember.deleteMany({

    where: { groupId, customerId },

  });



  await logAudit(ctx, "group.member.remove", { groupId, customerId });

  revalidatePath("/grupos");

  revalidatePath(`/grupos/${groupId}`);

  return { ok: true };

}


