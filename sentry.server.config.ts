// Inicialização do Sentry no server (Node.js runtime). Importado por
// instrumentation.ts. Ver docs/OBSERVABILITY.md.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  enabled: process.env.NODE_ENV === "production",
});
