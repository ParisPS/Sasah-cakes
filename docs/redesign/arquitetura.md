# Arquitetura da Nova Estrutura — Fase 9, Etapa 3

Fecha a estrutura de páginas, navegação e especificação de conteúdo do
redesign, a partir dos achados de [`auditoria.md`](auditoria.md) — Etapa
1 — e das decisões de [`direcao-artistica.md`](direcao-artistica.md) —
Etapa 2. **Documentação apenas — nenhum código de produção muda nesta
etapa.** A implementação fica para a Etapa 4.

## Resumo da mudança

|                                                      | Antes                                                           | Depois                                                |
| ---------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| Páginas                                              | 6 (Home, Cardápio, Docinhos, Como Encomendar, Galeria, Contato) | 4 (Home, Cardápio, Galeria, Como Encomendar)          |
| Itens de navegação                                   | 5                                                               | 3 (Cardápio, Como Encomendar, Galeria)                |
| CTAs de WhatsApp visíveis ao mesmo tempo (pior caso) | Até 3 (Como Encomendar, Contato)                                | No máximo 2 (botão flutuante + 1 contextual), nunca 3 |

## 1. Estrutura de páginas

### 1.1 Docinhos vira categoria do Cardápio (não é mais página própria)

**Decisão: consolidar.** A Auditoria (item 5.1) levantou os dois lados
sem fechar — fechando agora, a favor da consolidação pesam mais:

- O conteúdo de Docinhos é fino (um card de produto + uma lista de
  sabores — `app/docinhos/page.tsx:20-48`) — cabe como uma terceira
  categoria dentro do Cardápio, ao lado de "Bolos Redondos" e "Bolos
  Quadrados", sem sobrecarregar a página (ver 3.2).
- Remove diretamente um dos três cards de "Destaque" da Home apontados
  como redundantes com a navegação (auditoria, item 1.1).
- Reduz a navegação principal de 5 para 4 itens antes mesmo de tratar
  Contato (ver 1.2) — vai na direção do objetivo geral da fase de
  eliminar redundância.
- Resolve o contra-argumento levantado na Auditoria (perder uma URL
  própria e compartilhável) sem abrir mão da consolidação: a categoria
  Docinhos dentro do Cardápio fica em uma seção endereçável por âncora
  (`/cardapio#docinhos`), então continua existindo um link direto e
  compartilhável para quem quiser mandar especificamente a seção de
  docinhos — só deixa de ser uma página HTML separada.

**Impacto de SEO:** a rota `/docinhos` deixa de existir. Como pode haver
links salvos (bio do Instagram, conversas antigas de WhatsApp, o próprio
Google já pode ter indexado a URL), a Etapa 4 implementa um **redirect
301** de `/docinhos` para `/cardapio#docinhos`, preservando quem chegar
pelo link antigo.

### 1.2 Contato é absorvido por Como Encomendar (não é mais página própria)

**Decisão: consolidar**, confirmando o achado secundário da Auditoria
(item 5.2). A página Contato hoje é nome, telefone e botão de WhatsApp,
mais uma frase resumida sobre pagamento/entrega — um subconjunto quase
literal do que Como Encomendar já mostra de forma mais completa
(pagamento, sinal, antecedência **e** entrega —
`app/como-encomendar/page.tsx:53-76`), mais um terceiro lugar (o rodapé,
presente em toda página) repetindo os mesmos três dados de contato de
novo. Não há conteúdo em Contato que justifique uma página à parte.

O conteúdo de Contato passa a viver como a seção de contato de Como
Encomendar (que, na prática, já era uma seção dela — ver especificação
em 3.4). O nome da página/rota continua "Como Encomendar" — é o destino
para onde toda a jornada de compra já converge (auditoria, item 1.3), e
manter o nome evita qualquer instabilidade adicional de SEO/link além da
já necessária pela remoção da rota.

**Impacto de SEO:** a rota `/contato` deixa de existir. Redirect **301**
de `/contato` para `/como-encomendar` na Etapa 4.

### 1.3 Estrutura final

```
Home              /
Cardápio          /cardapio
  ├─ Bolos Redondos   /cardapio#bolos-redondos
  ├─ Bolos Quadrados  /cardapio#bolos-quadrados
  └─ Docinhos         /cardapio#docinhos
Galeria           /galeria
Como Encomendar   /como-encomendar   (inclui a seção de contato)

Redirects 301:
  /docinhos → /cardapio#docinhos
  /contato  → /como-encomendar
```

Nenhuma outra página é removida. Home, Cardápio e Galeria continuam
justificadas como páginas próprias: Home é a porta de entrada de marca,
Cardápio e Galeria têm conteúdo genuinamente extenso e navegável por si
(catálogo completo; e, com a mudança da seção 3.3, a Galeria passa a
mostrar mais do que a Home, o que hoje não acontecia).

## 2. Navegação

### 2.1 Header

