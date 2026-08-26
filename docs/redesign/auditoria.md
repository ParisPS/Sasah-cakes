# Auditoria de UX/UI e Identidade — Fase 9, Etapa 1

Levantamento do estado atual do site (código, páginas, componentes,
hierarquia visual, navegação e identidade) antes do redesign de marca.
**Este documento não propõe soluções nem decide nada** — a próxima etapa
(direção artística) parte destes achados. Nenhum código de produção foi
alterado para produzir esta auditoria.

Metodologia: leitura de todas as páginas (`app/*/page.tsx`), todos os
componentes recorrentes (`components/`), `content/cardapio.json`,
`lib/`, e os documentos de design existentes (`docs/design/*.md`),
comparando o que está especificado com o que está de fato implementado.

## 1. Redundâncias de CTA e navegação

### 1.1 Home repete a própria navegação como conteúdo

A Home (`app/page.tsx:5-21,50-55,62-74`) oferece **três caminhos para o
mesmo destino** logo na primeira dobra:

- O botão do hero, "Ver Cardápio", que leva a `/cardapio`
  (`app/page.tsx:50-55`).
- Um card "Destaque" chamado "Cardápio de Bolos", que leva ao **mesmo
  `/cardapio`** (`app/page.tsx:62-74`, item `DESTAQUES[0]`) — duas
  chamadas com textos diferentes para a URL idêntica, a poucos
  centímetros de distância uma da outra.
- O link "Cardápio" do header, sempre visível (`components/Header.tsx`,
  `lib/nav.ts:10`).

Os outros dois cards de Destaque ("Docinhos", "Como Encomendar") também
apenas replicam itens que já existem no menu principal
(`lib/nav.ts:10-14`). Na prática, a seção "Destaques" da Home é uma
segunda cópia do menu de navegação, renderizada como cards — não
comunica nada que o header não já comunique.

### 1.2 O botão flutuante de WhatsApp compete com CTAs de página

O botão flutuante (`components/WhatsAppButton.tsx`) está sempre visível,
em toda página. Além dele, três páginas têm **um segundo CTA de
WhatsApp** no corpo do conteúdo:

- `app/como-encomendar/page.tsx:43-50` — botão "Chamar no WhatsApp".
- `app/contato/page.tsx:21-28` — botão "Chamar no WhatsApp" idêntico.
- O rodapé (`components/Footer.tsx:16-23`), presente em **todas** as
  páginas, com um terceiro link "Fale no WhatsApp".

Isso significa que nas páginas Como Encomendar e Contato existem
**três** convites para abrir o WhatsApp simultaneamente na tela (o botão
flutuante, o botão de conteúdo e o link do rodapé), todos levando ao
mesmo número com a mesma mensagem pré-preenchida
(`lib/cardapio.ts:84-89`). Nenhum se diferencia do outro em propósito ou
texto.

### 1.3 Funil de CTA inconsistente entre páginas

Cardápio e Docinhos não têm um botão de WhatsApp direto — o CTA de fundo
de página é "Quero Encomendar", que leva a `/como-encomendar`
(`app/cardapio/page.tsx:60-67`, `app/docinhos/page.tsx:50-57`), que **só
então** oferece o botão de WhatsApp. Como Encomendar e Contato, por outro
lado, oferecem WhatsApp diretamente. Ou seja, dependendo de por onde a
pessoa entra, o caminho até falar no WhatsApp tem 1 ou 2 cliques a mais —
sem contar que o botão flutuante já resolve isso em 1 clique a qualquer
momento, o que torna o CTA "Quero Encomendar" um passo redundante na
maior parte dos casos.

### 1.4 O rodapé duplica, palavra por palavra, o conteúdo da página em dois casos

O rodapé (`components/Footer.tsx:10-23`) mostra nome, telefone e link de
WhatsApp em todas as páginas — o que faz sentido nas páginas onde esse
dado não aparece em outro lugar (Home, Cardápio, Docinhos, Galeria). Mas
em duas páginas, esse mesmo bloco de informação já foi mostrado
**imediatamente acima**, na própria página:

- `app/como-encomendar/page.tsx:39-51` mostra `contato.nome`,
  `contato.telefone` e um botão de WhatsApp — e o rodapé, logo abaixo,
  repete os três.
