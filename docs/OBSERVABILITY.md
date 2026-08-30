# Observabilidade — Sasah Cakes

Monitoramento de erros em produção, adicionado na Fase 6. Proporcional ao
porte do projeto (site institucional pequeno, baixo tráfego) — um único
serviço (Sentry, plano gratuito), sem APM completo.

## O que está monitorado

**Sentry** (`@sentry/nextjs`), configurado em três runtimes:

- **Client** (`instrumentation-client.ts`) — erros não tratados no
  navegador (JS não capturado por nenhum error boundary).
- **Server** (`sentry.server.config.ts`) — erros em Server Components e
  Route Handlers, via o hook `onRequestError` em `instrumentation.ts`.
- **Edge** (`sentry.edge.config.ts`) — preparado para o caso de o projeto
  vir a ter middleware/rotas edge no futuro; hoje não há nenhuma.

Além da captura automática, os **error boundaries de UI**
(`app/error.tsx` e `app/global-error.tsx` — ver
[`docs/design/style-guide.md`](design/style-guide.md)) chamam
`Sentry.captureException(error)` explicitamente, garantindo que um erro
que derruba a renderização de uma página também vire um evento no Sentry,
além de mostrar uma tela amigável para quem estava navegando.

**O que NÃO está ligado, de propósito:**

- **Session Replay** — gravação da sessão do usuário. Consome quota
  separada do plano gratuito; não vale a pena para o volume esperado.
- **Performance tracing detalhado** — `tracesSampleRate` está em `0` nos
  três runtimes. Sem isso, o Sentry não gera spans de performance (só
  erros), o que mantém o uso dentro da faixa gratuita.

### Como habilitar depois, se necessário

Se o tráfego crescer ou performance virar uma preocupação real:

1. Suba `tracesSampleRate` (ex: `0.1` = 10% das requisições) em
   `instrumentation-client.ts`, `sentry.server.config.ts` e
   `sentry.edge.config.ts`.
2. Para Session Replay, adicione `Sentry.replayIntegration()` ao array
   `integrations` do `Sentry.init()` em `instrumentation-client.ts` (só
   faz sentido no client) e configure `replaysSessionSampleRate` /
   `replaysOnErrorSampleRate`.