Três links, nesta ordem: **Cardápio · Como Encomendar · Galeria**. Sem
CTA extra fixo no header (ex: um botão "Encomendar" ao lado dos links) —
deliberadamente descartado: o botão flutuante de WhatsApp já cumpre o
papel de "ação sempre disponível"; duplicar isso como um segundo elemento
fixo no header recriaria exatamente o problema de CTAs concorrentes que
a Auditoria criticou (item 1.2), só que movido para o header em vez do
corpo da página.

Reduzir de 5 para 3 itens também é uma vitória direta de hierarquia: no
desktop, o nav fica mais espaçado e legível; a decisão de "Como
Encomendar" ficar entre Cardápio e Galeria (não por último) reflete que,
depois de ver o cardápio, "como encomendar" é o próximo passo natural
antes de simplesmente navegar para a galeria.

### 2.2 Mobile — o menu ☰ existente se encaixa sem ajuste

O mecanismo de abrir/fechar do menu mobile (`components/Header.tsx`, o
truque de CSS grid `0fr`→`1fr` documentado em
`docs/design/motion-principles.md`) não depende da quantidade de itens —
ele anima para a altura de conteúdo automática, qualquer que seja. Cair
de 5 para 3 links só resulta num painel mais baixo; nenhuma mudança de
mecanismo é necessária na Etapa 4, só a lista `NAV_LINKS`
(`lib/nav.ts`) fica mais curta.

## 3. Especificação por página

Todas as páginas abaixo recebem os três elementos de consistência
definidos na Direção Artística (Etapa 2, seção 5): frase de abertura com
voz de marca sob o H1, animação de entrada ao rolar (`RevealOnScroll`) em
cada seção, e alternância de fundo branco/`cream-500` entre seções.
Essas três coisas não são repetidas em cada especificação abaixo para não
poluir o texto — valem para as quatro páginas.

### 3.1 Home

- **Hero:** mantém a estrutura atual (H1 de marca + frase de apoio),
  com as manchas de aquarela (o único motivo gráfico definido na Etapa
  2). CTA do hero é **secundário** ("Ver Cardápio" → `/cardapio`) — não
  é a ação de conversão final, é navegação para explorar o catálogo.
- **Produtos em destaque (substitui os 3 cards de "Destaque" atuais):**
  em vez de cards que só espelham a navegação (auditoria, item 1.1), uma
  seção curta com **produtos reais** de `content/cardapio.json`: um bolo
  redondo, um bolo quadrado (ambos no tamanho intermediário de cada
  lista — critério objetivo para escolher qual tamanho mostrar sem
  favorecer arbitrariamente o mais caro ou o mais barato) e o pacote de
  docinhos (único SKU existente). Cada card mostra preço em Fraunces
  (Etapa 2, seção 1.3). Um único CTA **secundário** abaixo da seção,
  "Ver cardápio completo" → `/cardapio`, em vez de um link por card.
- **Amostra da galeria:** **4 fotos** (não as 12 atuais — corrige a
  divergência do wireframe original apontada na auditoria, item 2), a
  mesma contagem do wireframe da Fase 2 original
  (`docs/design/wireframes.md:36`, `[foto][foto][foto][foto] →`). Regra
  de seleção: cobrir as três categorias existentes (pelo menos 1 bolo
  redondo, 1 bolo quadrado, 1 docinho), completando a quarta pela ordem
  em que aparecem em `content/cardapio.json` — evita repetir a mesma
  categoria 4 vezes e não exige curadoria manual/subjetiva de qual foto
  é "a melhor". CTA **secundário**: "Ver galeria completa" → `/galeria`
  — agora uma promessa verdadeira, já que a Galeria mostra as 12 fotos
  com filtro por categoria (ver 3.3), não uma repetição do que a Home já
  mostrou.
- **CTA final (novo):** uma seção de fechamento com um único CTA
  **primário**, forte, levando direto ao WhatsApp (link `wa.me`, mesma
  função de `lib/cardapio.ts:linkWhatsApp`) — a única ação de conversão
  da Home, no final da página. É o único lugar da Home, fora do botão
  flutuante, onde WhatsApp aparece (ver seção 4).

### 3.2 Cardápio

- Barra de categorias no topo — **Bolos Redondos | Bolos Quadrados |
  Docinhos** — como chips/pills (mesmo estilo visual do componente
  `Badge`, mas clicáveis, funcionando como âncora para a seção
  correspondente), com scroll horizontal no mobile e todas visíveis lado
  a lado no desktop.
- Três seções, na mesma ordem da barra: Bolos Redondos, Bolos Quadrados,
  Docinhos — cada uma com a grade de `ProductCard` já existente hoje
  (nome/tamanho, rendimento, preço).
- "Recheios disponíveis" aparece uma vez, depois das duas seções de
  bolo (o campo `recheiosDisponiveis` é compartilhado entre Redondos e
  Quadrados em `content/cardapio.json` — não precisa duplicar a lista de
  badges em cada seção). "Sabores disponíveis" aparece dentro da seção
  Docinhos, já que é um campo próprio dela no JSON.
- CTA de fundo de página continua **secundário**: "Quero Encomendar" →
  `/como-encomendar`. Não vira WhatsApp direto — o floating button já
  cobre "quero falar agora"; este CTA cobre "quero ver como funciona o
  processo", que é o papel de Como Encomendar.

