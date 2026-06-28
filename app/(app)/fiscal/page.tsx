import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";

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
  const regime = String(config.regime ?? "Simples Nacional");
  const ambiente = String(config.ambiente ?? "Homologação");

  return (
    <div>
      <PageHeader
        title="Nota fiscal (NF-e / NFC-e)"
        description="Emissão fiscal integrada — configure certificado e ambiente."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500">Status</p>
          <p className={`mt-1 text-lg font-bold ${enabled ? "text-green-600" : "text-amber-600"}`}>
            {enabled ? "Ativo" : "Não configurado"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">CNPJ emitente</p>
          <p className="mt-1 font-medium">{cnpj}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500">Regime / Ambiente</p>
          <p className="mt-1 font-medium">
            {regime} · {ambiente}
          </p>
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="font-semibold text-slate-900">Como ativar</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>Acesse <Link href="/conexoes" className="text-brand-600 hover:underline">Conexões</Link> e habilite o provedor NF-e.</li>
          <li>Envie certificado A1 (.pfx) e senha via suporte ou API de integração.</li>
          <li>Configure série, numeração e CFOP padrão nos cadastros auxiliares.</li>
          <li>Emita NFC-e a partir do PDV ou NF-e a partir de orçamentos convertidos.</li>
        </ol>
        <p className="text-xs text-slate-400">
          Integração com SEFAZ, TEF e impressora fiscal disponível via parceiros homologados.
        </p>
      </div>
    </div>
  );
}
