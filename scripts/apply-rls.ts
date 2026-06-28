/**
 * Aplica RLS no PostgreSQL (Neon). Requer DIRECT_URL com permissão de owner.
 * Uso: npm run db:rls
 */
import { readFileSync } from "fs";
import { join } from "path";
import { prisma } from "../lib/db";

async function main() {
  const sqlPath = join(process.cwd(), "prisma", "rls-apply.sql");
  const sql = readFileSync(sqlPath, "utf8");

  console.log("Applying RLS policies...");
  await prisma.$executeRawUnsafe(sql);
  console.log("RLS applied successfully.");
  console.log("Use lib/db-tenant.runWithTenantContext(orgId, userId, fn) in workers if needed.");
}

main()
  .catch((error) => {
    console.error("RLS apply failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
