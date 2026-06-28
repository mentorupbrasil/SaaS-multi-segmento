import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SEGMENTS } from "../segments";
import { ensureDemoOrganizations } from "./seed-demos";

const prisma = new PrismaClient();

async function ensureBarbeariaDemoUser(passwordHash: string) {
  const email = "demo@barbearia.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const segment = SEGMENTS.barbearia;
  const org = await prisma.organization.findFirst({
    where: { segmentId: "barbearia" },
  });
  if (!org) return;

  const user = await prisma.user.create({
    data: { name: "Dono Demo", email, passwordHash },
  });
  await prisma.membership.create({
    data: {
      organizationId: org.id,
      userId: user.id,
      role: "OWNER",
      title: segment.terms.professional,
    },
  });
}

async function ensurePlatformAdmin(adminHash: string) {
  const adminEmail = "admin@gestorpro.com";
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (exists) return;

  const org =
    (await prisma.organization.findUnique({ where: { slug: "gestorpro-admin" } })) ??
    (await prisma.organization.findFirst({ orderBy: { name: "asc" } }));

  if (!org) {
    const segment = SEGMENTS.barbearia;
    await prisma.organization.create({
      data: {
        name: "GestorPro Admin",
        slug: "gestorpro-admin",
        segmentId: segment.id,
        plan: "enterprise",
        subscriptionStatus: "ACTIVE",
        memberships: {
          create: {
            role: "OWNER",
            title: "Administrador",
            user: {
              create: {
                name: "Admin Plataforma",
                email: adminEmail,
                passwordHash: adminHash,
              },
            },
          },
        },
      },
    });
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: "Admin Plataforma",
      email: adminEmail,
      passwordHash: adminHash,
    },
  });
  await prisma.membership.create({
    data: {
      organizationId: org.id,
      userId: user.id,
      role: "OWNER",
      title: "Administrador",
    },
  });
}

async function main() {
  const demoPassword = await bcrypt.hash("123456", 10);
  const adminHash = await bcrypt.hash("admin123", 10);

  const created = await ensureDemoOrganizations(prisma);
  await ensurePlatformAdmin(adminHash);
  await ensureBarbeariaDemoUser(demoPassword);

  const orgCount = await prisma.organization.count();
  console.log("Seed concluido!");
  console.log(`Organizacoes: ${orgCount} (${created} novas demos nesta execucao)`);
  console.log("Login demo tenant:  demo@barbearia.com / 123456");
  console.log("Super admin:       admin@gestorpro.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
