import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

/** Aviso nas landings de segmento: módulos e recursos dependem do plano. */
export function PlanModulesNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-primary/30 bg-brand-50/90 px-4 py-3.5 text-sm text-brand-950",
        className,
      )}
    >
      <Icon name="Info" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <p className="leading-relaxed">
        <span className="font-semibold">Módulos conforme o plano.</span> O Inicial já inclui todos
        os módulos do segmento, WhatsApp, Google Agenda, pagamentos, relatórios e exportação. Estoque
        e ordens de serviço ficam no Profissional.{" "}
        <Link href="/precos" className="font-semibold text-primary underline hover:text-primary/80">
          Compare planos
        </Link>
        .
      </p>
    </div>
  );
}
