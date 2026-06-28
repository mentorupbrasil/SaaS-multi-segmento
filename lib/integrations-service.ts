import { prisma } from "@/lib/db";
import type { IntegrationConfig, Prisma } from "@prisma/client";

export type IntegrationProvider =
  | "whatsapp"
  | "pix"
  | "google_calendar"
  | "mercadopago"
  | "nfe"
  | "channel_manager";

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  "whatsapp",
  "pix",
  "google_calendar",
  "mercadopago",
  "nfe",
  "channel_manager",
];

export async function getIntegration(
  organizationId: string,
  provider: string,
): Promise<IntegrationConfig | null> {
  return prisma.integrationConfig.findUnique({
    where: { organizationId_provider: { organizationId, provider } },
  });
}

export async function setIntegration(
  organizationId: string,
  provider: string,
  data: { enabled?: boolean; config?: Prisma.InputJsonValue },
): Promise<IntegrationConfig> {
  return prisma.integrationConfig.upsert({
    where: { organizationId_provider: { organizationId, provider } },
    create: {
      organizationId,
      provider,
      enabled: data.enabled ?? false,
      config: data.config ?? {},
    },
    update: {
      ...(data.enabled !== undefined ? { enabled: data.enabled } : {}),
      ...(data.config !== undefined ? { config: data.config } : {}),
    },
  });
}

export async function listEnabledIntegrations(organizationId: string): Promise<IntegrationConfig[]> {
  return prisma.integrationConfig.findMany({
    where: { organizationId, enabled: true },
    orderBy: { provider: "asc" },
  });
}

export async function listIntegrations(organizationId: string): Promise<IntegrationConfig[]> {
  return prisma.integrationConfig.findMany({
    where: { organizationId },
    orderBy: { provider: "asc" },
  });
}
