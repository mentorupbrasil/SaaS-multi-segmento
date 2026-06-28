/**
 * Sentry bootstrap stub. Set SENTRY_DSN and install @sentry/nextjs for full tracing.
 * No runtime dependency until the package is added: npm i @sentry/nextjs
 */
let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  initialized = true;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NODE_ENV !== "production") {
    console.info(
      "[sentry] SENTRY_DSN definido. Para tracing completo: npm i @sentry/nextjs e substitua este stub.",
    );
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!process.env.SENTRY_DSN) return;
  console.error("[sentry]", error, context);
}
