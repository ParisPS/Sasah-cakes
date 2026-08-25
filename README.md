# Sasah Cakes

[![CI](https://github.com/ParisPS/Sasah-cakes/actions/workflows/ci.yml/badge.svg)](https://github.com/ParisPS/Sasah-cakes/actions/workflows/ci.yml)

Site institucional da **Sasah Cakes**, confeitaria da Samirah Carvalho
Paula. Vende bolos (redondos e quadrados) e docinhos sob encomenda, com
retirada no local e pagamento via Pix.

## Visão geral

O objetivo do projeto é apresentar o cardápio da confeitaria, explicar
como encomendar e exibir um portfólio de trabalhos já feitos, servindo
como canal digital de apoio ao contato direto via WhatsApp/telefone.

## Stack

- **Next.js (App Router) + React + TypeScript**, projeto na raiz do
  repositório (não em subpasta `/app` isolada — o diretório `app/` que
  existe aqui é o roteador do App Router, não um wrapper de monorepo).
  Raiz única mantém `content/` e `docs/` acessíveis por caminho relativo
  simples, sem a complexidade de um monorepo para um único app.
- **Tailwind CSS v4** para estilização. Escolhido em vez de CSS Modules ou
  styled-components porque o design system
  ([`docs/design/design-tokens.md`](docs/design/design-tokens.md)) já é
  uma escala de tokens nomeados (cores, radius, sombras, tipografia) — o
  `@theme` do Tailwind v4 mapeia esses tokens 1:1 para utility classes
  (`bg-sage-500`, `rounded-lg`, `shadow-md`, `font-heading`) direto em
  `app/globals.css`, sem exigir arquivo de tema separado.
- Deploy via **Vercel**, com preview automático por Pull Request.

## Rodando localmente

```
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
npm run test      # testes unitários/integração — ver docs/TESTING.md
npm run test:e2e   # testes end-to-end (Playwright)
```

## Estrutura de pastas

```
app/                    # App Router — uma pasta por rota
  layout.tsx             # layout raiz: fontes, Header, Footer, WhatsAppButton
  page.tsx                # Home ("/")
  globals.css              # design tokens (Tailwind v4 @theme) + tipografia base
  cardapio/page.tsx       # "/cardapio"
  docinhos/page.tsx       # "/docinhos"
  como-encomendar/page.tsx # "/como-encomendar"
  galeria/page.tsx        # "/galeria"
  contato/page.tsx        # "/contato"
components/              # componentes recorrentes (style-guide.md)
lib/
  cardapio.ts             # tipos + helpers sobre content/cardapio.json
  nav.ts                  # links de navegação (Header)
content/cardapio.json    # fonte de verdade do conteúdo (Fase 1)
docs/                    # sitemap, guidelines, design (Fases 1 e 2)
public/portfolio/        # fotos reais da galeria (servidas via next/image)
```

## Qualidade e Testes

- **ESLint** (`eslint-config-next`) para correção — mantido em vez de
  migrar para Biome, pelas regras específicas do Next.js/React
  (`core-web-vitals`, `exhaustive-deps`) mantidas pela Vercel.
- **Prettier** (+ `prettier-plugin-tailwindcss`) para formatação.
- **Vitest** + Testing Library para testes unitários e de integração leve
  (`lib/cardapio.ts`, componentes recorrentes).
- **Playwright** para testes end-to-end, em mobile (390px) e desktop
  (1280px).
- **GitHub Actions** roda lint + testes unitários + E2E em todo Pull
  Request; a `main` exige os três passando antes de permitir merge.

Guia completo — como rodar cada camada localmente, estrutura de pastas de
teste, o que o CI verifica — em [`docs/TESTING.md`](docs/TESTING.md).

## Observabilidade

Erros em produção (client, server e edge) são capturados automaticamente
via **Sentry** (`@sentry/nextjs`), incluindo os error boundaries de UI
(`app/error.tsx`, `app/global-error.tsx`). Sem session replay nem
tracing de performance detalhado por padrão — mantém o plano gratuito
viável para o baixo tráfego esperado.

Painel, como interpretar um alerta, limites do plano gratuito e como
habilitar tracing/replay depois, se necessário — em
[`docs/OBSERVABILITY.md`](docs/OBSERVABILITY.md).

## Motion e Animações

Animações sutis (CSS puro + `IntersectionObserver`, sem Framer Motion —
justificativa em
[`docs/design/motion-principles.md`](docs/design/motion-principles.md)):
skeleton na paleta da marca para as fotos do portfólio, fade-in +
slide-up ao rolar a Home, menu mobile animado e um `loading.tsx` global
como feedback entre rotas. Toda animação respeita `prefers-reduced-motion`
(`motion-reduce:` do Tailwind).

## Deploy

Produção: **https://sasah-cakes.vercel.app/**

O repositório está conectado à Vercel via GitHub App:

- Todo Pull Request gera automaticamente uma **URL de preview** (o bot da
  Vercel comenta o link direto no PR).
- Merge em `main` atualiza a **produção** automaticamente, sem passo
  manual.

Nenhuma configuração adicional foi necessária no repositório — a Vercel
detecta o Next.js e usa `next build` como comando de build por padrão.

## Status atual

**Fase 7 — Motion e Animações concluída.** Skeleton loading, animações de
entrada ao rolar a Home, menu mobile animado e feedback de carregamento
entre rotas — todos com `prefers-reduced-motion` respeitado. Ver
[Motion e Animações](#motion-e-animações) e
[`docs/design/motion-principles.md`](docs/design/motion-principles.md).

- Ainda fora de escopo: formulário de pedido (nota em
  [`docs/design/style-guide.md`](docs/design/style-guide.md#considerações-futuras))
- Fase 6 — observabilidade: ver [Observabilidade](#observabilidade) e
  [`docs/OBSERVABILITY.md`](docs/OBSERVABILITY.md) (nota de não aplicado
  por ora: Datadog, New Relic, OpenTelemetry)
- Fase 5 — lint, formatação, testes (unitários, integração leve e E2E) e
  CI: ver [Qualidade e Testes](#qualidade-e-testes) e
  [`docs/TESTING.md`](docs/TESTING.md) (nota de não aplicado por ora:
  testes de mutação e ferramentas de arquitetura)

Fases anteriores, ainda válidas como fonte de verdade:

- Fase 1 — conteúdo em [`content/cardapio.json`](content/cardapio.json) e
  páginas em [`docs/sitemap.md`](docs/sitemap.md)
- Fase 2 — especificação visual em
  [`docs/design/design-tokens.md`](docs/design/design-tokens.md),
  [`docs/design/wireframes.md`](docs/design/wireframes.md) e
  [`docs/design/style-guide.md`](docs/design/style-guide.md)
- Fase 3 — as 6 páginas do sitemap implementadas e em produção: Home,
  [`/cardapio`](https://sasah-cakes.vercel.app/cardapio),
  [`/docinhos`](https://sasah-cakes.vercel.app/docinhos),
  [`/como-encomendar`](https://sasah-cakes.vercel.app/como-encomendar),
  [`/galeria`](https://sasah-cakes.vercel.app/galeria) e
  [`/contato`](https://sasah-cakes.vercel.app/contato)
- Fase 4 — galeria com 12 fotos reais de trabalhos entregues, servidas via
  `next/image` a partir de `public/portfolio/`

## Fluxo de trabalho

Todo trabalho neste repositório segue o padrão descrito em
[`docs/PROJECT_GUIDELINES.md`](docs/PROJECT_GUIDELINES.md): Issue → branch
→ Pull Request → merge em `main`.
