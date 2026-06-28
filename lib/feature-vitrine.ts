import { ALL_FEATURES, FEATURE_GROUPS, type FeatureGroup, type FeatureItem } from "@/lib/features";

export const FEATURED_FEATURE_IDS = [
  "clientes",
  "agenda",
  "financeiro",
  "relatorios",
  "portal",
  "ordens",
] as const;

export const FEATURE_GROUP_ICONS: Record<string, string> = {
  gestao: "Users",
  operacao: "ClipboardList",
  tecnologia: "Sparkles",
};

export function getFeaturedFeatures(): FeatureItem[] {
  return FEATURED_FEATURE_IDS.map((id) => ALL_FEATURES.find((f) => f.id === id)).filter(
    (f): f is FeatureItem => Boolean(f),
  );
}

export function filterFeatures(query: string, groupId?: string): FeatureItem[] {
  const q = query.trim().toLowerCase();
  let list = ALL_FEATURES;
  if (groupId) {
    list = FEATURE_GROUPS.find((g) => g.id === groupId)?.items ?? [];
  }
  if (!q) return list;
  return list.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.short.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q),
  );
}

export function getFeatureGroups(): FeatureGroup[] {
  return FEATURE_GROUPS;
}

export function getFeatureTotal(): number {
  return ALL_FEATURES.length;
}
