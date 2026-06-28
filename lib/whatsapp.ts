import { prisma } from "@/lib/db";

export interface WhatsAppSendInput {
  organizationId: string;
  phone: string;
  message: string;
}

export interface WhatsAppSendResult {
  ok: boolean;
  mode: "api" | "log";
  error?: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Envia WhatsApp via integração configurada ou registra em log (dev). */
export async function sendWhatsApp(input: WhatsAppSendInput): Promise<WhatsAppSendResult> {
  const phone = normalizePhone(input.phone);
  if (!phone) {
    return { ok: false, mode: "log", error: "Telefone inválido" };
  }

  const config = await prisma.integrationConfig.findFirst({
    where: {
      organizationId: input.organizationId,
      provider: "whatsapp",
      enabled: true,
    },
  });

  const apiUrl = config?.config && typeof config.config === "object"
    ? String((config.config as Record<string, unknown>).apiUrl ?? "")
    : "";
  const apiToken = config?.config && typeof config.config === "object"
    ? String((config.config as Record<string, unknown>).apiToken ?? "")
    : "";

  if (apiUrl && apiToken) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          phone,
          message: input.message,
          organizationId: input.organizationId,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        return { ok: false, mode: "api", error: text || `HTTP ${response.status}` };
      }

      return { ok: true, mode: "api" };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro de rede";
      return { ok: false, mode: "api", error: message };
    }
  }

  console.log(
    `[whatsapp] org=${input.organizationId} to=${phone}\n${input.message}`,
  );
  return { ok: true, mode: "log" };
}
