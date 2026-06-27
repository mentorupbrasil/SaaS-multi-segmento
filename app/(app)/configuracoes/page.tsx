import { getAuthContext } from "@/lib/auth-context";
import { getSegment } from "@/segments";
import { MODULES } from "@/modules";
import { resolveTerms } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";

export default async function ConfiguracoesPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const segment = getSegment(org.segmentId);
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);

  return (
    <div>
      <PageHeader title="Configurações" description="Detalhes do seu negócio e segmento." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Negócio</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Nome</dt>
              <dd className="font-medium text-slate-900">{org.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Segmento</dt>
              <dd className="font-medium text-slate-900">{segment?.label}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Identificador</dt>
              <dd className="font-mono text-slate-700">{org.slug}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Módulos ativos</h2>
          <ul className="space-y-2">
            {segment?.modules.map((id) => (
              <li key={id} className="flex items-center gap-2 text-sm text-slate-700">
                <Icon name="Check" className="h-4 w-4 text-green-600" />
                {MODULES[id]?.name}
                {MODULES[id]?.comingSoon && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                    em breve
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Nomenclatura do segmento</h2>
          <p className="mb-4 text-sm text-slate-500">
            Os termos abaixo se adaptam automaticamente ao seu segmento em todo o sistema.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(terms).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-slate-200 px-3 py-2">
                <p className="font-mono text-xs text-slate-400">{key}</p>
                <p className="text-sm font-medium text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
