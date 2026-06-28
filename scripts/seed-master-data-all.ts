/**
 * Popula MasterData padrão em todas as organizações existentes.
 * Uso: npx tsx scripts/seed-master-data-all.ts
 */
import { prisma } from "../lib/db";
import { seedDefaultMasterData } from "../lib/master-data";

async function main() {
  const orgs = await prisma.organization.findMany({
    select: { id: true, name: true, segmentId: true },
    orderBy: { name: "asc" },
  });

  console.log(`Seeding master data for ${orgs.length} organizations...`);

  let totalCreated = 0;
  for (const org of orgs) {
    const result = await seedDefaultMasterData(org.id, org.segmentId);
    totalCreated += result.created;
    if (result.created > 0) {
      console.log(`  ${org.name}: +${result.created} items`);
    }
  }

  console.log(`Done. ${totalCreated} new master data rows created.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