### 3.3 Galeria

Precisa mostrar mais do que a amostra da Home para justificar a própria
existência (ver 1.3) — duas mudanças concretas em relação a hoje:

- **Filtro por categoria** no topo (Todos | Bolos Redondos | Bolos
  Quadrados | Docinhos), usando o mesmo dado de categoria que já existe
  em `content/cardapio.json` (`portfolio.itens[].categoria`) — hoje esse
  dado só aparece como badge repetido em cada foto; passa a ser também
  um filtro funcional, o que é a real diferença de valor entre "ver a
  galeria completa" e "ver a amostra da Home".
- **Grid editorial, não uniforme:** todas as 12 fotos, mantendo o crop
  fixo em proporção 3:4 (decisão da Etapa 2, seção 3.4 — não muda aqui;
  o pedido original desta etapa sugeria "proporções variadas", mas isso
  contradiria a decisão já tomada de manter proporção fixa para dar
  organização a fotos de fontes/qualidade heterogêneas — a resolução é
  variar o **tamanho de exibição** de alguns itens na grade, ex: 1–2
  fotos ocupando duas colunas em vez de uma, sem variar o crop
  individual de cada foto).
- **Sem badge de categoria repetido em cada card** (removido — a
  categoria agora se comunica pelo filtro ativo, não por 12 badges
  idênticos espalhados pela grade).
- **Sem lightbox.** Ampliar qualquer uma das 12 fotos além do tamanho de
  card contraria diretamente a decisão da Etapa 2 (seção 3.4: "nunca
  ampliar foto do portfólio além do necessário") — as fotos são recortes
  de ~230×325px, e um lightbox full-screen deixaria essa limitação
  evidente exatamente no momento de maior atenção do usuário. Clicar em
  uma foto não faz nada além do que já faz hoje.

### 3.4 Como Encomendar (inclui Contato)

- Mantém os 4 passos numerados já existentes
  (`app/como-encomendar/page.tsx:8-13`).
- Seção de contato: nome, telefone, e **um único CTA primário** —
  "Chamar no WhatsApp". Esta é a única página do site (fora a Home) com
  um CTA primário de WhatsApp no corpo do conteúdo.
- Seção de pagamento/retirada: mantém os 4 itens já existentes
  (pagamento, sinal, antecedência mínima, entrega) — este é o texto que
  hoje só existe aqui; a versão resumida que existia em Contato deixa de
  existir separadamente (era redundante, não complementar).
- Nenhum outro CTA de WhatsApp nesta página além do primário da seção de
  contato — o rodapé desta página especificamente **não repete** o link
  de WhatsApp (ver seção 4).

### 3.5 Rodapé

Regra geral: nome da marca + copyright em todas as páginas. O link de
WhatsApp/telefone do rodapé é **condicional**, não fixo:

- Aparece em Home, Cardápio e Galeria — páginas onde nenhum outro
  elemento imediatamente acima já mostrou esse mesmo link.
- **Não aparece** em Como Encomendar — a página já termina com o mesmo
  contato em destaque primário a poucos parágrafos de distância; repetir
  no rodapé é exatamente a duplicação apontada na Auditoria (item 1.4).

## 4. Estratégia de WhatsApp

O botão flutuante (`components/WhatsAppButton.tsx`) é chrome global — não
entra nesta contagem, está sempre presente independente de página. A
tabela abaixo é sobre os elementos de **conteúdo** de cada página:

| Página          | CTA de conteúdo                         | Tipo                        | Rodapé mostra WhatsApp? | Total de elementos "WhatsApp" na tela ao chegar ao fim da página                                                                                         |
| --------------- | --------------------------------------- | --------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home            | "Falar no WhatsApp" (seção final)       | Primário                    | Sim                     | 2 (CTA final + rodapé, um após o outro — aceitável porque é a única ocorrência de WhatsApp na página inteira até esse ponto, não uma terceira repetição) |
| Cardápio        | "Quero Encomendar" → `/como-encomendar` | Secundário (não é WhatsApp) | Sim                     | 1 (só o rodapé)                                                                                                                                          |
| Galeria         | Nenhum                                  | —                           | Sim                     | 1 (só o rodapé)                                                                                                                                          |
| Como Encomendar | "Chamar no WhatsApp" (seção de contato) | Primário                    | **Não**                 | 1 (só o CTA da própria página)                                                                                                                           |

Em nenhuma página o número de elementos de WhatsApp passa de 2 (excluindo
o botão flutuante), contra até 3 hoje em Como Encomendar e Contato. A
única página com 2 é a Home, e ali os dois (CTA final + rodapé) nunca
competem entre si porque é a única menção a WhatsApp na página até
aquele ponto — não uma repetição do que já apareceu antes.

## Atualização de `docs/sitemap.md`

O arquivo foi atualizado para refletir esta estrutura (4 páginas, 3 delas
com Docinhos e Contato absorvidos) — ver o arquivo para o detalhe
completo.
