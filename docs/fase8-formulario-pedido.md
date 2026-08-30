# Fase 8 — Formulário de Pedido

Fase retomada depois de ficar pausada por decisão de UX (ver histórico de
fases no [`README.md`](../README.md)). Adiciona um formulário de pedido
dentro da página [`/como-encomendar`](../app/como-encomendar/page.tsx)
existente — não uma página nova.

## Por que sem backend

Decisão de UX fechada antes da implementação: o formulário **não** tem
banco de dados, planilha, e-mail ou API route própria. Ele só monta uma
mensagem de texto a partir do que foi preenchido e abre o WhatsApp já
com essa mensagem pronta (`wa.me`) — 100% client-side, no navegador de
quem está preenchendo. As mesmas razões de proporcionalidade das Fases 5
e 6 (site institucional pequeno, baixo tráfego): manter/operar um
backend próprio para receber pedidos não se paga aqui, e a Samirah já
confirma pedidos manualmente pelo WhatsApp de qualquer forma — o
formulário só poupa ela e o cliente de escrever a mensagem inteira à
mão, sem mudar como o pedido de fato é fechado.

Consequência direta: nenhum pedido preenchido "fica perdido" se o
cliente fechar a aba sem enviar — mas também nenhum pedido fica
registrado em lugar nenhum além da conversa de WhatsApp que resulta do
envio. Isso é aceitável porque é exatamente o mesmo comportamento que já
existia antes (WhatsApp como único canal de confirmação de pedido).

## Estrutura de campos

Implementada em [`lib/pedido.ts`](../lib/pedido.ts) (lógica pura,
testada em `lib/pedido.test.ts`) e
[`components/FormularioPedido.tsx`](../components/FormularioPedido.tsx)
(UI). Nenhum produto, tamanho, recheio, sabor ou preço é inventado —
tudo vem de [`content/cardapio.json`](../content/cardapio.json) via
`lib/cardapio.ts`.

1. **Produto** (obrigatório, pills em checkboxes independentes — não
   radio): Bolo Redondo, Bolo Quadrado e Docinhos podem ser marcados
   juntos na mesma encomenda — no máximo **um item por categoria**
   (não dá pra pedir dois Bolos Redondos diferentes no mesmo pedido; se
   precisar de dois tamanhos diferentes da mesma categoria, ainda
   precisa de duas conversas/encomendas separadas). Cada categoria
   marcada abre seu próprio `<fieldset>`/`<legend>` aninhado dentro do
   `<fieldset>`/`<legend>` "Produto", com os campos daquela categoria —
   os blocos das categorias marcadas ficam visualmente separados uns
   dos outros (cada um num card próprio) e podem aparecer ao mesmo
   tempo:
   - **Bolo Redondo/Quadrado:** Tamanho (`<select>`, opções reais da
     categoria) + Recheio (`<select>`, lista real de
     `recheiosDisponiveis`).
   - **Docinhos:** Quantidade de sabores (2 ou 4, pills — as duas únicas
     opções reais de `opcoesDeSabores`) + um `<select>` de sabor por
     unidade escolhida, cada um excluindo dinamicamente os sabores já
     escolhidos nos outros campos (nunca é possível escolher o mesmo
     sabor duas vezes na mesma encomenda).
2. **Data desejada** (obrigatório, `<input type="date">`, único e
   compartilhado pelo pedido inteiro — uma só data de retirada, mesmo
   com várias categorias marcadas): `min` é `dataMinimaPermitida()` —
   hoje + a antecedência mínima real lida de
   `comoEncomendar.antecedenciaMinima` (4 dias, no conteúdo atual, mas
   lido do JSON, não hardcodado). Escolher uma data mais próxima mostra
   o erro "Encomendas precisam de no mínimo N dias de antecedência." em
   tempo real, sem esperar o envio do formulário.
3. **Nome** (obrigatório, texto, único e compartilhado).
4. **Observações / tema do bolo** (opcional, `<textarea>`, até 300
   caracteres, com contador visível, único e compartilhado — não é um
   campo por item).
5. **Botão "Enviar Pedido"** (variante `primary` de
   [`components/Button.tsx`](../components/Button.tsx)): desabilitado
   até `normalizarRascunho()` (lib/pedido.ts) conseguir montar um pedido
   completo e válido a partir do que foi preenchido — pelo menos uma
   categoria marcada e totalmente preenchida (marcar uma categoria e
   deixá-la pela metade invalida o pedido inteiro, não só aquele item).
   Ao clicar, monta a mensagem (`montarMensagemPedido()`) e abre
   `linkWhatsApp()` (`lib/cardapio.ts` — o telefone de contato central,
   nunca hardcodado de novo) numa nova aba.

## Formato da mensagem gerada

`montarMensagemPedido()` (lib/pedido.ts) tem dois formatos, escolhidos
pela quantidade de itens marcados:

**Um item só** — formato "achatado" (idêntico ao de antes da
multi-categoria, para não mudar a mensagem de quem sempre pediu uma
coisa só): saudação → categoria e detalhes → data desejada →
observações (só se preenchidas) → nome.

```
Olá! Gostaria de fazer uma encomenda:

Categoria: Bolo Redondo
Tamanho: 20cm
Recheio: Brigadeiro

Data desejada: 25/12/2026
Observações: Tema festa junina
Nome: Maria Teste
```

**Vários itens** — cada categoria marcada vira um item numerado
("1)", "2)", …), separado por linha em branco, seguido de
data/observações/nome (únicos, nunca repetidos por item):

```
Olá! Gostaria de fazer uma encomenda com 2 itens:

1) Bolo Redondo
Tamanho: 20cm
Recheio: Brigadeiro

2) Docinhos
Sabores: 4 sabores (25 unidades de cada sabor) — Beijinho, Brigadeiro, Cajuzinho, Churros

Data desejada: 25/12/2026
Nome: Ana Teste
```

