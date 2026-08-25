# Sasah Cakes

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
```

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

**Fase 2 — Design concluída.** Especificação visual completa, sem código
de aplicação ainda:

- [`docs/design/design-tokens.md`](docs/design/design-tokens.md) —
  paleta, tipografia, espaçamentos, border-radius, sombras
- [`docs/design/wireframes.md`](docs/design/wireframes.md) — wireframes
  mobile-first de todas as páginas
- [`docs/design/style-guide.md`](docs/design/style-guide.md) — guia
  consolidado de referência para a implementação

Conteúdo estruturado em [`content/cardapio.json`](content/cardapio.json)
e páginas planejadas em [`docs/sitemap.md`](docs/sitemap.md) (Fase 1).

## Fluxo de trabalho

Todo trabalho neste repositório segue o padrão descrito em
[`docs/PROJECT_GUIDELINES.md`](docs/PROJECT_GUIDELINES.md): Issue → branch
→ Pull Request → merge em `main`.
