// Inicialização do Sentry no client. Convenção do Next.js App Router
// (`instrumentation-client.ts` na raiz) — carregado automaticamente pelo
// Next.js antes de qualquer código da aplicação rodar no navegador.
// Ver docs/OBSERVABILITY.md.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Site institucional de baixo tráfego — plano gratuito do Sentry.
  // Performance tracing e session replay ficam desligados por padrão
  // (custam quota de "performance units"/"replays" separada da quota de
  // erros). Ver docs/OBSERVABILITY.md ("Como habilitar depois") para
  // ligar caso o projeto cresça.
  tracesSampleRate: 0,

  // Só reporta em produção — evita erros de `next dev` (ex: HMR,
  // extensões de navegador) poluindo o projeto Sentry.
  enabled: process.env.NODE_ENV === "production",
});

// Exigido pelo SDK para rastrear navegações entre páginas (App Router).
// Como tracesSampleRate é 0, isso não gera spans de performance de
// verdade — só evita o aviso de build pedindo esse export.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
