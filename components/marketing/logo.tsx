import Link from "next/link";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-sm">
        <Layers className="h-5 w-5" />
      </span>
      <span className={cn("text-base font-bold tracking-tight", light ? "text-white" : "text-foreground")}>
        Gestor<span className="text-primary">Pro</span>
      </span>
    </Link>
  );
}
