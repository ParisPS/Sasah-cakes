import path from "path";
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Fixa a raiz do Turbopack neste repositório: evita que ele suba a
  // árvore de diretórios em busca de outro lockfile (ex: um
  // package-lock.json não relacionado na home do usuário).
  turbopack: {
    root: path.resolve(__dirname),
  },
  // O projeto já documenta seu fluxo de trabalho em
  // docs/PROJECT_GUIDELINES.md — desliga a geração automática de
  // AGENTS.md/CLAUDE.md do Next.js para não duplicar/conflitar com isso.
  agentRules: false,
};

// withSentryConfig faz upload de source maps no build (para stack traces
// legíveis em produção) e injeta a instrumentação necessária. Sem
// SENTRY_AUTH_TOKEN no ambiente (ex: localmente, ou no CI), o upload é
// simplesmente pulado — o build continua funcionando normalmente. Ver
// docs/OBSERVABILITY.md.
export default withSentryConfig(nextConfig, {
  org: "paris-1c",
  project: "javascript-nextjs",
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Só loga o processo de upload fora do CI, pra não poluir os logs do
  // GitHub Actions.
  silent: !!process.env.CI,

  // Não envia telemetria sobre o próprio build para a Sentry.
  telemetry: false,
});
