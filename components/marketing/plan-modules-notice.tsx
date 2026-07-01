import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

/** Aviso nas landings de segmento: módulos e recursos dependem do plano. */
export function PlanModulesNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-brand-200 bg-brand-50/90 px-4 py-3.5 text-sm text-brand-950",
        className,
      )}
    >
      <Icon name="Info" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
      <p className="leading-relaxed">
        <span className="font-semibold">Módulos conforme o plano.</span> O Inicial cobre agenda,
        clientes, serviços, financeiro e equipe. Módulos extras do segmento, WhatsApp, agendamento
        online e exportação liberam no Profissional. Estoque e ordens de serviço no Premium.{" "}
        <Link href="/precos" className="font-semibold text-brand-700 underline hover:text-brand-800">
          Compare planos
        </Link>
        .
      </p>
    </div>
  );
}
