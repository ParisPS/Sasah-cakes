// Hook de instrumentação do Next.js — roda uma vez, antes do server ou do
// edge runtime começarem a atender requisições. Carrega a config do
// Sentry correspondente ao runtime atual. Ver docs/OBSERVABILITY.md.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captura erros lançados durante o processamento de uma requisição no
// server (Server Components, Route Handlers) — complementa os error
// boundaries de UI (error.tsx/global-error.tsx).
export const onRequestError = Sentry.captureRequestError;
