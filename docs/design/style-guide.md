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

Usado no Cardápio (tamanhos de bolo) e em Docinhos (pacote).

- Estrutura: nome/tamanho (H4 ou H5) + rendimento (corpo, `ink-600`) +
  preço em destaque (H4, `sage-700`).
- Estilo: `radius-lg`, fundo `cream-300`, `shadow-sm` em repouso →
  `shadow-md` no hover, padding `24px`.
- Variante "pacote" (Docinhos): mesmo card, mais largo, com sub-lista das
  opções de sabores dentro.

### Badge de categoria

Usado para recheios, sabores de docinho e categorias de foto na galeria.

- Estilo: `radius-pill`, fundo `sage-100`, texto `sage-700`, `14px`/600,
  padding `4px 12px`.
- Comportamento: lista com `flex-wrap`, sem ordenação forçada.

### Botão flutuante de WhatsApp

Presente em **todas** as páginas, fixo no canto inferior direito.

- Estilo: circular, fundo `sage-500`, ícone `cream-300`, `shadow-lg`.
- Link direto para `wa.me` com o telefone de `content/cardapio.json`
  (`comoEncomendar.contato.telefone`), idealmente com mensagem
  pré-preenchida (ex: "Olá! Vi o site e quero fazer uma encomenda.").
- Sempre visível — não usar scroll-to-hide.

### Seção de galeria

Usada na Home (preview) e na página Galeria (completa).

- Item: foto (proporção fixa, placeholder `sage-100` até imagem real) +
  badge de categoria sobreposto no canto inferior da foto.
- Preview (Home): scroll horizontal no mobile, grid 4 colunas no desktop.
- Completa (Galeria): grid 1 coluna no mobile, 3 colunas no desktop.

### Cabeçalho (header)

- Mobile: logo/nome à esquerda + ícone `☰` à direita, abrindo menu.
- Desktop (≥768px): nav inline substitui o `☰`.
- Fixo no topo (`position: sticky`) em ambas as versões.

## Considerações futuras

Fora do escopo desta fase — apenas registradas aqui para não se perderem:

- **Motion / animações de interface** — princípios de transição e
  microinterações (hover de cards, entrada de seções ao rolar a página)
  serão definidos em uma fase específica de motion design.
- **Observabilidade, lint avançado, testes automatizados** — configuração
  de qualidade de código e monitoramento será tratada quando o projeto
  Next.js for implementado (Fase 3 em diante), não nesta fase de design.
- **Cor de erro/validação** — a V1 não tem formulário (apenas botão
  flutuante de WhatsApp), então nenhum token `error` foi definido. Se um
  formulário for implementado em fase posterior, uma cor de
  erro/validação precisará ser escolhida na ocasião.
