import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const modulesDir = path.join(root, "modules");

function ensureImport(src) {
  if (src.includes("requireCreateRole")) return src;
  if (src.includes('from "@/lib/action-auth"')) {
    return src.replace(/import \{([^}]+)\} from "@\/lib\/action-auth";/, (_, imports) => {
      const parts = imports.split(",").map((s) => s.trim()).filter(Boolean);
      if (!parts.includes("requireCreateRole")) parts.push("requireCreateRole");
      return `import { ${parts.join(", ")} } from "@/lib/action-auth";`;
    });
  }
  if (src.includes('from "@/lib/auth-context"')) {
    return src.replace(
      /import \{ getAuthContext \} from "@\/lib\/auth-context";/,
      'import { getAuthContext } from "@/lib/auth-context";\nimport { requireCreateRole } from "@/lib/action-auth";',
    );
  }
  return src;
}

for (const mod of fs.readdirSync(modulesDir)) {
  const file = path.join(modulesDir, mod, "actions.ts");
  if (!fs.existsSync(file)) continue;

  let src = fs.readFileSync(file, "utf8");
  if (!/export async function create/.test(src)) continue;

  const updated = src.replace(
    /(export async function create[\s\S]*?const ctx = await getAuthContext\(\);)(\s*\n)(?!\s*require(?:Create|Mutation)Role)/g,
    "$1$2  requireCreateRole(ctx);$2",
  );

  if (updated === src) continue;

  fs.writeFileSync(file, ensureImport(updated));
  console.log("Updated", path.relative(root, file));
}
