import Link from "next/link";
import { getAuthContext, requireRole } from "@/lib/auth-context";
import { listIntegrations } from "@/lib/integrations-service";
import { APP_INTEGRATIONS } from "@/lib/integration-definitions";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { IntegrationToggle } from "./integration-toggle";

export default async function ConexoesPage() {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const configs = await listIntegrations(ctx.orgId);
  const configMap = new Map(configs.map((c) => [c.provider, c]));

  return (
    <div>
      <PageHeader
        title="Integrações"
        description="Conecte ferramentas externas ao seu negócio."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {APP_INTEGRATIONS.map((item) => {
          const config = configMap.get(item.provider);
          const enabled = config?.enabled ?? false;

          return (
            <div key={item.provider} className="card flex items-start gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-foreground">{item.name}</h2>
                      {item.status === "preview" && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-400">
                          Preview
                        </span>
                      )}
                      {item.status === "beta" && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                          Beta
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.toggleable && (
                    <IntegrationToggle provider={item.provider} enabled={enabled} />
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {item.relatedHref && item.relatedLabel && (
                    <>
                      Configure em{" "}
                      <Link href={item.relatedHref} className="text-primary hover:underline">
                        {item.relatedLabel}
                      </Link>
                      {" · "}
                    </>
                  )}
                  {item.webhookPath && <>Webhook: /api/integrations/webhook/{item.webhookPath}</>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
