import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getSegment } from "@/segments";
import { MODULES } from "@/modules";
import { resolveTerms, DEFAULT_TERMS } from "@/lib/terms";
import { resolveSegmentModules } from "@/lib/segment-modules";
import { filterModulesByPlan } from "@/lib/plan-enforcement";
import { canUsePublicBooking } from "@/lib/plan-enforcement";
import { formatUserLimit, getOrgUsage } from "@/lib/plan-limits";
import { getPlan } from "@/lib/plans";
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
  const plan = getPlan(org.plan);
  const usage = await getOrgUsage(org.id);

  const segmentModuleIds = resolveSegmentModules(org.segmentId);
  const activeModuleIds = filterModulesByPlan(segmentModuleIds, org.plan);

  const termKeys = Object.keys(DEFAULT_TERMS).map((key) => ({
    key,
    label: DEFAULT_TERMS[key] ?? key,
    value: termOverrides[key] ?? "",
  }));

  return (
    <div>
      <PageHeader title="Configurações" description="Detalhes do seu negócio e segmento." />

      <div className="mb-6 rounded-xl border border-border bg-muted px-5 py-4 text-sm text-foreground">
        <p>
          <strong>Plano {plan?.name ?? org.plan}</strong> · Usuários{" "}
          {usage.userCount}/{formatUserLimit(org.plan)} · Filiais {usage.branchCount}
        </p>
        <Link href="/assinatura" className="mt-1 inline-block text-primary underline">
          Ver planos e fazer upgrade
        </Link>
      </div>

      <SettingsForm
        defaultName={org.name}
        defaultBookingSlug={org.publicBookingSlug ?? org.slug}
        defaultBookingEnabled={org.publicBookingEnabled}
        canPublicBooking={canUsePublicBooking(org.plan)}
        termKeys={termKeys}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/configuracoes/cadastros"
          className="card flex items-center justify-between p-4 transition-colors hover:border-primary/30 hover:bg-brand-50/30"
        >
          <div>
            <p className="font-medium text-foreground">Cadastros auxiliares</p>
            <p className="text-sm text-muted-foreground">
              Formas de pagamento, categorias, tipos de quarto e outras listas do sistema.
            </p>
          </div>
          <Icon name="ChevronRight" className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Link
          href="/configuracoes/filiais"
          className="card flex items-center justify-between p-4 transition-colors hover:border-primary/30 hover:bg-brand-50/30"
        >
          <div>
            <p className="font-medium text-foreground">Filiais</p>
            <p className="text-sm text-muted-foreground">
              Unidades e endereços — limite conforme o plano contratado.
            </p>
          </div>
          <Icon name="ChevronRight" className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Segmento</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Segmento</dt>
              <dd className="font-medium text-foreground">{segment?.label}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Identificador</dt>
              <dd className="font-mono text-foreground">{org.slug}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Módulos no seu plano</h2>
          <ul className="space-y-2">
            {activeModuleIds.map((id: ModuleId) => (
              <li key={id} className="flex items-center gap-2 text-sm text-foreground">
                <Icon name="Check" className="h-4 w-4 text-green-600" />
                {MODULES[id]?.name}
              </li>
            ))}
          </ul>
          {activeModuleIds.length < segmentModuleIds.length && (
            <p className="mt-3 text-xs text-amber-700">
              Alguns módulos do segmento exigem plano Profissional ou Premium.{" "}
              <Link href="/assinatura" className="underline">
                Compare planos
              </Link>
            </p>
          )}
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Nomenclatura atual</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(terms).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-border px-3 py-2">
                <p className="font-mono text-xs text-muted-foreground">{key}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
