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

1. **Categoria** (obrigatório, pills em radiogroup): Bolo Redondo, Bolo
   Quadrado ou Docinhos — agrupada num `<fieldset>`/`<legend>` "Produto"
   junto com os campos condicionais abaixo, que mudam conforme a
   escolha:
   - **Bolo Redondo/Quadrado:** Tamanho (`<select>`, opções reais da
     categoria) + Recheio (`<select>`, lista real de
     `recheiosDisponiveis`).
   - **Docinhos:** Quantidade de sabores (2 ou 4, pills — as duas únicas
     opções reais de `opcoesDeSabores`) + um `<select>` de sabor por
     unidade escolhida, cada um excluindo dinamicamente os sabores já
     escolhidos nos outros campos (nunca é possível escolher o mesmo
     sabor duas vezes na mesma encomenda).
2. **Data desejada** (obrigatório, `<input type="date">`): `min` é
   `dataMinimaPermitida()` — hoje + a antecedência mínima real lida de
   `comoEncomendar.antecedenciaMinima` (4 dias, no conteúdo atual, mas
   lido do JSON, não hardcodado). Escolher uma data mais próxima mostra
   o erro "Encomendas precisam de no mínimo N dias de antecedência." em
   tempo real, sem esperar o envio do formulário.
3. **Nome** (obrigatório, texto).
4. **Observações / tema do bolo** (opcional, `<textarea>`, até 300
   caracteres, com contador visível).
5. **Botão "Enviar Pedido"** (variante `primary` de
   [`components/Button.tsx`](../components/Button.tsx)): desabilitado
   até `normalizarRascunho()` (lib/pedido.ts) conseguir montar um pedido
   completo e válido a partir do que foi preenchido. Ao clicar, monta a
   mensagem (`montarMensagemPedido()`) e abre `linkWhatsApp()`
   (`lib/cardapio.ts` — o telefone de contato central, nunca hardcodado
   de novo) numa nova aba.

## Formato da mensagem gerada

Ordem fixa: saudação → categoria e detalhes → data desejada →
observações (só se preenchidas) → nome. Exemplo de bolo:

```
Olá! Gostaria de fazer uma encomenda:

Categoria: Bolo Redondo
Tamanho: 20cm
Recheio: Brigadeiro
Data desejada: 25/12/2026
Observações: Tema festa junina
Nome: Maria Teste
```

Exemplo de docinhos (a descrição da quantidade também vem do JSON, não é
um texto fixo no código):

```
Olá! Gostaria de fazer uma encomenda:

Categoria: Docinhos
Sabores: 4 sabores (25 unidades de cada sabor) — Beijinho, Brigadeiro, Cajuzinho, Churros
Data desejada: 25/12/2026
Nome: Ana Teste
```

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

- `<fieldset>`/`<legend>` agrupando "Produto" (categoria + seus campos
  condicionais).
- Todo campo tem `<label htmlFor>` associado; campos obrigatórios têm
  `*` visível no label e uma frase de abertura explicando a convenção
  ("Campos marcados com \* (obrigatório) são obrigatórios.").
- Erros (data inválida) usam `aria-describedby` + `role="alert"` no
  parágrafo de erro, e `aria-invalid="true"` no campo.
- Navegação por teclado: os pills de categoria/quantidade de sabores são
  `<input type="radio">` reais, só visualmente escondidos via `sr-only`
  — cada `<label>` que os envolve tem `position: relative` para que o
  input absolutamente posicionado fique contido dentro do próprio pill
  (sem isso, o scroll automático do navegador ao focar via Tab levaria
  para o canto errado da página). Foco visível via `has-[:focus-visible]`
  no pill.
- Nenhuma cor nova foi criada para indicar erro — a Fase 2 não definiu
  um token de validação (ver `docs/design/design-tokens.md`), e esta
  fase não inventa um. Um campo inválido usa borda mais grossa em
  `sage-700` (já existente na paleta) e a mensagem de erro usa
  `sage-900` em negrito — a diferença de peso/traço marca "isto é um
  erro" sem depender só de cor.

## Testes

- **Unitário** (`lib/pedido.test.ts`, Vitest): 23 testes cobrindo
  `normalizarRascunho` (bolo redondo/quadrado, docinhos com 2 e 4
  sabores, todos os casos inválidos), validação de data mínima e o texto
  exato de `montarMensagemPedido` para cada categoria.
- **E2E** (`e2e/pedido.spec.ts`, Playwright, mobile 390px + desktop
  1280px): preenche o formulário fim a fim para cada categoria e
  confirma que o link `wa.me` aberto contém os dados corretos; confirma
  que uma data abaixo do mínimo mostra o erro e mantém o botão
  desabilitado; confirma que o CTA secundário continua funcional.

## O que NÃO mudou

Nenhum backend, API route, banco de dados ou serviço de e-mail foi
introduzido. Nenhum produto, tamanho, recheio, sabor ou preço foi
inventado — tudo vem de `content/cardapio.json`. O botão genérico de
WhatsApp continua existindo, só mudou de variante/posição/rótulo.
