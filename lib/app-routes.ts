/** Rotas do painel operacional em app/(app). */
export const ALL_APP_ROUTE_PREFIXES = [
  "/dashboard",
  "/clientes",
  "/agenda",
  "/servicos",
  "/financeiro",
  "/equipe",
  "/estoque",
  "/ordens-de-servico",
  "/prontuario",
  "/configuracoes",
  "/assinatura",
  "/orcamentos",
  "/fornecedores",
  "/veiculos",
  "/pets",
  "/pdv",
  "/quartos",
  "/reservas",
  "/eventos",
  "/doacoes",
  "/grupos",
  "/caixa",
  "/pacotes",
  "/vacinas",
  "/comissoes",
  "/governanca",
  "/cozinha",
  "/relatorios",
  "/conexoes",
  "/ia",
  "/onboarding",
  "/turmas",
  "/matriculas",
  "/frequencia",
  "/boletim",
  "/tarifas",
  "/mesas",
  "/fiscal",
] as const;

/** Prefixos que exigem sessão autenticada (app + admin). */
export const ALL_PROTECTED_PREFIXES = [
  ...ALL_APP_ROUTE_PREFIXES,
  "/admin",
] as const;

/** Rotas públicas do produto (sem login). */
export const PUBLIC_PRODUCT_PREFIXES = ["/agendar", "/portal"] as const;

export type AppRoutePrefix = (typeof ALL_APP_ROUTE_PREFIXES)[number];
export type ProtectedPrefix = (typeof ALL_PROTECTED_PREFIXES)[number];
