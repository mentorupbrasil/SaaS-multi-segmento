import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

const TARGET_DIRS = [path.join(ROOT, "app", "(app)")];

const SKIP_FILES = new Set(["site-footer.tsx"]);

const REPLACEMENTS = [
  ["bg-white/95", "bg-background/95"],
  ["bg-white/90", "bg-card/90"],
  ["bg-white/80", "bg-card/80"],
  ["bg-white/70", "bg-card/70"],
  ["hover:bg-white/70", "hover:bg-card/70"],
  ["hover:bg-white", "hover:bg-card"],
  ["focus:bg-white", "focus:bg-background"],
  ["bg-white", "bg-card"],
  ["bg-slate-50/80", "bg-muted/50"],
  ["bg-slate-50/60", "bg-muted/40"],
  ["bg-slate-50/50", "bg-muted/30"],
  ["bg-slate-50/40", "bg-muted/30"],
  ["bg-slate-50", "bg-muted"],
  ["bg-slate-100", "bg-muted"],
  ["hover:bg-slate-50", "hover:bg-muted"],
  ["hover:bg-slate-200", "hover:bg-muted"],
  ["hover:bg-slate-100", "hover:bg-muted"],
  ["text-slate-900", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-600", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["text-slate-300", "text-muted-foreground/80"],
  ["border-slate-100", "border-border"],
  ["border-slate-200/80", "border-border"],
  ["border-slate-200/60", "border-border"],
  ["border-slate-200", "border-border"],
  ["border-slate-300", "border-border"],
  ["ring-slate-200", "ring-border"],
  ["shadow-slate-200", "shadow-black/10"],
  ["shadow-slate-300", "shadow-black/10"],
  ["divide-slate-100", "divide-border"],
  ["via-white", "via-background"],
  ["to-white", "to-background"],
  ["text-brand-700 hover:text-brand-800", "text-primary hover:text-primary/80"],
  ["text-brand-700", "text-primary"],
  ["group-hover:text-brand-700", "group-hover:text-primary"],
  ["hover:text-brand-800", "hover:text-primary/80"],
  ["hover:text-slate-800", "hover:text-foreground"],
  ["hover:text-slate-900", "hover:text-foreground"],
  ["placeholder:text-slate-400", "placeholder:text-muted-foreground"],
  ["focus:ring-brand-100", "focus:ring-primary/20"],
  ["focus:border-brand-300", "focus:border-primary/50"],
  ["border-brand-200", "border-primary/30"],
  ["hover:border-brand-200", "hover:border-primary/30"],
  ["hover:border-brand-100", "hover:border-primary/20"],
  ["ring-brand-100", "ring-primary/20"],
  ["from-brand-50 to-brand-100", "from-primary/10 to-primary/5"],
  ["ring-brand-100", "ring-primary/15"],
  ["bg-brand-100", "bg-primary/15"],
  ["text-brand-600", "text-primary"],
  ["group-hover:text-brand-600", "group-hover:text-primary"],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  if (fs.statSync(dir).isFile() && dir.endsWith(".tsx")) {
    files.push(dir);
    return files;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

const files = [];
for (const target of TARGET_DIRS) {
  if (target.endsWith(".tsx")) {
    files.push(target);
  } else {
    walk(target, files);
  }
}

let updated = 0;
for (const file of files) {
  if (SKIP_FILES.has(path.basename(file))) continue;

  let content = fs.readFileSync(file, "utf8");
  const original = content;
  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }
  if (content !== original) {
    fs.writeFileSync(file, content);
    updated++;
    console.log(path.relative(ROOT, file));
  }
}

console.log(`\nUpdated ${updated} files.`);
