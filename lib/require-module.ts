import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { isModuleEnabled } from "@/lib/nav";
import type { ModuleId } from "@/modules/types";

const ROUTE_MODULE: Record<string, ModuleId> = {
  "/clientes": "clients",
  "/agenda": "scheduling",
  "/servicos": "services",
  "/financeiro": "financial",
  "/equipe": "team",
  "/estoque": "inventory",
  "/ordens-de-servico": "work_orders",
  "/prontuario": "records",
  "/orcamentos": "quotes",
  "/fornecedores": "suppliers",
  "/veiculos": "vehicles",
  "/pets": "pets",
  "/pdv": "pdv",
  "/quartos": "rooms",
  "/reservas": "reservations",
  "/eventos": "events",
  "/doacoes": "donations",
  "/grupos": "groups",
  "/caixa": "financial",
  "/pacotes": "scheduling",
  "/vacinas": "pets",
  "/comissoes": "work_orders",
};

/** Bloqueia rota se o módulo não está ativo no segmento. */
export async function requireModule(pathname: string) {
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  const moduleId = ROUTE_MODULE[base];
  if (!moduleId) return;

  const ctx = await getAuthContext();
  if (!isModuleEnabled(ctx.organization.segmentId, moduleId)) {
    redirect("/dashboard");
  }
}

export function getModuleForPath(pathname: string): ModuleId | undefined {
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  return ROUTE_MODULE[base];
}