- `app/contato/page.tsx:18-29` faz exatamente a mesma coisa: a página
  inteira **é** nome + telefone + botão de WhatsApp, e o rodapé que vem
  na sequência mostra de novo os mesmos três itens.

Nessas duas páginas o rodapé não agrega informação nova — é uma repetição
literal do que a pessoa acabou de ler.

## 2. A "prévia" da galeria não é uma prévia

`components/GallerySection.tsx:25,35` usa `cardapio.portfolio.itens` sem
nenhum recorte — a prop `variant` (`"preview" | "full"`) só muda o
**layout** (scroll horizontal vs. grid), nunca a quantidade de itens.
Resultado: a Home (`app/page.tsx:79-92`, `variant="preview"`) já renderiza
as **12 fotos completas** do portfólio, e a página Galeria
(`app/galeria/page.tsx`, `variant="full"`) mostra as mesmas 12 fotos, só
que em outro grid.

Isso diverge do que o próprio wireframe da Home especificava
(`docs/design/wireframes.md:36`: `[foto][foto][foto][foto] →`, sugerindo
poucas fotos com um link para ver mais) — a implementação já é uma cópia
integral, não uma amostra.

Consequências:

- O link "Ver galeria completa" (`app/page.tsx:85-90`) promete mais
  conteúdo do que de fato existe atrás dele — quem clica vê exatamente o
  que já tinha visto na Home.
- Toda visita à Home paga o custo de carregar as 12 imagens do
  portfólio (ainda que via lazy loading), quando o objetivo declarado da
  seção é só dar um gostinho do trabalho.
- Enquanto o portfólio tiver só 12 fotos, a página Galeria como um todo
  tem pouca razão de existir separada da Home — ela não mostra nada a
  mais.

## 3. Identidade e hierarquia visual

### 3.1 A Home tem uma voz que as páginas internas não têm

