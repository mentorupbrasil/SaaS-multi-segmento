import { SOLUTIONS, type Solution } from "@/lib/solutions";

export interface SolutionMenuGroup {
  id: string;
  label: string;
  description: string;
  icon: string;
  slugs: string[];
}

/** Grupos do mega-menu (3 colunas, mesmo layout de funcionalidades). */
export const SOLUTION_MENU_GROUPS: SolutionMenuGroup[] = [
  {
    id: "financeiro",
    label: "Finanças",
    description: "Caixa, faturamento e visão do mês.",
    icon: "Wallet",
    slugs: ["organizar-financeiro"],
  },
  {
    id: "relacionamento",
    label: "Clientes & vendas",
    description: "CRM, agenda cheia e fidelização.",
    icon: "Users",
    slugs: ["controlar-clientes", "vender-mais"],
  },
  {
    id: "operacao",
    label: "Operação",
    description: "Menos manual, mais tempo para atender.",
    icon: "Zap",
    slugs: ["reduzir-trabalho-manual"],
  },
];

export const FEATURED_SOLUTION_SLUGS = [
  "organizar-financeiro",
  "controlar-clientes",
  "vender-mais",
  "reduzir-trabalho-manual",
] as const;

export function getSolutionMenuGroups() {
  return SOLUTION_MENU_GROUPS.map((group) => ({
    ...group,
    items: group.slugs
      .map((slug) => SOLUTIONS.find((s) => s.slug === slug))
      .filter((s): s is Solution => Boolean(s)),
  }));
}

export function getFeaturedSolutions(): Solution[] {
  return FEATURED_SOLUTION_SLUGS.map((slug) => SOLUTIONS.find((s) => s.slug === slug)).filter(
    (s): s is Solution => Boolean(s),
  );
}

export function getSolutions(): Solution[] {
  return SOLUTIONS;
}

export function filterSolutions(query: string): Solution[] {
  const q = query.trim().toLowerCase();
  if (!q) return SOLUTIONS;
  return SOLUTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.headline.toLowerCase().includes(q) ||
      s.pain.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.bullets.some((b) => b.toLowerCase().includes(q)),
  );
}

export function getSolutionTotal(): number {
  return SOLUTIONS.length;
}
