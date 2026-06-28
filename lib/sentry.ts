/**
 * Sentry bootstrap stub. Set SENTRY_DSN and install @sentry/nextjs for full tracing.
 * Safe to import when the SDK is not installed.
 */
let initialized = false;

async function loadSentry() {
  try {
    return await import("@sentry/nextjs");
  } catch {
    return null;
  }
}

export function initSentry(): void {
  if (initialized) return;
  initialized = true;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  void loadSentry().then((Sentry) => {
    if (!Sentry) {
      if (process.env.NODE_ENV !== "production") {
        console.info(
          "[sentry] SENTRY_DSN is set but @sentry/nextjs is not installed. Run: npm i @sentry/nextjs",
        );
      }
      return;
    }
    Sentry.init({
      dsn,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    });
  });
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!process.env.SENTRY_DSN) return;

  void loadSentry().then((Sentry) => {
    if (!Sentry) {
      console.error("[sentry]", error, context);
      return;
    }
    Sentry.captureException(error, { extra: context });
  });
}
