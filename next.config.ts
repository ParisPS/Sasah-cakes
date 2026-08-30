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

  // Fase 9 (redesign de marca) — Docinhos e Contato deixaram de ser
  // páginas próprias (ver docs/redesign/arquitetura.md "1"). Redirects
  // 301 (permanent) preservam links já compartilhados/indexados em vez
  // de deixá-los quebrados. Ver docs/sitemap.md ("Redirects").
  async redirects() {
    return [
      {
        source: "/docinhos",
        destination: "/cardapio#docinhos",
        permanent: true,
      },
      {
        source: "/contato",
        destination: "/como-encomendar",
        permanent: true,
      },
    ];
  },
};

// withSentryConfig faz upload de source maps no build (para stack traces
// legíveis em produção) e injeta a instrumentação necessária. Sem
// SENTRY_AUTH_TOKEN no ambiente (ex: localmente, ou no CI), o upload é
// simplesmente pulado — o build continua funcionando normalmente. Ver
// docs/OBSERVABILITY.md ("Troubleshooting: confirmando o upload de
// source maps").
export default withSentryConfig(nextConfig, {
  org: "paris-1c",
  project: "javascript-nextjs",
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Explícito em vez de depender do default implícito do pacote: com
  // Turbopack (o bundler padrão do Next.js 16, usado neste projeto), o
  // upload de source map só acontece através deste hook — sem ele, o
  // caminho tradicional de upload via config de Webpack nunca roda
  // porque não há build de Webpack para injetar. @sentry/nextjs
  // 10.71.0+ já assume `true` como default quando detecta Turbopack,
  // então isto não muda o comportamento atual — só documenta a
  // intenção em vez de depender de um default implícito que pode mudar
  // em versões futuras do pacote.
  useRunAfterProductionCompileHook: true,

  // Só loga o processo de upload fora do CI do GitHub Actions (`!!process.env.CI`
  // sozinho pegaria a Vercel também — ela também define `CI=1` no
  // ambiente de build, não é exclusivo do GitHub Actions. Isso estava
  // silenciando por engano toda confirmação/erro do upload de source
  // map nos Build Logs da própria Vercel, mesmo com um
  // SENTRY_AUTH_TOKEN válido configurado lá. `VERCEL` é uma variável de
  // sistema documentada da Vercel — exclui explicitamente esse
  // ambiente do silêncio pensado só para não poluir os logs do GitHub
  // Actions, onde não há token real configurado mesmo).
  silent: !!process.env.CI && !process.env.VERCEL,

  // Não envia telemetria sobre o próprio build para a Sentry.
  telemetry: false,
});
