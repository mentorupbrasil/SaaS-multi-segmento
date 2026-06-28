#!/usr/bin/env node
/**
 * Runs `prisma generate` with retries for OneDrive EPERM on Windows.
 * Exits 0 on persistent failure so `npm install` is not blocked locally.
 */
const { execSync } = require("child_process");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isEpermError(err) {
  const text = [err?.message, err?.stderr?.toString?.(), err?.stdout?.toString?.()]
    .filter(Boolean)
    .join(" ");
  return text.includes("EPERM") || text.includes("operation not permitted");
}

async function main() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      execSync("npx prisma generate", { stdio: "inherit" });
      return;
    } catch (err) {
      if (isEpermError(err) && attempt < MAX_RETRIES) {
        console.warn(
          `[postinstall] prisma generate EPERM (attempt ${attempt}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS}ms…`,
        );
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      if (isEpermError(err)) {
        console.warn(
          "[postinstall] prisma generate failed after retries (OneDrive EPERM?). Run `npm run db:generate` manually.",
        );
        return;
      }

      throw err;
    }
  }
}

main().catch((err) => {
  console.error("[postinstall]", err.message ?? err);
  process.exit(1);
});
