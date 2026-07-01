import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";

const REGIME_LABEL: Record<string, string> = {
  simples: "Simples Nacional",
  presumido: "Lucro Presumido",
  real: "Lucro Real",
};

const AMBIENTE_LABEL: Record<string, string> = {
  homologacao: "Homologação",
  producao: "Produção",
};

export default async function FiscalPage() {
  const ctx = await getAuthContext();

  const integration = await prisma.integrationConfig.findFirst({
    where: { organizationId: ctx.orgId, provider: "nfe" },
  });

  const config =
    integration?.config && typeof integration.config === "object"
      ? (integration.config as Record<string, unknown>)
      : {};

  const enabled = integration?.enabled ?? false;
  const cnpj = String(config.cnpj ?? "—");
  const regime = REGIME_LABEL[String(config.regime ?? "simples")] ?? "Simples Nacional";
  const ambiente = AMBIENTE_LABEL[String(config.ambiente ?? "homologacao")] ?? "Homologação";

  return (
    <div>
      <PageHeader
        title="Nota fiscal (NF-e / NFC-e)"
        description="Prepare sua conta para emissão fiscal — integração SEFAZ em liberação gradual."
      />

      <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
        <strong>Importante:</strong> o PDV emite <strong>cupom não fiscal</strong> até a integração fiscal estar
        ativa. Você pode operar normalmente e emitir notas manualmente com seu contador.
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className={`mt-1 text-lg font-bold ${enabled ? "text-primary" : "text-amber-600"}`}>
            {enabled ? "Preparado (aguardando SEFAZ)" : "Não configurado"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted-foreground">CNPJ emitente</p>
          <p className="mt-1 font-medium">{cnpj}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted-foreground">Regime / Ambiente</p>
          <p className="mt-1 font-medium">
            {regime} · {ambiente}
          </p>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="font-semibold text-foreground">Como preparar sua conta</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Acesse <Link href="/conexoes" className="text-primary hover:underline">Integrações</Link> e preencha os
            dados fiscais (CNPJ, regime, ambiente).
          </li>
          <li>Habilite o provedor NF-e quando estiver pronto para emitir.</li>
          <li>Envie certificado A1 (.pfx) pelo chamado em <Link href="/chamados" className="text-primary hover:underline">Suporte</Link>.</li>
          <li>Após homologação, emita NFC-e a partir do PDV ou NF-e a partir de orçamentos convertidos.</li>
        </ol>
        <p className="text-xs text-muted-foreground">
          Integração via parceiros homologados (Focus NFe, PlugNotas). Emissão direta SEFAZ será habilitada por
          segmento conforme demanda.
        </p>
      </div>
    </div>
  );
}