A descrição da quantidade de sabores ("25 unidades de cada sabor")
também vem de `content/cardapio.json`, não é um texto fixo no código.

## CTA primário vs. secundário

Antes da Fase 8, a página tinha um único botão "Chamar no WhatsApp"
(variante `primary`) dentro do card de Contato, usado tanto por quem já
sabia o que queria pedir quanto por quem só tinha uma dúvida — os dois
casos empurrados para a mesma conversa genérica de WhatsApp.

Com o formulário, os dois papéis se separam visualmente:

- **CTA primário — o formulário.** Pensado para quem já decidiu o que
  quer encomendar: preenche os detalhes reais do pedido e já chega no
  WhatsApp com a mensagem pronta.
- **CTA secundário — "Prefere só tirar uma dúvida? Fale direto no
  WhatsApp"** (variante `secondary`, sem fundo/sombra — ver
  `docs/design/design-tokens.md`, "Botões"). Reposicionado para perto do
  topo da página, junto da frase de abertura, antes mesmo dos 4 passos —
  para quem ainda está decidindo e só quer perguntar algo antes de
  preencher qualquer coisa. Continua abrindo o WhatsApp com a mensagem
  padrão genérica de `linkWhatsApp()` (sem dados de pedido nenhum).

O botão genérico não foi removido, só mudou de papel e de lugar — a
mesma decisão de design que este documento tenta deixar rastreável para
quem for mexer na página depois.

## Acessibilidade

- `<fieldset>`/`<legend>` agrupando "Produto" (as 3 categorias); cada
  categoria marcada abre seu próprio `<fieldset>`/`<legend>` **aninhado**
  nomeado pela categoria ("Bolo Redondo", "Bolo Quadrado", "Docinhos") —
  o agrupamento aninhado é o que permite dois campos com o mesmo rótulo
  visível ("Tamanho", "Recheio") conviverem na mesma página sem
  ambiguidade: o nome acessível de cada campo inclui o grupo que o
  contém.
- Categorias usam `<input type="checkbox">` (múltipla escolha), não
  `type="radio"` (escolha única) — trocado quando a Fase 8 passou a
  permitir mais de uma categoria por pedido.
- Todo campo tem `<label htmlFor>` associado; campos obrigatórios têm
  `*` visível no label e uma frase de abertura explicando a convenção
  ("Campos marcados com \* (obrigatório) são obrigatórios.").
- Erros (data inválida) usam `aria-describedby` + `role="alert"` no
  parágrafo de erro, e `aria-invalid="true"` no campo.
- Navegação por teclado: os pills de categoria/quantidade de sabores são
  `<input type="checkbox">`/`<input type="radio">` reais, só
  visualmente escondidos via `sr-only` — cada `<label>` que os envolve
  tem `position: relative` para que o input absolutamente posicionado
  fique contido dentro do próprio pill (sem isso, o scroll automático do
  navegador ao focar via Tab levaria para o canto errado da página).
  Foco visível via `has-[:focus-visible]` no pill.
- **Categoria desmarcada fica genuinamente fora do alcance do
  teclado.** O bloco de campos de cada categoria usa a mesma animação
  de altura via CSS grid (`grid-template-rows` de `0fr` a `1fr`,
  `overflow-hidden`) do menu mobile em `components/Header.tsx` — mas
  `overflow-hidden` só esconde a _pintura_, o campo continua com seu
  tamanho "natural" por baixo do clipe. Sem tratamento adicional, um
  `<select>` de uma categoria desmarcada continuaria alcançável via Tab
  mesmo invisível na tela (achado durante a implementação, verificado
  com um teste de foco por teclado). Corrigido com o atributo `inert` no
  wrapper do bloco (mesmo padrão já usado em `Header.tsx`): tira o
  conteúdo escondido da árvore de acessibilidade e do foco por teclado,
  mesmo continuando no DOM para a transição poder animar a saída.
- Nenhuma cor nova foi criada para indicar erro — a Fase 2 não definiu
  um token de validação (ver `docs/design/design-tokens.md`), e esta
  fase não inventa um. Um campo inválido usa borda mais grossa em
  `sage-700` (já existente na paleta) e a mensagem de erro usa
  `sage-900` em negrito — a diferença de peso/traço marca "isto é um
  erro" sem depender só de cor.

## Testes

- **Unitário** (`lib/pedido.test.ts`, Vitest): 26 testes cobrindo
  `normalizarRascunho` (cada categoria sozinha, combinações de 2 e das 3
  juntas, categoria marcada e incompleta invalidando o pedido inteiro,
  todos os casos inválidos) e o texto exato de `montarMensagemPedido`
  nos dois formatos (item único "achatado" e múltiplos itens numerados).
- **E2E** (`e2e/pedido.spec.ts`, Playwright, mobile 390px + desktop
  1280px, 18 testes): fluxo de uma categoria só (sem regressão do
  comportamento original) para as 3 categorias; Bolo Redondo + Docinhos
  juntos; as 3 categorias juntas; desmarcar uma categoria remove seus
  dados da mensagem; marcar uma categoria e deixá-la incompleta mantém
  o botão desabilitado mesmo com outra completa; validação de data
  mínima; CTA secundário.

## O que NÃO mudou

Nenhum backend, API route, banco de dados ou serviço de e-mail foi
introduzido. Nenhum produto, tamanho, recheio, sabor ou preço foi
inventado — tudo vem de `content/cardapio.json`. O botão genérico de
WhatsApp continua existindo, só mudou de variante/posição/rótulo.
