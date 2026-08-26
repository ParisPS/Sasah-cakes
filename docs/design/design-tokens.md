# Design Tokens — Sasah Cakes

Especificação visual da Fase 2. Estes tokens são a fonte da verdade para a
implementação na Fase 3 (Next.js/React). Nenhum código de aplicação é
criado nesta fase — apenas a especificação.

Tom geral: artesanal, acolhedor, caseiro ("cottagecore") — não corporativo.

## Paleta de cores

Extrapolada da referência verde-oliva/sálvia + creme/off-white + branco do
material da cliente.

### Sálvia (cor de marca / primária)

| Token      | Hex       | Uso                                                          |
| ---------- | --------- | ------------------------------------------------------------ |
| `sage-900` | `#3F4A2E` | Texto sobre creme em títulos de destaque, ênfase forte       |
| `sage-700` | `#5C6B41` | Hover/estado ativo de elementos primários, texto de link     |
| `sage-500` | `#7C8A5E` | Cor de marca principal — botões, cabeçalhos de seção, ícones |
| `sage-300` | `#A8B48A` | Bordas, divisores, estados secundários                       |
| `sage-100` | `#DCE3CB` | Fundos suaves, hover de badges/cards                         |

### Creme / off-white

| Token       | Hex       | Uso                                                |
| ----------- | --------- | -------------------------------------------------- |
| `cream-700` | `#E8DFC8` | Bordas e divisores sobre fundo branco              |
| `cream-500` | `#F5EFDF` | Fundo de seções alternadas, texto sobre `sage-500` |
| `cream-300` | `#FBF7EC` | Fundo de cards sobre branco                        |

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

Revisada na **Fase 9** (redesign de marca) — decisão e justificativa
completa em
[`../redesign/direcao-artistica.md`](../redesign/direcao-artistica.md#1-tipografia).
Fontes via Google Fonts.

- **Display** — [Fraunces](https://fonts.google.com/specimen/Fraunces),
  peso 600–700. Serifada bold, com personalidade artesanal. Reservada
  para H1–H3, hero, e a exceção do preço em destaque (ver escala
  abaixo).
  - Fallback: `Georgia, 'Times New Roman', serif`
- **Funcional** —
  [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque),
  peso 400–600 (trocou a Lora na Fase 9). Grotesca com detalhes
  orgânicos — corpo de texto, nav, botões, badges e H4–H6.
  - Fallback: `-apple-system, 'Segoe UI', sans-serif`

### Escala tipográfica

| Nível                           | Fonte               | Peso | Desktop | Mobile | Line-height |
| ------------------------------- | ------------------- | ---- | ------- | ------ | ----------- |
| H1                              | Fraunces            | 700  | 56px    | 36px   | 1.1         |
| H2                              | Fraunces            | 700  | 40px    | 28px   | 1.15        |
| H3                              | Fraunces            | 600  | 28px    | 22px   | 1.2         |
| H4                              | Bricolage Grotesque | 600  | 22px    | 19px   | 1.25        |
| H5                              | Bricolage Grotesque | 600  | 18px    | 17px   | 1.3         |
| H6                              | Bricolage Grotesque | 600  | 16px    | 15px   | 1.3         |
| Corpo                           | Bricolage Grotesque | 400  | 16px    | 16px   | 1.6         |
| Legenda                         | Bricolage Grotesque | 500  | 14px    | 13px   | 1.5         |
| **Preço em destaque (exceção)** | **Fraunces**        | 600  | 22px    | 19px   | 1.25        |

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

## Botões

- **Primário** — fundo `sage-500`, texto `cream-300`, `radius-pill`,
  padding `12px 28px`, `shadow-sm` em repouso, `shadow-md` + `sage-700` no
  hover.
- **Secundário** — fundo transparente, borda `1px solid sage-500`, texto
  `sage-700`, `radius-pill`. Hover: fundo `sage-100`.
- **Botão flutuante (WhatsApp)** — circular (`border-radius: 999px`,
  largura = altura), fundo `sage-500`, ícone `cream-300`, `shadow-lg`,
  fixo no canto inferior direito.

## Badges

Pill-shape (`radius-pill`), fundo `sage-100`, texto `sage-700`, peso 600,
tamanho `14px`, padding `4px 12px`. Usadas para categorias (ex: "Bolo
redondo", "Docinho", "Recheio").

## Cards

`radius-lg`, fundo `cream-300` sobre página branca (ou `white` sobre
seções `cream-500`), `shadow-sm` em repouso subindo para `shadow-md` no
hover, padding interno `24px`. Decoração opcional: mancha de aquarela
verde (`sage-100`/`sage-300`, baixa opacidade) posicionada em um dos
cantos, atrás do conteúdo.
