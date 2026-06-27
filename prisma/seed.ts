import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SEGMENTS } from "../segments";

const prisma = new PrismaClient();

// Cria uma conta de demonstracao para a barbearia, com dados de exemplo.
async function main() {
  const segment = SEGMENTS.barbearia;
  const email = "demo@barbearia.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Seed ja aplicado (usuario demo existe). Pulando.");
    return;
  }

  const passwordHash = await bcrypt.hash("123456", 10);

  const org = await prisma.organization.create({
    data: {
      name: "Barbearia Demo",
      slug: "barbearia-demo",
      segmentId: segment.id,
      plan: "pro",
      subscriptionStatus: "ACTIVE",
      trialEndsAt: null,
      memberships: {
        create: {
          role: "OWNER",
          title: segment.terms.professional,
          user: { create: { name: "Dono Demo", email, passwordHash } },
        },
      },
      services: {
        create: (segment.defaultServices ?? []).map((s) => ({
          name: s.name,
          price: s.price,
          durationMin: s.durationMin,
        })),
      },
      customers: {
        create: [
          { name: "Joao Silva", phone: "(11) 91111-1111", email: "joao@email.com" },
          { name: "Carlos Souza", phone: "(11) 92222-2222" },
        ],
      },
    },
    include: { customers: true, services: true },
  });

  await prisma.financialEntry.createMany({
    data: [
      { organizationId: org.id, type: "INCOME", description: "Corte - Joao", amount: 40, status: "PAID", paidAt: new Date() },
      { organizationId: org.id, type: "EXPENSE", description: "Aluguel", amount: 1200, status: "PENDING" },
    ],
  });

  console.log("Seed concluido!");
  console.log("Login demo:  email: demo@barbearia.com  senha: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
