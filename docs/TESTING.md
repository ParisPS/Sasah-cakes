# Testes — Sasah Cakes

Guia de referência da camada de qualidade adicionada na Fase 5. Proporcional
ao porte do projeto (site institucional pequeno, não um sistema crítico) —
sem ferramental desproporcional. Ver decisões de ferramentas em
[`README.md`](../README.md#qualidade-e-testes).

## Rodando localmente

```
npm install

npm run lint            # ESLint (regras Next.js/React)
npm run format           # Prettier — formata tudo
npm run format:check      # Prettier — só verifica, não formata

npm run test              # Vitest — testes unitários/integração, uma vez
npm run test:watch         # Vitest em modo watch
npm run test:coverage       # Vitest com relatório de cobertura

npm run test:e2e            # Playwright — builda, sobe a app e roda os E2E
```

`test:e2e` builda a aplicação e a sobe localmente antes de rodar os
testes (configurado em `playwright.config.ts`, bloco `webServer`) — não é
preciso rodar `npm run dev` à parte antes.

Na primeira vez, instale os browsers do Playwright:

```
npx playwright install --with-deps chromium
```

## Estrutura de pastas de teste

```
lib/cardapio.ts
lib/cardapio.test.ts          # unitário, ao lado do código-fonte

components/ProductCard.tsx
components/ProductCard.test.tsx  # integração leve, ao lado do componente

e2e/
  navigation.spec.ts          # E2E — Playwright
  cardapio.spec.ts
  galeria.spec.ts
```

- **Unitários e integração leve** (`*.test.ts`/`*.test.tsx`): ficam ao
  lado do arquivo que testam, rodam via Vitest + jsdom. Cobrem lógica
  pura (`lib/cardapio.ts`) e renderização isolada de componentes
  (`components/`), sem subir um browser real.
- **End-to-end** (`e2e/*.spec.ts`): pasta própria na raiz, rodam via
  Playwright contra a aplicação real (build de produção), em dois
  viewports — mobile (390px) e desktop (1280px) — configurados como
  projetos separados em `playwright.config.ts`. Cada spec roda nos dois
  automaticamente.

## O que o CI verifica em cada PR

`.github/workflows/ci.yml` roda 3 jobs em paralelo em todo Pull Request
para `main` (e em todo push direto a `main`):

| Job                   | O que roda                                              |
| --------------------- | ------------------------------------------------------- |
| **Lint e formatação** | `npm run lint` + `npm run format:check`                 |
| **Testes unitários**  | `npm run test` (Vitest)                                 |
| **Testes E2E**        | `npm run test:e2e` (Playwright, build + start + testes) |

A branch `main` tem proteção configurada exigindo os 3 checks acima
passando (com a branch atualizada) antes de permitir merge — inclusive
para quem tem permissão de admin no repositório. Ver
[`PROJECT_GUIDELINES.md`](PROJECT_GUIDELINES.md) para o fluxo completo de
Issue → branch → PR.

Se o job de E2E falhar, o relatório HTML do Playwright é publicado como
artifact do workflow (aba "Actions" → o run → "Artifacts") para
investigar localmente com `npx playwright show-report`.

## Cobertura

Resumo (não é o número que importa, é a distribuição — ver `npm run
test:coverage` para o relatório completo):

- **`lib/cardapio.ts` — ~86%.** Toda a lógica pura (formatação de preço,
  montagem do link de WhatsApp, forma dos dados do cardápio) está coberta
  por testes unitários.
- **`components/Badge.tsx`, `ProductCard.tsx`, `WhatsAppButton.tsx` —
  cobertos** por testes de integração leve (renderização isolada com
  Testing Library).
- **`app/**` (páginas) e os demais componentes (`Header`, `Footer`,
  `GallerySection`) aparecem com 0% na cobertura do Vitest — isso é
  esperado, não uma lacuna.** Eles são cobertos pelos testes **E2E**
  (Playwright), que verificam a renderização real das páginas completas,
  navegação e dados exibidos — cobertura que o relatório do Vitest não
  contabiliza, por rodar em outra ferramenta.

## Considerações futuras (não aplicado por ora)

Fora de escopo da Fase 5 — registrado aqui para não se perder, não para
ser adotado a menos que o projeto cresça significativamente:

- **Testes de mutação (ex: Stryker).** Útil para medir a qualidade dos
  testes existentes (não só se rodam, mas se pegam bugs de verdade), mas
  desproporcional para um site institucional deste porte — o custo de
  configuração e o tempo de execução não se pagam ainda.
- **Ferramentas de arquitetura/contrato (ex: Arch-contract).** Fazem
  sentido em bases de código com múltiplos times/módulos e regras de
  dependência a proteger; este projeto é pequeno o suficiente para isso
  ser resolvido por convenção (ver `PROJECT_GUIDELINES.md`) em vez de
  ferramenta dedicada.

Se o projeto crescer (mais páginas, lógica de negócio mais complexa,
mais colaboradores), vale reconsiderar os dois itens acima.
