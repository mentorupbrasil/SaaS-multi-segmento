import Link from "next/link";
import { getAuthContext, requireRole } from "@/lib/auth-context";
import { listIntegrations } from "@/lib/integrations-service";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { IntegrationToggle } from "./integration-toggle";

const INTEGRATION_UI = [
  {
    provider: "whatsapp" as const,
    name: "WhatsApp",
    icon: "MessageCircle",
    description: "Lembretes automáticos e confirmações de agendamento.",
  },
  {
    provider: "pix" as const,
    name: "PIX",
    icon: "Wallet",
    description: "Receba pagamentos via PIX com conciliação no financeiro.",
  },
  {
    provider: "google_calendar" as const,
    name: "Google Agenda",
    icon: "Calendar",
    description: "Sincronize agendamentos com sua agenda Google.",
  },
  {
    provider: "nfe" as const,
    name: "NF-e / NFC-e",
    icon: "FileCheck",
    description: "Emissão fiscal integrada com SEFAZ (certificado A1).",
  },
  {
    provider: "channel_manager" as const,
    name: "Channel Manager",
    icon: "Globe",
    description: "Sincronize tarifas e disponibilidade com OTAs (Booking, Airbnb).",
  },
  {
    provider: "mercadopago" as const,
    name: "Mercado Pago",
    icon: "CreditCard",
    description: "Cobranças online, assinaturas e webhook de pagamentos.",
  },
];

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
        {INTEGRATION_UI.map((item) => {
          const config = configMap.get(item.provider);
          const enabled = config?.enabled ?? false;

          return (
            <div key={item.provider} className="card flex items-start gap-4 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-primary">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-foreground">{item.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <IntegrationToggle provider={item.provider} enabled={enabled} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {item.provider === "nfe" && (
                    <>Configure detalhes em <Link href="/fiscal" className="text-primary hover:underline">Fiscal</Link> · </>
                  )}
                  {item.provider === "channel_manager" && (
                    <>Tarifas em <Link href="/tarifas" className="text-primary hover:underline">Tarifas</Link> · </>
                  )}
                  Webhook: /api/integrations/webhook/{item.provider === "pix" ? "mercadopago" : item.provider}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
