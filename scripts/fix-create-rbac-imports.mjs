import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const modulesDir = path.join(root, "modules");

for (const mod of fs.readdirSync(modulesDir)) {
  const file = path.join(modulesDir, mod, "actions.ts");
  if (!fs.existsSync(file)) continue;

  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("requireCreateRole(ctx)")) continue;

  if (src.includes('from "@/lib/action-auth"')) {
    src = src.replace(
      /import \{ requireMutationRole \} from "@\/lib\/action-auth";/,
      'import { requireMutationRole, requireCreateRole } from "@/lib/action-auth";',
    );
  } else if (src.includes('from "@/lib/auth-context"')) {
    src = src.replace(
      /import \{ getAuthContext \} from "@\/lib\/auth-context";/,
      'import { getAuthContext } from "@/lib/auth-context";\nimport { requireCreateRole } from "@/lib/action-auth";',
    );
  }

  fs.writeFileSync(file, src);
  console.log("Fixed import", path.relative(root, file));
}
