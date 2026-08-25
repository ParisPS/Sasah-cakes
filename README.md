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

**Fase 4 — Conteúdo real concluída.** A galeria (Home + página Galeria)
exibe 12 fotos reais de trabalhos entregues (7 bolos redondos, 3 bolos
quadrados, 2 bandejas de docinhos), carregadas via `next/image` a partir
de `public/portfolio/`, com categoria e texto alternativo descritivo
definidos em [`content/cardapio.json`](content/cardapio.json). As fotos
são recortes de carrossel do Instagram (~231×325px) — resolução moderada,
substituíveis por versões em melhor definição no futuro sem mudança de
estrutura.

As 6 páginas do sitemap estão implementadas e em produção:

- Home, [`/cardapio`](https://sasah-cakes.vercel.app/cardapio),
  [`/docinhos`](https://sasah-cakes.vercel.app/docinhos),
  [`/como-encomendar`](https://sasah-cakes.vercel.app/como-encomendar),
  [`/galeria`](https://sasah-cakes.vercel.app/galeria) e
  [`/contato`](https://sasah-cakes.vercel.app/contato)
- Componentes recorrentes de
  [`docs/design/style-guide.md`](docs/design/style-guide.md): Header
  sticky, botão flutuante de WhatsApp, card de produto, badges e galeria
- Fora de escopo (registrado como nota, ver
  [`docs/design/style-guide.md`](docs/design/style-guide.md#considerações-futuras)):
  motion refinado, observabilidade, testes automatizados e formulário de
  pedido

Fases anteriores, ainda válidas como fonte de verdade:

- Fase 1 — conteúdo em [`content/cardapio.json`](content/cardapio.json) e
  páginas em [`docs/sitemap.md`](docs/sitemap.md)
- Fase 2 — especificação visual em
  [`docs/design/design-tokens.md`](docs/design/design-tokens.md),
  [`docs/design/wireframes.md`](docs/design/wireframes.md) e
  [`docs/design/style-guide.md`](docs/design/style-guide.md)

## Fluxo de trabalho

Todo trabalho neste repositório segue o padrão descrito em
[`docs/PROJECT_GUIDELINES.md`](docs/PROJECT_GUIDELINES.md): Issue → branch
→ Pull Request → merge em `main`.
