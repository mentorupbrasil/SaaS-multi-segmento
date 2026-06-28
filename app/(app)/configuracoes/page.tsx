import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getSegment } from "@/segments";
import { MODULES } from "@/modules";
import { resolveTerms, DEFAULT_TERMS } from "@/lib/terms";
import { resolveSegmentModules } from "@/lib/segment-modules";
import type { ModuleId } from "@/modules/types";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { SettingsForm } from "./settings-form";

export default async function ConfiguracoesPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const segment = getSegment(org.segmentId);
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const termOverrides = (org.config as { terms?: Record<string, string> })?.terms ?? {};

  const moduleIds = resolveSegmentModules(org.segmentId);

  const termKeys = Object.keys(DEFAULT_TERMS).map((key) => ({
    key,
    label: DEFAULT_TERMS[key] ?? key,
    value: termOverrides[key] ?? "",
  }));

  return (
    <div>
      <PageHeader title="Configurações" description="Detalhes do seu negócio e segmento." />

      <SettingsForm
        defaultName={org.name}
        defaultBookingSlug={org.publicBookingSlug ?? org.slug}
        defaultBookingEnabled={org.publicBookingEnabled}
        termKeys={termKeys}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/configuracoes/cadastros"
          className="card flex items-center justify-between p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/30"
        >
          <div>
            <p className="font-medium text-slate-900">Cadastros auxiliares</p>
            <p className="text-sm text-slate-500">
              Formas de pagamento, categorias, tipos de quarto e outras listas do sistema.
            </p>
          </div>
          <Icon name="ChevronRight" className="h-5 w-5 text-slate-400" />
        </Link>
        <Link
          href="/configuracoes/filiais"
          className="card flex items-center justify-between p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/30"
        >
          <div>
            <p className="font-medium text-slate-900">Filiais</p>
            <p className="text-sm text-slate-500">
              Unidades e endereços — limite conforme o plano contratado.
            </p>
          </div>
          <Icon name="ChevronRight" className="h-5 w-5 text-slate-400" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Segmento</h2>
          <dl className="space-y-3 text-sm">
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
            {moduleIds.map((id: ModuleId) => (
              <li key={id} className="flex items-center gap-2 text-sm text-slate-700">
                <Icon name="Check" className="h-4 w-4 text-green-600" />
                {MODULES[id]?.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Nomenclatura atual</h2>
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
