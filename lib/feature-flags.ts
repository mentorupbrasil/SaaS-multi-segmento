function envFlag(name: string, defaultValue: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return defaultValue;
  return raw === "true" || raw === "1";
}

export const FEATURE_FLAGS = {
  IA: envFlag("FEATURE_IA", false),
  PORTAL: envFlag("FEATURE_PORTAL", false),
  PUBLIC_BOOKING: envFlag("FEATURE_PUBLIC_BOOKING", true),
  WHATSAPP: envFlag("FEATURE_WHATSAPP", true),
  SENTRY: envFlag("FEATURE_SENTRY", Boolean(process.env.SENTRY_DSN)),
  ANALYTICS: envFlag("FEATURE_ANALYTICS", Boolean(process.env.NEXT_PUBLIC_GA_ID)),
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}
