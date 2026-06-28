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
  "/governanca": "housekeeping",
  "/cozinha": "kitchen",
  "/relatorios": "financial",
  "/turmas": "education",
  "/matriculas": "education",
  "/frequencia": "education",
  "/boletim": "education",
  "/tarifas": "rooms",
  "/mesas": "pdv",
  "/fiscal": "pdv",
};

/** Verifica se o segmento tem acesso ao módulo da rota. */
export function checkModuleAccess(pathname: string, segmentId: string): boolean {
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  const moduleId = ROUTE_MODULE[base];
  if (!moduleId) return true;
  return isModuleEnabled(segmentId, moduleId);
}

export function getModuleForPath(pathname: string): ModuleId | undefined {
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  return ROUTE_MODULE[base];
}