3. Confira o consumo de quota em
   [sentry.io/settings/billing](https://sentry.io/settings/billing/) antes
   de aumentar — as duas features têm cota própria, separada da cota de
   erros.

## Como acessar o painel

<https://sentry.io/organizations/paris-1c/issues/?project=javascript-nextjs>

(Login com a conta Sentry que tem acesso à organização `paris-1c`.)

## Como interpretar um alerta

Cada evento não tratado vira uma **Issue** no Sentry (agrupada por
assinatura do erro — a mesma exceção acontecendo várias vezes conta como
uma Issue, com um contador de ocorrências, não uma Issue por evento). Ao
abrir uma:

- **Título** — geralmente a mensagem da exceção. Erros de UI capturados
  pelos error boundaries aparecem com a mensagem original do `Error`
  lançado no código.
- **Stack trace** — com os source maps configurados no build
  (`SENTRY_AUTH_TOKEN`), mostra arquivo/linha do código-fonte
  (`app/cardapio/page.tsx:23`), não do bundle minificado.
- **Tags** — `environment` (production/preview), `runtime` (client/server/
  edge), navegador/SO (para erros de client).
- **First seen / Last seen / Events** — quando o erro apareceu pela
  primeira vez, a última vez, e quantas vezes aconteceu — indica se é um
  problema pontual ou recorrente.
- **Users affected** — quantas sessões distintas bateram nesse erro. Um
  número alto num site de baixo tráfego já é sinal de atenção.

Sentry manda e-mail automaticamente para quem tem acesso ao projeto
quando uma Issue **nova** aparece (comportamento padrão, sem configuração
extra necessária).

## Limites do plano gratuito

O plano gratuito da Sentry (**Developer**) tem cota mensal de eventos de
erro, número de integrantes do time e retenção de dados — os valores
exatos mudam com o tempo, então confira o atual em
[sentry.io/pricing](https://sentry.io/pricing/) em vez de confiar em um
número fixo aqui. Sinais de que está na hora de considerar um plano pago:

- A cota mensal de erros está sendo atingida com frequência (Sentry avisa
  por e-mail quando isso acontece).
- Mais de uma pessoa precisa de acesso próprio ao projeto.
- Vale habilitar Session Replay ou tracing de performance de verdade (ver
  seção acima) — essas features têm cota própria e mais restrita no
  plano gratuito.

## Validação da integração

Documentada na íntegra em
[PR #55](https://github.com/ParisPS/Sasah-cakes/pull/55) (Issue #51): um
mecanismo temporário (`app/dev-sentry-test/`) disparou um erro proposital
no client e outro no server contra um build de produção com o DSN real,
confirmados no painel do Sentry, e removido antes do merge final — não
deixado oculto, porque uma rota que dispara um 500 de propósito fica
acessível por URL direta mesmo sem link em nenhum menu.

## Troubleshooting: confirmando o upload de source maps

`SENTRY_AUTH_TOKEN` configurado na Vercel (Production) não bastava para
ver confirmação do upload de source maps nos Build Logs — nenhuma linha
do Sentry aparecia, nem de sucesso nem de erro. Investigação (ver
Issue #110):

- **Não era o pacote:** `@sentry/nextjs` 10.71.0 (bem acima do mínimo
  10.13.0 que introduziu a opção) já assume
  `useRunAfterProductionCompileHook: true` como default quando detecta
  Turbopack (o bundler padrão do Next.js 16, usado neste projeto) —
  confirmado lendo o código-fonte do pacote e testando localmente
  (`next build` com um token inválido de propósito, só para forçar o
  caminho de upload sem enviar nada de verdade): o hook roda e tenta o
  upload normalmente, falhando apenas por token inválido, como
  esperado. A opção agora está explícita em `next.config.ts` mesmo
  assim — documenta a intenção em vez de depender de um default
  implícito que pode mudar em versões futuras do pacote, mas não era a
  causa do silêncio.
- **Era o `silent`:** a config tinha `silent: !!process.env.CI`, pensado
  para não poluir os logs do GitHub Actions (onde não há
  `SENTRY_AUTH_TOKEN` real configurado mesmo). Só que a Vercel **também**
  define `CI=1` no ambiente de build — não é uma variável exclusiva do
  GitHub Actions. Isso silenciava por engano toda saída do Sentry
  (sucesso ou erro) também nos Build Logs da própria Vercel, mesmo com
  um token válido configurado lá. Reproduzido localmente: com `CI=1`
  sozinho, nenhuma linha do Sentry aparece no build; sem essa variável,
  aparecem normalmente.
- **Correção:** `silent: !!process.env.CI && !process.env.VERCEL` —
  `VERCEL` é uma variável de sistema documentada da própria Vercel,
  definida em todo build/runtime dela. Continua silencioso só no
  GitHub Actions; a Vercel volta a mostrar a saída completa do Sentry.

Se precisar confirmar de novo no futuro que o upload está funcionando,
o Build Log da Vercel deve mostrar linhas como `Found N source map
files`, `Bundled N files`/`Uploaded N files` (sucesso) ou um erro
explícito do `sentry-cli` (ex: token inválido, projeto/org incorretos)
— não mais silêncio total.

## Considerações futuras (não aplicado por ora)

Fora de escopo da Fase 6 — registrado para não se perder, não para ser
adotado a menos que o projeto cresça significativamente:

- **Datadog, New Relic, OpenTelemetry.** Fazem sentido para observabilidade
  de infraestrutura/backend (métricas de sistema, tracing distribuído
  entre serviços). Este projeto não tem backend próprio — é um site
  Next.js estático/SSR na Vercel — então o ganho não justificaria o custo
  e a complexidade de operar mais uma ferramenta. Reconsiderar se o
  projeto vier a ter uma API própria (ex: para receber pedidos online) ou
  múltiplos serviços para correlacionar.
