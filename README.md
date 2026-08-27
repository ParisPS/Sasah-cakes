# Sasah Cakes

[![CI](https://github.com/ParisPS/Sasah-cakes/actions/workflows/ci.yml/badge.svg)](https://github.com/ParisPS/Sasah-cakes/actions/workflows/ci.yml)

Site institucional da **Sasah Cakes**, confeitaria de Samirah Carvalho
Paula. Apresenta cardápio, docinhos, portfólio e como encomendar (retirada
no local, pagamento via Pix), servindo como canal de apoio ao contato
direto via WhatsApp.

**Produção:** https://sasah-cakes.vercel.app

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Vitest +
Testing Library · Playwright · Sentry · Vercel

## Rodando localmente

```
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npm run test      # unitários/integração — detalhes em docs/TESTING.md
npm run test:e2e   # end-to-end (Playwright)
```

## Estrutura de pastas

```
app/                 # App Router — uma pasta por rota
components/          # componentes recorrentes (ver docs/design/style-guide.md)
lib/                 # tipos + helpers sobre content/cardapio.json
content/             # cardapio.json — fonte de verdade do conteúdo do site
public/portfolio/    # fotos reais da galeria
docs/                # guidelines, sitemap, design, testes, observabilidade
e2e/                 # testes end-to-end (Playwright)
```

## Histórico de fases

| Fase                     | Status       | Entrega principal                                                                                                                                                                                                           | Doc                                                                                    |
| ------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1 — Conteúdo             | ✅ concluída | Modelo de conteúdo do cardápio, docinhos, como encomendar e portfólio; arquitetura de páginas                                                                                                                               | [`content/cardapio.json`](content/cardapio.json), [`docs/sitemap.md`](docs/sitemap.md) |
| 2 — Design               | ✅ concluída | Tokens visuais (cor, tipografia, espaçamento), wireframes mobile-first e guia de estilo                                                                                                                                     | [`docs/design/`](docs/design/)                                                         |
| 3 — Implementação        | ✅ concluída | As 6 páginas do sitemap em Next.js/React, deploy contínuo na Vercel                                                                                                                                                         | —                                                                                      |
| 4 — Portfólio real       | ✅ concluída | 12 fotos reais de trabalhos entregues substituindo os placeholders                                                                                                                                                          | —                                                                                      |
| 5 — Qualidade            | ✅ concluída | Lint/formatação, testes unitários e E2E, CI obrigatório no GitHub Actions                                                                                                                                                   | [`docs/TESTING.md`](docs/TESTING.md)                                                   |
| 6 — Observabilidade      | ✅ concluída | Captura de erros em produção (client/server/edge) via Sentry                                                                                                                                                                | [`docs/OBSERVABILITY.md`](docs/OBSERVABILITY.md)                                       |
| 7 — Motion               | ✅ concluída | Skeleton loading, animações de entrada ao rolar, menu mobile animado e feedback entre rotas, todos respeitando `prefers-reduced-motion`                                                                                     | [`docs/design/motion-principles.md`](docs/design/motion-principles.md)                 |
| 8 — Formulário de pedido | ⏸️ pausada   | Ainda não iniciada — decisões de UX em aberto                                                                                                                                                                               | —                                                                                      |
| 9 — Redesign de marca    | ✅ concluída | Nova tipografia (Bricolage Grotesque), redistribuição da paleta, componente `Button` único, consolidação de 6 para 4 páginas (Docinhos e Contato absorvidos, com redirects 301) e correção de contraste AA do CTA principal | [`docs/redesign/`](docs/redesign/)                                                     |

## Pendências conhecidas

- **`SENTRY_AUTH_TOKEN` não configurado na Vercel** — sem ele, os source
  maps não são enviados e os stack traces no Sentry aparecem minificados.
- **Fase 8 (formulário de pedido) pausada** — decisões de UX ainda em
  aberto antes de iniciar a implementação.
- **Domínio próprio não configurado** (opcional) — hoje o site roda só no
  domínio padrão da Vercel.

## Fluxo de contribuição

Todo trabalho segue: Issue → branch → Pull Request (`Closes #N`) → CI
(lint + testes unitários + E2E) → merge em `main`. Nunca commitar direto
na `main`. Detalhes completos em
[`docs/PROJECT_GUIDELINES.md`](docs/PROJECT_GUIDELINES.md).