A Home investe em copy de marca: manchas de aquarela decorativas
(`app/page.tsx:33-40`), um H1 com personalidade ("Bolos e docinhos feitos
à mão, com carinho") e uma frase de apoio. As cinco páginas internas
começam todas do mesmo jeito raso — um `<h1>` com o nome literal da
página e nada mais:

- Cardápio: `<h1>Cardápio</h1>` (`app/cardapio/page.tsx:21`), direto para
  as listas de produto.
- Docinhos: `<h1>Docinhos</h1>` (`app/docinhos/page.tsx:18`), idem.
- Como Encomendar: `<h1>Como Encomendar</h1>` (`app/como-encomendar/page.tsx:22`),
  idem.
- Contato: `<h1>Contato</h1>` (`app/contato/page.tsx:16`), idem.
- Galeria é a única com uma frase de contexto abaixo do H1
  (`app/galeria/page.tsx:14`, vinda de `cardapio.portfolio.status`).

Do ponto de vista de marca, a sensação "artesanal + acolhedor" só existe
na porta de entrada — quem navega para dentro do site cai em páginas
funcionais, sem nenhuma continuidade de tom.

### 3.2 As animações da Fase 7 também só existem na Home

`RevealOnScroll` (`components/RevealOnScroll.tsx`) é o único mecanismo de
entrada de seção ao rolar a página, e é usado **exclusivamente** em
`app/page.tsx` (confirmado por busca em todo `app/` e `components/`).
Cardápio, Docinhos, Como Encomendar, Galeria e Contato carregam suas
seções sem nenhuma animação de entrada. O resultado é um "degradê de
capricho": a Home parece mais trabalhada que o resto do site, o que vai
na direção contrária de uma identidade consistente.

### 3.3 Limitação real de fotografia para qualquer direção que dependa de imagem

As 12 fotos em `public/portfolio/` têm resolução nativa de
aproximadamente 231×325px (confirmado nos arquivos — ex:
`bolo-redondo-rosa-floral.jpg` é 231×325), recortadas de um carrossel do
Instagram. Isso é adequado para os usos atuais (cards pequenos, grid),
mas é uma restrição real para qualquer direção de próxima etapa que
queira uma foto como protagonista visual (ex: hero fotográfico, foto em
tamanho grande) — ampliar essas imagens vai evidenciar a baixa resolução.
Vale ter isso em mente já na etapa de direção artística, não só na
implementação.

## 4. Componentes reutilizáveis vs. redundantes

**Bem reutilizados:** `ProductCard` (Cardápio ×8, Docinhos ×1), `Badge`
(recheios, sabores, categoria de foto) e `GallerySection` (Home + Galeria,
ainda que com a questão de conteúdo idêntico do item 2) cobrem seus casos
de uso de forma consistente e evitam duplicação de marcação.

**Redundante — o botão-pill principal não é um componente.** A mesma
string de classes Tailwind (`rounded-pill bg-sage-500 font-body
text-cream-300 active:bg-sage-700 md:hover:bg-sage-700 ... shadow-sm
transition-[box-shadow,transform] active:scale-[0.98] active:shadow-md
motion-reduce:transition-none md:hover:shadow-md`) está copiada e colada
**6 vezes** em 5 arquivos diferentes (`app/page.tsx`,
`app/cardapio/page.tsx`, `app/docinhos/page.tsx`,
`app/como-encomendar/page.tsx`, `app/contato/page.tsx`) em vez de existir
como um componente `Button`/`CTA` único. Qualquer ajuste visual nesse
botão — o que é bem provável de acontecer num redesign — exige editar os
6 lugares manualmente, com risco real de esquecer um e gerar
inconsistência.

## 5. Arquitetura de páginas

### 5.1 Docinhos deveria ser uma página própria ou uma categoria do Cardápio?

Pedido explicitamente para avaliar — não é uma decisão fechada nesta
etapa.

**A favor de manter página própria:**

- É uma categoria de produto genuinamente distinta dos bolos (unidade de
  venda fixa — pacote de 100 — em vez de tamanho/rendimento variável),
  então uma tabela unificada com os bolos ficaria estruturalmente
  estranha.
- Ter um item de nav dedicado dá aos docinhos o mesmo peso visual dos
  bolos — sinaliza que é uma linha de produto completa, não um extra. Isso
  importa comercialmente: bandejas de docinho costumam ser encomendadas
  independentemente de bolo.
- Hoje o conteúdo é propositalmente enxuto (1 card + 1 lista de badges) —
  não sobrecarrega a hierarquia por ser uma página própria.

**Contra manter página própria / a favor de virar seção do Cardápio:**

- O conteúdo é fino: um `ProductCard` e uma lista de sabores
  (`app/docinhos/page.tsx:20-48`) — comparável a uma única seção do
  Cardápio, não a uma página inteira.
- Reduz a navegação principal de 5 para 4 itens
  (`lib/nav.ts`), simplificando a arquitetura de informação.
- Remove diretamente um dos três cards de "Destaque" da Home (item 1.1) —
  ataca a redundância de navegação na raiz, em vez de só na Home.
- Uma pessoa planejando uma festa provavelmente quer ver bolo e docinho
  juntos, para orçar os dois — hoje isso exige visitar duas páginas
  separadas para montar essa conta.

**Contra a fusão:**

- O Cardápio já tem duas seções de bolo (Redondos, Quadrados) mais a
  lista de recheios — acrescentar Docinhos sem um mecanismo de
  organização (âncoras, tabs) alonga a página e pode prejudicar a
  escaneabilidade que hoje existe pela separação em páginas.
- Perde-se uma URL própria e memorável (`/docinhos`) para quem for
  compartilhar o link especificamente para pedidos de docinho (ex: na
  bio do Instagram).

### 5.2 Nota adicional: Contato também tem sobreposição forte com Como Encomendar + Rodapé

Não fazia parte da pergunta original, mas apareceu com força na análise
do item 1.4: a página Contato inteira (`app/contato/page.tsx`) é nome +
telefone + botão de WhatsApp + uma frase sobre pagamento/entrega — dado
que já aparece (a) por completo no rodapé de toda página, e (b) de forma
mais detalhada em Como Encomendar (`app/como-encomendar/page.tsx:53-76`,
que já tem pagamento, sinal, antecedência **e** entrega, contra a versão
resumida de Contato em `app/contato/page.tsx:31-33`). Vale considerar,
na etapa de arquitetura, se Contato se justifica como página separada ou
se seu conteúdo deveria simplesmente viver em Como Encomendar.

## 6. Inconsistências de espaçamento

O ritmo vertical entre seções é consistente na maior parte do site
(`mt-10` para o primeiro bloco de conteúdo depois do H1, `mt-14` para os
seguintes — visto em Cardápio, Docinhos e Como Encomendar). A página
Contato quebra esse padrão: usa `mt-10` para o card e depois **`mt-6`**
para a legenda de pagamento (`app/contato/page.tsx:18,31`) — o único
lugar do site em que o espaçamento entre blocos _diminui_ em vez de
manter ou crescer. Isoladamente é um detalhe pequeno, mas é sintoma de
que não existe uma escala de espaçamento documentada em
`docs/design/design-tokens.md` além dos valores brutos em px — a
consistência atual vem de copiar o padrão de um arquivo para o outro, não
de uma regra escrita.

## 7. Responsividade

O site usa essencialmente um único breakpoint (`md`, 768px — confirmado
em 54 ocorrências de `md:` contra uma única ocorrência incidental de
`sm:` em `app/error.tsx`, fora do fluxo principal). Grids de 3-4 colunas
saltam diretamente do layout mobile de coluna única para o desktop
completo exatamente em 768px, sem um estágio intermediário para tablets
em modo retrato (768-834px de largura real, ex. iPad) — nessa faixa, os
grids de card já viram 3-4 colunas ao mesmo tempo em que a viewport ainda
é relativamente estreita, o que pode deixar os cards apertados. Não foi
observado nenhum layout quebrado, mas é uma faixa que vale verificar
visualmente na etapa de implementação.

## 8. Footer desproporcional

Ver item 1.4 para os dois casos de duplicação literal de conteúdo
(Como Encomendar, Contato). De forma mais geral, o rodapé
(`components/Footer.tsx`) tem o mesmo tamanho e peso visual (`py-12`,
nome em destaque + telefone + link + copyright) em todas as páginas,
independente do quanto de conteúdo a página acima dele tem — na página
Contato (a mais curta do site, um único card centralizado em
`max-w-md`), o rodapé chega a ocupar uma fração significativa da tela
sem rolagem, proporcionalmente maior do que nas páginas de conteúdo mais
denso como Cardápio.

## 9. Lista priorizada de oportunidades

**Alto impacto**

1. Resolver a duplicação Home ↔ nav (item 1.1) — a seção "Destaques" hoje
   não soma informação nova à navegação existente.
2. Corrigir ou re-escopar a "prévia" da galeria (item 2) — ou ela vira uma
   prévia de verdade (subconjunto), ou a Home assume que já mostra a
   galeria completa e a página Galeria é repensada (filtro por categoria,
   mais fotos no futuro, etc.).
3. Decidir o destino de Docinhos (item 5.1) e de Contato (item 5.2) na
   arquitetura de informação — afeta diretamente `lib/nav.ts` e quantas
   páginas o site vai ter.
4. Extrair o botão-pill repetido em um componente único (item 4) — needed
   antes de qualquer ajuste visual de marca, para não editar 6 lugares.

**Médio impacto**

5. Reduzir a redundância de CTAs de WhatsApp em Como Encomendar e Contato
   (item 1.2) — hoje até 3 convites simultâneos na mesma tela.
6. Estender `RevealOnScroll` (ou uma variação) às páginas internas (item
   3.2), para acabar com o "degradê de capricho" entre Home e o resto.
7. Dar às páginas internas uma frase de abertura com voz de marca (item
   3.1), não só o nome da página repetido como H1.
8. Ajustar o rodapé para não repetir informação que a própria página já
   mostrou (item 1.4/item 8), especialmente em Como Encomendar e Contato.

**Baixo impacto**

9. Documentar uma escala de espaçamento entre seções em
   `docs/design/design-tokens.md` (item 6), para parar de depender de
   copiar o padrão de um arquivo para o outro.
10. Avaliar um breakpoint intermediário para tablets em retrato (item 7).

## Limitações e restrições confirmadas para as próximas etapas

- Paleta de cores atual (sálvia/creme/tinta, `docs/design/design-tokens.md`)
  deve ser preservada como base.
- Stack atual (Next.js/React/TypeScript/Tailwind) deve ser preservada.
- As 12 fotos do portfólio são baixa resolução (~231×325px) — restrição
  real para qualquer direção que dependa de fotografia grande (item 3.3).
- Nenhum produto, preço, sabor ou dado comercial foi inventado nesta
  auditoria — todos os números citados vêm de `content/cardapio.json`.
- Testes E2E e unitários existentes não foram alterados nesta etapa;
  mudanças estruturais nas próximas etapas (especialmente qualquer
  mudança em `lib/nav.ts` ou nas páginas) vão exigir atualização de
  `e2e/navigation.spec.ts` e `e2e/motion.spec.ts`.
