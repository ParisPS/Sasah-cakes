# Sasah Cakes

Site institucional para a confeitaria da Samirah Carvalho Paula — cardápio de bolos e docinhos, portfólio de trabalhos e contato via WhatsApp.

🔗 **Produção:** https://sasah-cakes.vercel.app

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Vitest · Playwright · Sentry

## Rodando localmente

```bash
npm install
npm run dev          # ambiente de desenvolvimento
npm run build        # build de produção
npm run lint         # lint
npm run format:check # checagem de formatação
npm run test         # testes unitários (Vitest)
npm run test:e2e     # testes end-to-end (Playwright)
```

## Estrutura de pastas

```
app/              # páginas e rotas (Next.js App Router)
content/          # cardapio.json — fonte de dados do site
public/portfolio/ # fotos reais do portfólio
docs/             # documentação detalhada (design, testes, observabilidade)
e2e/              # testes end-to-end (Playwright)
```

## Histórico de fases

| Fase | Status | Entrega principal | Doc |
|---|---|---|---|
| 1 — Conteúdo/Estrutura | ✅ | Cardápio estruturado, sitemap, fluxo de contribuição | [PROJECT_GUIDELINES.md](docs/PROJECT_GUIDELINES.md) |
| 2 — Design | ✅ | Paleta, tipografia, tokens, wireframes, style guide | [docs/design/](docs/design/) |
| 3 — Desenvolvimento | ✅ | Site Next.js completo, deploy Vercel com preview por PR | — |
| 4 — Conteúdo real | ✅ | 12 fotos reais no portfólio, substituindo placeholders | — |
| 5 — Qualidade de código | ✅ | Lint, testes unitários/E2E, CI obrigatório no merge | [TESTING.md](docs/TESTING.md) |
| 6 — Observabilidade | ✅ | Sentry (captura de erros client/server/edge) | [OBSERVABILITY.md](docs/OBSERVABILITY.md) |
| 7 — Motion e Animações | ✅ | Skeleton loading, transições de entrada, prefers-reduced-motion | [motion-principles.md](docs/design/motion-principles.md) |
| 8 — Formulário de pedido | ⏸️ Pausada | Decisões de UX em aberto | — |

## Pendências conhecidas

- `SENTRY_AUTH_TOKEN` não configurado na Vercel — stack traces de produção aparecem minificados até ser adicionado
- Fase 8 (formulário de pedido) pausada, aguardando decisões de UX
- Domínio próprio não configurado (opcional, hoje usa `sasah-cakes.vercel.app`)

## Contribuindo

Toda tarefa vira uma Issue → trabalho em branch → Pull Request mencionando `Closes #N` → CI (lint + testes) precisa passar → merge. Detalhes completos em [PROJECT_GUIDELINES.md](docs/PROJECT_GUIDELINES.md).
