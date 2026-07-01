import type { IntegrationProvider } from "@/lib/integrations-service";

/** Integrações configuráveis em /conexoes (fonte única para UI + actions + service). */
export interface AppIntegrationDefinition {
  provider: IntegrationProvider;
  name: string;
  icon: string;
  description: string;
  /** Ex.: link interno relacionado */
  relatedHref?: string;
  relatedLabel?: string;
  webhookPath?: string;
  /** Toggle disponível no painel (false = somente informativo) */
  toggleable: boolean;
  status?: "beta" | "preview";
}

export const APP_INTEGRATIONS: AppIntegrationDefinition[] = [
  {
    provider: "whatsapp",
    name: "WhatsApp",
    icon: "MessageCircle",
    description: "Lembretes automáticos e confirmações de agendamento.",
    webhookPath: "whatsapp",
    toggleable: true,
  },
  {
    provider: "pix",
    name: "PIX",
    icon: "Wallet",
    description: "Receba pagamentos via PIX com conciliação no financeiro.",
    toggleable: true,
    status: "preview",
  },
  {
    provider: "google_calendar",
    name: "Google Agenda",
    icon: "Calendar",
    description: "Sincronize agendamentos com sua agenda Google.",
    toggleable: true,
    status: "preview",
  },
  {
    provider: "nfe",
    name: "NF-e / NFC-e",
    icon: "FileCheck",
    description: "Emissão fiscal integrada com SEFAZ (certificado A1).",
    relatedHref: "/fiscal",
    relatedLabel: "Fiscal",
    toggleable: true,
    status: "preview",
  },
  {
    provider: "channel_manager",
    name: "Channel Manager",
    icon: "Globe",
    description: "Sincronize tarifas e disponibilidade com OTAs (Booking, Airbnb).",
    relatedHref: "/tarifas",
    relatedLabel: "Tarifas",
    toggleable: true,
    status: "preview",
  },
  {
    provider: "mercadopago",
    name: "Mercado Pago",
    icon: "CreditCard",
    description: "Cobranças online e webhook de pagamentos (reconciliação em desenvolvimento).",
    webhookPath: "mercadopago",
    toggleable: true,
    status: "beta",
  },
];

export const TOGGLEABLE_INTEGRATION_PROVIDERS = APP_INTEGRATIONS.filter((i) => i.toggleable).map(
  (i) => i.provider,
) as [IntegrationProvider, ...IntegrationProvider[]];
