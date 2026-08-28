# Mascote e Tipografia — Fase 10

Documenta as decisões da Fase 10: um mascote ilustrado (fatia de bolo
antropomorfizada, estilo retrô "rubber hose", num selo circular vintage)
e uma tipografia display com mais personalidade de confeitaria. Não
reabre a paleta sálvia/creme definida em
[`../design/design-tokens.md`](../design/design-tokens.md) — só adiciona
o rosa do mascote como acento pontual, já presente na ilustração
original, sem expandir seu uso a outros elementos do site.

Este arquivo é escrito incrementalmente ao longo dos PRs desta fase —
cada seção abaixo é adicionada/expandida conforme a entrega
correspondente é mergeada.

## 1. Tipografia — Titan One substitui a Fraunces

A Fraunces (fonte display da Fase 2/9, ver
[`direcao-artistica.md`](direcao-artistica.md) "1.1") é elegante e
serifada — combinava com uma direção "cottagecore" mais sóbria, mas
destoa do personagem retrô/cartoon do mascote. A Fase 10 troca a fonte
display por [Titan One](https://fonts.google.com/specimen/Titan+One)
(Google Fonts): uma display bold, arredondada, só maiúsculas, com a
mesma "massa" visual dos rótulos de embalagem e quadrinhos vintage do
estilo "rubber hose" do personagem.

- **Onde entra:** H1–H4 (`app/globals.css`), o texto do selo do mascote
  (`public/brand/mascote-selo.png`, já embutido na imagem, não é texto
  HTML). H4 é o nome de produto em `components/ProductCard.tsx` — volta
  a usar a fonte display nesta fase (na Fase 9 tinha migrado para a
  fonte funcional, lógica "catálogo escaneável"); o selo do mascote pede
  mais personalidade de marca no nome do produto do que aquela leitura
  neutra.
- **Onde NÃO entra:** corpo de texto, nav, botões, badges, H5–H6 —
  continuam em Bricolage Grotesque (fonte funcional da Fase 9,
  inalterada).
- **Peso único:** Titan One só existe em peso 400 no Google Fonts (é uma
  fonte "black"/bold por desenho). Todo heading que usava `font-bold`
  (700) ou `font-semibold`/`font-medium` (600/500) em cima da fonte
  display passa a usar `font-normal` explicitamente — pedir um peso que
  a fonte não tem forçaria negrito sintético do navegador, distorcendo o
  traço da letra.
- **Maiúsculas:** Titan One já é visualmente "caixa alta" por desenho de
  glifo (não tem uma forma minúscula distinta da maiúscula) — nenhum
  `text-transform: uppercase` foi adicionado, o texto continua digitado
  normalmente no HTML (import ante para SEO/leitura por leitor de tela).

## 2. Mascote e selo

_(preenchido no PR de logo/favicon — Issue #101)_

## 3. Hero da Home

_(preenchido no PR do hero — Issue #102)_

## 4. Fotos placeholder (`public/produtos-ia/`)

_(preenchido no PR de fotos placeholder — Issue #103)_
