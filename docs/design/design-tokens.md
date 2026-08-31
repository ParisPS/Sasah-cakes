# Design Tokens — Sasah Cakes

Especificação visual da Fase 2. Estes tokens são a fonte da verdade para a
implementação na Fase 3 (Next.js/React). Nenhum código de aplicação é
criado nesta fase — apenas a especificação.

Tom geral: artesanal, acolhedor, caseiro ("cottagecore") — não corporativo.

## Paleta de cores

Extrapolada da referência verde-oliva/sálvia + creme/off-white + branco do
material da cliente.

### Sálvia (cor de marca / primária)

| Token      | Hex       | Uso                                                                                                                                |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `sage-900` | `#3F4A2E` | Texto sobre creme em títulos de destaque; hover/active do CTA principal e texto de badge (desde a correção de contraste da Fase 9) |
| `sage-700` | `#5C6B41` | Fundo do CTA principal em repouso (desde a Fase 9), hover/estado ativo de elementos secundários, texto de link                     |
| `sage-500` | `#7C8A5E` | Acento de marca — borda do botão secundário, indicador de carregamento (deixou de ser fundo de CTA na Fase 9, ver "Botões" abaixo) |
| `sage-300` | `#A8B48A` | Bordas, divisores, estados secundários                                                                                             |
| `sage-100` | `#DCE3CB` | Fundos suaves, hover de badges/cards                                                                                               |

### Creme / off-white

| Token       | Hex       | Uso                                   |
| ----------- | --------- | ------------------------------------- |
| `cream-700` | `#E8DFC8` | Bordas e divisores sobre fundo branco |
| `cream-500` | `#F5EFDF` | Fundo de seções alternadas            |
| `cream-300` | `#FBF7EC` | Fundo de cards sobre branco           |

### Base

| Token     | Hex       | Uso                                                   |
| --------- | --------- | ----------------------------------------------------- |
| `white`   | `#FFFFFF` | Fundo geral da página                                 |
| `ink-900` | `#2E2A20` | Texto principal (marrom-preto quente, não preto puro) |
| `ink-600` | `#6B6455` | Texto secundário, legendas                            |

### Utilitárias

| Token     | Hex                      | Uso                                       |
| --------- | ------------------------ | ----------------------------------------- |
| `success` | `#7C8A5E` (= `sage-500`) | Confirmações — reaproveita a cor de marca |

