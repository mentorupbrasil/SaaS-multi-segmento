import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  className?: string;
};

export function PlanUpgradePrompt({ message, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900",
        className,
      )}
    >
      <p>{message}</p>
      <Link href="/assinatura" className="shrink-0 font-semibold text-amber-950 underline">
        Ver planos
      </Link>
    </div>
  );
}
