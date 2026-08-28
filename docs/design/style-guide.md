# Style Guide — Sasah Cakes

Guia de referência para quem for implementar a Fase 3 (Next.js/React +
Vercel). Consolida os dois documentos anteriores:

- [`design-tokens.md`](design-tokens.md) — paleta, tipografia,
  espaçamentos, border-radius, sombras, botões/badges/cards
- [`wireframes.md`](wireframes.md) — hierarquia de blocos por página,
  mobile-first

Este arquivo não repete os valores dos tokens — referencia-os pelo nome
(ex: `sage-500`, `radius-pill`) definido em `design-tokens.md`.

## Princípios

- **Artesanal antes de corporativo.** Tipografia serifada, cantos
  arredondados, manchas de aquarela — evitar grids muito rígidos ou tom
  "SaaS".
- **Mobile-first.** O público chega principalmente pelo link na bio do
  Instagram, no celular. Todo componente é desenhado para a coluna única
  do mobile primeiro; o desktop é uma adaptação, não o ponto de partida
  (ver regras responsivas em `wireframes.md`).
- **Conteúdo é o produto.** A cardápio (`content/cardapio.json`) dirige o
  layout — os componentes abaixo existem para exibir esse conteúdo, não o
  contrário.

## Componentes recorrentes

### Card de produto

Usado no Cardápio (tamanhos de bolo redondo/quadrado e pacote de
docinhos — desde a Fase 9, Docinhos é uma seção do Cardápio, não uma
página própria, ver [`../sitemap.md`](../sitemap.md)).

- Estrutura: nome/tamanho (H4 ou H5) + rendimento (corpo, `ink-600`) +
  preço em destaque (H4, `sage-700`).
- Estilo: `radius-lg`, fundo `cream-300`, padding `24px`. Estado
  funcional principal é **active/tap** (mobile-first, sem cursor):
  `shadow-sm` em repouso → `shadow-md` ao toque/clique (active), com leve
  escala (ex: `scale(0.98)`) ou redução de opacidade para dar feedback
  tátil. Hover (`shadow-md`) pode existir como enhancement **opcional**
  apenas em desktop (≥768px).
- Variante "pacote" (Docinhos): mesmo card, mais largo, com sub-lista das
  opções de sabores dentro.

### Badge de categoria

Usado para recheios, sabores de docinho e categorias de foto na galeria.

- Estilo: `radius-pill`, fundo `sage-100`, texto `sage-700`, `14px`/600,
  padding `4px 12px`.
- Comportamento: lista com `flex-wrap`, sem ordenação forçada.

### Botão flutuante de WhatsApp

Presente em **todas** as páginas, fixo no canto inferior direito.

- Estilo: circular, fundo `sage-700` (não `sage-500` — corrigido na Fase
  9 por contraste, ver [`design-tokens.md`](design-tokens.md#botões)),
  ícone `cream-300`, `shadow-lg`.
- Link direto para `wa.me` com o telefone de `content/cardapio.json`
  (`comoEncomendar.contato.telefone`), idealmente com mensagem
  pré-preenchida (ex: "Olá! Vi o site e quero fazer uma encomenda.").
- Sempre visível — não usar scroll-to-hide.

### Seção de galeria

Usada na Home (preview) e na página Galeria (completa).

- Item: foto (proporção fixa 3:4, moldura passe-partout `cream-300` ao
  redor — desde a Fase 9) + badge de categoria sobreposto no canto
  inferior da foto.
- Preview (Home): scroll horizontal no mobile, grid 4 colunas no
  desktop; sempre 4 fotos, uma amostra curada (não o portfólio inteiro —
  ver `lib/cardapio.ts`, `amostraCuradaPortfolio`).
- Completa (Galeria): grid 1 coluna no mobile, 3 colunas no desktop
  (`grid-flow-dense`, com 1-2 fotos ocupando 2 colunas para variar o
  tamanho de exibição sem variar o crop). Desde a Fase 9, tem um filtro
  por categoria no topo (`components/GaleriaFiltravel.tsx`) em vez do
  badge repetido em cada foto — o badge só aparece na Home.

### Cabeçalho (header)

- Mobile: logo à esquerda + ícone `☰` à direita, abrindo menu.
- Desktop (≥768px): nav inline substitui o `☰`.
- Fixo no topo (`position: sticky`) em ambas as versões.
- **Logo:** selo do mascote (`public/brand/mascote-selo.png`, Fase 10 —
  ver [`../redesign/mascote-e-tipografia.md`](../redesign/mascote-e-tipografia.md#2-mascote-e-selo)),
  não mais um wordmark de texto. 48px no mobile, 56px no desktop —
  legível como marca sem competir com a navegação. Mesmo selo, menor
  (80px), centralizado no rodapé.

## Motion / animações de interface

Princípios de transição, duração, easing e acessibilidade (sempre
respeitando `prefers-reduced-motion`) documentados em
[`motion-principles.md`](motion-principles.md) e implementados na Fase 7
(skeleton loading da galeria, entrada de seções ao rolar a Home, menu
mobile animado, feedback de carregamento entre rotas).

## Considerações futuras

Fora do escopo do projeto até aqui — apenas registradas para não se
perderem:

- **Cor de erro/validação** — a V1 não tem formulário (apenas botão
  flutuante de WhatsApp), então nenhum token `error` foi definido. Se um
  formulário for implementado em fase posterior, uma cor de
  erro/validação precisará ser escolhida na ocasião.