A V1 do site não tem formulário (apenas botão flutuante de WhatsApp), então
nenhum token de erro/validação é definido nesta fase. Ver nota em
[`style-guide.md`](style-guide.md#considerações-futuras).

## Tipografia

Revisada na **Fase 9** (redesign de marca) e novamente na **Fase 10**
(mascote e tipografia) — decisão e justificativa completa em
[`../redesign/direcao-artistica.md`](../redesign/direcao-artistica.md#1-tipografia)
(Fase 9) e
[`../redesign/mascote-e-tipografia.md`](../redesign/mascote-e-tipografia.md#1-tipografia--titan-one-substitui-a-fraunces)
(Fase 10). Fontes via Google Fonts.

- **Display** — [Titan One](https://fonts.google.com/specimen/Titan+One)
  (substituiu a Fraunces na Fase 10), peso único 400. Display bold,
  arredondada, só maiúsculas por desenho — combina com o mascote
  ilustrado em estilo retrô "rubber hose". Reservada para H1–H4, hero, e
  a exceção do preço em destaque (ver escala abaixo). Como só existe em
  peso 400, nenhum heading nesta fonte usa `font-bold`/`font-semibold` —
  todos em `font-normal` explicitamente.
  - Fallback: `'Arial Black', 'Helvetica Neue', sans-serif`
- **Funcional** —
  [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque),
  peso 400–600 (trocou a Lora na Fase 9). Grotesca com detalhes
  orgânicos — corpo de texto, nav, botões, badges e H5–H6.
  - Fallback: `-apple-system, 'Segoe UI', sans-serif`

### Escala tipográfica

| Nível                           | Fonte               | Peso | Desktop | Mobile | Line-height |
| ------------------------------- | ------------------- | ---- | ------- | ------ | ----------- |
| H1                              | Titan One           | 400  | 56px    | 36px   | 1.1         |
| H2                              | Titan One           | 400  | 40px    | 28px   | 1.15        |
| H3                              | Titan One           | 400  | 28px    | 22px   | 1.2         |
| H4                              | Titan One           | 400  | 22px    | 19px   | 1.25        |
| H5                              | Bricolage Grotesque | 600  | 18px    | 17px   | 1.3         |
| H6                              | Bricolage Grotesque | 600  | 16px    | 15px   | 1.3         |
| Corpo                           | Bricolage Grotesque | 400  | 16px    | 16px   | 1.6         |
| Legenda                         | Bricolage Grotesque | 500  | 14px    | 13px   | 1.5         |
| **Preço em destaque (exceção)** | **Titan One**       | 400  | 22px    | 19px   | 1.25        |

## Espaçamentos

Escala em base 4px:

`4, 8, 12, 16, 24, 32, 48, 64, 96` (px)

Uso recomendado: `4`/`8` para espaçamento interno de badges e ícones,
`16`/`24` para padding de cards, `48`/`64` entre blocos de conteúdo,
`96` entre seções de página.

## Border-radius

| Token         | Valor   | Uso                                                |
| ------------- | ------- | -------------------------------------------------- |
| `radius-sm`   | `8px`   | Inputs, botões pequenos                            |
| `radius-md`   | `16px`  | Cards de produto                                   |
| `radius-lg`   | `28px`  | Blocos de conteúdo grandes, seções em destaque     |
| `radius-pill` | `999px` | Badges, título de seção com fundo, botão principal |

## Sombras

Sombras suaves, com leve tingimento quente (não preto puro), para manter o
tom artesanal em vez de "flat corporativo".

| Token       | Valor                                | Uso                                 |
| ----------- | ------------------------------------ | ----------------------------------- |
| `shadow-sm` | `0 1px 3px rgba(63, 74, 46, 0.10)`   | Cards em repouso                    |
| `shadow-md` | `0 6px 16px rgba(63, 74, 46, 0.14)`  | Cards em hover, dropdowns           |
| `shadow-lg` | `0 16px 32px rgba(63, 74, 46, 0.18)` | Modais, botão flutuante de WhatsApp |

## Dark mode (Fase 11)

Opção de tema escuro deliberada — não um "inverter cores" genérico.
Implementação técnica: variante `dark:` do Tailwind v4 baseada em
CLASSE (`@custom-variant dark (&:where(.dark, .dark *));` em
`app/globals.css`), não só `prefers-color-scheme` — a classe `.dark`
fica em `<html>`, aplicada por um script inline `beforeInteractive`
(`app/layout.tsx`) antes da primeira pintura (evita flash de tema
errado) e mantida por `components/ThemeToggle.tsx` depois de montado.

**Controle (revisado na Fase 11.1):** um único botão de ícone com morph
sol/lua (`components/ThemeToggle.tsx`) — não mais um `<select>` com 3
opções nomeadas. Em repouso mostra o ícone do tema ATUAL; hover/
`focus-visible` faz um morph (opacity + scale + rotate, `duration-300`)
para o ícone OPOSTO, como prévia da ação; clicar alterna de fato. O
`aria-label` descreve a ação ("Mudar para modo escuro"/"Mudar para modo
claro"), não o estado — atualiza a cada clique. Sem preferência salva,
o site ainda abre conforme `prefers-color-scheme` do sistema
(`lib/tema.ts` continua com o tipo `Tema = "claro" | "escuro" |
"sistema"` internamente, só a UI parou de expor "sistema" como uma
terceira opção clicável — redundante com um ícone binário por
natureza); a partir do primeiro clique, a escolha manual persiste em
localStorage como antes.

### Por que sálvia (sage-100 a 900) fica FIXA nos dois temas

Ao contrário de branco/creme/ink (que invertem — ver tabela abaixo),
nenhum tom de sálvia muda de valor entre claro e escuro. Duas razões:

1. **Boa parte do uso já é como fundo de elemento saturado** (botão
   primário, botão flutuante do WhatsApp, pill de categoria/filtro
   selecionado — todos `sage-700`/`sage-900`), sempre pareado com um
   texto claro fixo (`on-accent`, ver abaixo). Escurecer ainda mais um
   fundo que já é escuro por natureza (ex: `sage-900` ainda mais escuro
   no tema escuro) não ajudaria, e mudar o par de cores quebraria o
   contraste calibrado.
2. **Onde sálvia aparece como TEXTO direto sobre um fundo neutro**
   (headings, links, labels) o problema é o oposto: testado com o
   valor claro sem mudança nenhuma, `sage-900`/`sage-700` como texto
   sobre os novos fundos escuros medem só ~3:1 (abaixo do mínimo AA) —
   contraste calculado, não assumido (ver tabela de verificação
   abaixo). A correção não é redefinir o token (quebraria o papel de
   fundo do item 1), e sim os componentes aplicarem um override
   `dark:text-sage-300` (no lugar de `sage-700`) ou
   `dark:text-sage-100` (no lugar de `sage-900`) — reaproveitando tons
   que **já existem** na paleta e **já são claros o bastante** para
   funcionar como texto sobre fundo escuro, em vez de inventar cor
   nova. `sage-100`/`sage-300`/`sage-500` como fundo/borda (Badge,
   bordas de pill, ring de foco) também ficam fixos — já são claros o
   bastante para continuarem funcionando nos dois temas sem mudança.

### `on-accent` — por que é um token à parte

`cream-300` tem dois papéis que entram em conflito num tema escuro:
como **superfície** (fundo de card) precisa escurecer; como **texto**
sobre um botão/pill de fundo sálvia saturado precisa continuar claro
nos dois temas (o fundo sálvia por trás também não muda — item 1
acima). A mesma variável CSS não pode satisfazer os dois ao mesmo
tempo. `--color-on-accent` (`#FBF7EC`, igual ao `cream-300` claro,
fixo) resolve isso: um token dedicado só para "texto/ícone sobre uma
superfície de sage saturada", nunca usado como fundo em lugar nenhum.

### Tabela de tokens claro → escuro

| Token       | Claro     | Escuro    | Observação                                             |
| ----------- | --------- | --------- | ------------------------------------------------------ |
| `sage-100`  | `#DCE3CB` | `#DCE3CB` | Fixo — ver "Por que sálvia fica fixa" acima            |
| `sage-300`  | `#A8B48A` | `#A8B48A` | Fixo                                                   |
| `sage-500`  | `#7C8A5E` | `#7C8A5E` | Fixo                                                   |
| `sage-700`  | `#5C6B41` | `#5C6B41` | Fixo — como TEXTO usa override `dark:text-sage-300`    |
| `sage-900`  | `#3F4A2E` | `#3F4A2E` | Fixo — como TEXTO usa override `dark:text-sage-100`    |
| `cream-700` | `#E8DFC8` | `#84754F` | Borda/divisor                                          |
| `cream-500` | `#F5EFDF` | `#221D15` | Fundo de seção alternada                               |
| `cream-300` | `#FBF7EC` | `#2A241A` | Fundo de card — como TEXTO usa `on-accent` (ver acima) |
| `white`     | `#FFFFFF` | `#1C1812` | Fundo geral da página                                  |
| `ink-900`   | `#2E2A20` | `#F2ECDD` | Texto principal                                        |
| `ink-600`   | `#6B6455` | `#B6AC98` | Texto secundário                                       |
| `on-accent` | `#FBF7EC` | `#FBF7EC` | Fixo — texto/ícone sobre fundo sage saturado           |

Implementado em `app/globals.css`: os neutros (branco/creme/ink) são
redefinidos dentro de um bloco `.dark { ... }` — toda utility que já
existe (`bg-white`, `text-ink-900` etc.) passa a resolver
automaticamente para o valor escuro, sem editar nenhum componente. Só
os poucos casos de sálvia-como-texto (listados acima) precisam de um
override `dark:` explícito no componente.

### Verificação de contraste (WCAG AA)

Mesmo rigor da auditoria da Fase 9 — nenhum par foi assumido, todos
calculados (luminância relativa + razão de contraste, fórmula WCAG).
Texto normal ≥ 4,5:1, UI/borda ≥ 3:1:

| Par                                                             | Contraste | Mínimo |
| --------------------------------------------------------------- | --------- | ------ |
| Texto principal (`ink-900` escuro) sobre página                 | 14,99:1   | 4,5:1  |
| Texto secundário (`ink-600` escuro) sobre página                | 7,86:1    | 4,5:1  |
| Texto secundário sobre card (`cream-300` escuro)                | 6,84:1    | 4,5:1  |
| Texto principal sobre card                                      | 13,05:1   | 4,5:1  |
| Borda (`cream-700` escuro) sobre página                         | 3,90:1    | 3:1    |
| Borda (`cream-700` escuro) sobre card                           | 3,40:1    | 3:1    |
| Heading (`dark:text-sage-100`) sobre página                     | 13,37:1   | 4,5:1  |
| Heading (`dark:text-sage-100`) sobre card                       | 11,64:1   | 4,5:1  |
| Label/link (`dark:text-sage-300`) sobre página                  | 8,04:1    | 4,5:1  |
| Label/link (`dark:text-sage-300`) sobre card                    | 7,00:1    | 4,5:1  |
| Label/link (`dark:text-sage-300`) sobre seção alternada         | 7,62:1    | 4,5:1  |
| Badge: `sage-900` sobre `sage-100` (par fixo, self-consistente) | 7,13:1    | 4,5:1  |
| Botão primário: `on-accent` sobre `sage-700` (fixo)             | 5,40:1    | 4,5:1  |
| Botão primário hover: `on-accent` sobre `sage-900` (fixo)       | 8,80:1    | 4,5:1  |
| Botão secundário: borda `sage-500` (fixo) sobre página          | 4,76:1    | 3:1    |
| Campo de formulário inválido: borda `dark:border-sage-300`      | 8,04:1    | 3:1    |
| Pill não selecionado: borda `sage-300` (fixo) sobre card        | 7,00:1    | 3:1    |

**Achado descartado durante a auditoria:** a primeira tentativa para o
campo inválido usava `dark:border-sage-700` (mantendo o mesmo token do
claro) — mede só ~3,06:1 contra o fundo branco do campo no escuro,
tecnicamente acima do mínimo de 3:1 mas com margem apertada demais para
um indicador de UI. Trocado para `dark:border-sage-300` (8,04:1) —
mesmo raciocínio de "sálvia como texto/indicador precisa de um tom
claro fixo" do resto da auditoria.

**Fora do escopo de contraste, de propósito:** as imagens raster do
mascote/selo (`public/brand/*.png`) têm fundo creme "gravado" no
próprio arquivo — aparecem como um selo/emblema sobre o fundo escuro
(padrão comum de logo em dark mode), não recolorizáveis via CSS. Não
foram reprocessadas nesta fase. `app/global-error.tsx` (fallback de
erro do layout raiz, com CSS inline autossuficiente — ver
`docs/OBSERVABILITY.md`) também fica fora: ele existe justamente para
não depender de `globals.css`/Tailwind, que pode ser a causa da falha
que o aciona.

## Botões

Implementados como um único componente (`components/Button.tsx`, desde a
Fase 9 — antes copiado em 6 lugares, ver
[`../redesign/auditoria.md`](../redesign/auditoria.md#4-componentes-reutilizáveis-vs-redundantes)),
com `variant="primary" | "secondary"`. Label em Bricolage Grotesque 600,
`letter-spacing` levemente positivo (~0.01em) — separa visualmente "isto
é um botão de marca" de um link comum, sem precisar de caixa alta.

- **Primário** — fundo `sage-700` (não mais `sage-500`, ver nota abaixo),
  texto `cream-300`, `radius-pill`, padding `12px 28px`, `shadow-sm` em
  repouso, `shadow-md` + `sage-900` no hover/active.
- **Secundário** — fundo transparente, borda `1px solid sage-500`, texto
  `sage-700`, `radius-pill`, sem sombra. Hover/active: fundo `sage-100` e
  texto `sage-900` (não mais `sage-700` — ver nota de contraste abaixo).
  Especificado desde a Fase 2, mas nunca usado no código até a Fase 9.
- **Botão flutuante (WhatsApp)** — circular (`border-radius: 999px`,
  largura = altura), fundo `sage-700` (mesma correção do botão primário),
  ícone `cream-300`, `shadow-lg`, fixo no canto inferior direito.
  Componente próprio (`components/WhatsAppButton.tsx`), fora do
  componente `Button` — forma e função (ícone, sem label) são diferentes
  o suficiente para não compartilhar a mesma implementação, mas usa o
  mesmo par de cores de fundo/texto e por isso precisou da mesma
  correção.

**Correção de contraste (pós-Fase 9):** o fundo do botão primário era
`sage-500`, com `cream-300` de texto — medindo apenas 3,47:1 de
contraste, abaixo do mínimo AA de 4,5:1 para texto normal (achado
documentado, mas não corrigido, na Etapa 4 do redesign, ver
[`../redesign/arquitetura.md`](../redesign/arquitetura.md)). Trocado para
`sage-700`, que mede 5,40:1 sobre `cream-300` — passa AA com folga.
Hover/active subiram de `sage-700` para `sage-900` (8,80:1), preservando
a progressão "escurece ao interagir" com um degrau a mais no mesmo tom.
`sage-500` continua definido na paleta e em uso em outros contextos (ex:
borda do botão secundário, ícone de loading) — não foi removido, só
deixou de ser fundo de CTA.

**Segunda correção (revisão da Fase 9, Etapa 5):** o texto `sage-700` do
botão secundário e das pills de filtro/categoria (Badge, Cardápio,
`GaleriaFiltravel`) sobre o fundo `sage-100` do hover/active mede apenas
4,37:1 — também abaixo do mínimo AA de 4,5:1, um achado mais sutil que
passou despercebido na correção anterior por só aparecer em estados de
interação, não em repouso. Corrigido subindo o texto para `sage-900`
(7,13:1) nesses estados; o texto em repouso (sobre fundo branco/creme,
sem esse problema) não muda.

## Badges

Pill-shape (`radius-pill`), fundo `sage-100`, texto `sage-900` (não
`sage-700` — corrigido na revisão da Fase 9, Etapa 5: `sage-700` sobre
`sage-100` mede 4,37:1, abaixo do mínimo AA; `sage-900` mede 7,13:1),
peso 600, tamanho `14px`, padding `4px 12px`. Usadas para categorias (ex:
"Bolo redondo", "Docinho", "Recheio").

## Cards

`radius-lg`, fundo `cream-300` sobre página branca (ou `white` sobre
seções `cream-500`), padding interno `24px`. Decoração opcional: mancha
de aquarela verde (`sage-100`/`sage-300`, baixa opacidade) posicionada em
um dos cantos, atrás do conteúdo.

**Repouso vs. active/hover (revisado na Fase 9):** em repouso, borda fina
de 1px em `cream-700` **e** `shadow-sm` (não `shadow-none`) — ver
justificativa em
[`../redesign/direcao-artistica.md`](../redesign/direcao-artistica.md#32-cards--menos-dependência-de-sombra-mais-de-campo-de-cor--borda-fina).
A ideia original era substituir a sombra pela borda; na prática, toda a
família `cream` tem luminância muito próxima entre si (`cream-300` sobre
branco ou sobre `cream-500` mede ~1,1:1 de contraste — a borda sozinha
não é suficiente pra separar o card do fundo em nenhum dos dois casos),
então o `shadow-sm` residual continua sendo o que efetivamente define o
contorno; a borda só reforça. `shadow-md` entra como reforço maior no
active/hover, junto com leve escala (`scale(0.98)`), para dar feedback
tátil.
