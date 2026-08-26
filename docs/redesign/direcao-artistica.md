# Direção Artística — Fase 9, Etapa 2

Define e justifica as escolhas visuais do redesign de marca, a partir dos
achados de [`auditoria.md`](auditoria.md) (Etapa 1). **Documentação
apenas — nenhum código de produção muda nesta etapa.** A implementação
fica para a Etapa 4, depois da Etapa 3 (arquitetura de informação).

Objetivo de sensação: **artesanal + apetitoso + contemporâneo +
divertido + premium + acolhedor** — evitando o clichê visual de
confeitaria (rosa + cursiva + corações + decoração em excesso).
Referências de princípio, não de cópia literal: a lógica de catálogo
limpo e escaneável da Krispy Kreme, e a personalidade tipográfica forte
da Graza.

## 1. Tipografia

### 1.1 Fonte display — mantém Fraunces

A Fase 2 já escolheu [Fraunces](https://fonts.google.com/specimen/Fraunces)
para títulos, e a recomendação desta etapa é **manter**, não trocar.
Comparando com as demais opções avaliadas:

- **Playfair Display** e **DM Serif Display** têm traços de alto
  contraste que puxam para "editorial de luxo/convite de casamento" —
  formal e frio demais para "divertido + acolhedor", e os traços finos
  (hairlines) sofrem em fotos de baixo contraste/resolução moderada como
  as do portfólio.
- **Instrument Serif** é elegante, mas extremamente fino — arriscado em
  telas pequenas e para carregar peso visual quando as fotos do
  portfólio (~230×325px) já são o elemento mais frágil da página; o
  título precisa "segurar" a composição, não competir em fragilidade.
- **Fredoka** tem terminações arredondadas de bolha, exatamente a
  estética "app infantil" que a marca deve evitar segundo as restrições
  desta fase.
- **Bricolage Grotesque** é um sans, não um substituto direto de fonte
  display serifada (ver 1.2 — é a escolha para o papel funcional).

Fraunces já entrega o que as alternativas não entregam juntas: é
serifada (âncora no "artesanal"), tem ink traps e a variação "wonk" que
dão personalidade sem virar caricatura (âncora no "divertido" e
"contemporâneo" — é hoje uma escolha muito usada por marcas de comida
DTC exatamente por equilibrar esses dois lados), e mantém peso e
legibilidade suficientes mesmo em pesos 600–700 sobre fundos
diversos. Trocar de fonte display também jogaria fora a marca visual já
construída (o wordmark "Sasah Cakes" do header já está em Fraunces desde
a Fase 3). **Ajuste de uso, não de fonte:** reservar Fraunces para
momentos de destaque real (H1–H3, hero, preço em produto — ver 1.3), em
vez de aplicá-la em todo nível de heading como hoje.

### 1.2 Fonte funcional — Bricolage Grotesque, substituindo o papel funcional da Lora

A Lora hoje faz dois papéis ao mesmo tempo: corpo de texto longo (a frase
do hero, a legenda da Galeria) **e** texto de interface (links do menu,
todos os botões, badges, legendas de preço/rendimento). Serifada é uma
boa escolha para o primeiro papel, mas não para o segundo — texto de UI
em tamanho pequeno (nav, botão, badge) escaneia melhor em uma sans, e é
literalmente o papel que a marca precisa para "contemporâneo": hoje o
site inteiro é serifado, o que lê mais como "cottagecore clássico" (o
tom que a Fase 2 mirava) do que "contemporâneo + premium" (o tom desta
fase).

Escolha: **[Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque)**,
substituindo a Lora por completo (não soma uma terceira família — troca
uma por outra, mantendo o site em duas fontes carregadas, sem custo
adicional de performance). Por quê essa e não outra sans:

- É uma grotesca com detalhes orgânicos e levemente artesanais nos
  terminais — dialoga com o "wonk" da Fraunces em vez de parecer uma
  sans neutra de produto de software (tipo Inter/Helvetica), o que
  manteria o "artesanal" mesmo nos elementos funcionais.
- Tem peso e presença suficientes para funcionar tanto em texto corrido
  (parágrafos, legendas) quanto em UI (botões, nav, badges) — não é uma
  fonte "fina demais" como a Instrument Serif seria se fosse usada aqui.
- É variável (múltiplos pesos numa única família), o que cobre toda a
  escala funcional (400 a 700) sem precisar carregar arquivos extras.

Fredoka foi considerada e descartada aqui pelo mesmo motivo do item 1.1
— rounded/bolha demais, risco de "infantil".

### 1.3 Hierarquia tipográfica completa

| Nível                           | Fonte               | Peso | Desktop | Mobile | Line-height | Observação                                                                                       |
| ------------------------------- | ------------------- | ---- | ------- | ------ | ----------- | ------------------------------------------------------------------------------------------------ |
| H1                              | Fraunces            | 700  | 56px    | 36px   | 1.1         | Mantido igual à Fase 2                                                                           |
| H2                              | Fraunces            | 700  | 40px    | 28px   | 1.15        | Mantido                                                                                          |
| H3                              | Fraunces            | 600  | 28px    | 22px   | 1.2         | Mantido                                                                                          |
| H4                              | Bricolage Grotesque | 600  | 22px    | 19px   | 1.25        | **Muda de Fraunces para a funcional** — nomes de card de produto ("15cm", "100 docinhos")        |
| H5                              | Bricolage Grotesque | 600  | 18px    | 17px   | 1.3         | Muda                                                                                             |
| H6                              | Bricolage Grotesque | 600  | 16px    | 15px   | 1.3         | Muda                                                                                             |
| Corpo                           | Bricolage Grotesque | 400  | 16px    | 16px   | 1.6         | Substitui a Lora                                                                                 |
| Legenda/caption                 | Bricolage Grotesque | 500  | 14px    | 13px   | 1.5         | Peso 500 (não 400) — em sans, texto pequeno em regular fica fraco demais para ler bem no celular |
| Nav / links de menu             | Bricolage Grotesque | 500  | 16px    | 16px   | —           | —                                                                                                |
| Botão (label)                   | Bricolage Grotesque | 600  | 15px    | 15px   | —           | Ver 3.1 para o detalhe de letter-spacing no CTA principal                                        |
| Badge                           | Bricolage Grotesque | 600  | 14px    | 14px   | —           | Mantém tamanho/peso da Fase 2, só muda a fonte                                                   |
| **Preço em destaque (exceção)** | **Fraunces**        | 600  | 22px    | 19px   | 1.25        | Fica em Fraunces mesmo tendo o tamanho de H4 — ver justificativa abaixo                          |

**Por que o preço é a exceção deliberada:** em todo o resto, H4–H6 vira
funcional porque o objetivo ali é escaneabilidade (lógica de catálogo,
referência Krispy Kreme — nome do produto, olhar e seguir). O preço é o
único número que vale a pena tratar como um momento de marca em vez de
dado de planilha: um algarismo em Fraunces (que tem numerais old-style
com bastante caráter) comunica "vale o investimento, feito à mão" —
reforça "apetitoso + premium" no exato ponto em que a pessoa está
decidindo se compra. É um detalhe pequeno, mas intencional.

## 2. Paleta e uso de cor

A paleta (`docs/design/design-tokens.md`) não muda de valores — o que
falta é uma regra de **distribuição**. Hoje sage-500 é usado quase
exclusivamente em botões/ícones, e o resto do site é branco/creme com
pouquíssimo contraste de bloco — o que deixa a marca "segura" demais
para o "divertido + premium" pretendido.

Regra proposta, sempre dentro da paleta existente:

- **~60% neutro** (`white`, `cream-300`) — fundo geral de página e de
  cards, mantendo a leveza "acolhedora" que já funciona.
- **~30% creme médio/sálvia clara** (`cream-500`, `sage-100`) — usado
  para **alternar fundo de seção em todas as páginas**, não só no hero
  da Home (ver seção 5). Hoje só a Home varia de fundo; as páginas
  internas são brancas do início ao fim.
- **~10% sálvia saturada** (`sage-500`, `sage-700`, `sage-900`) — CTAs,
  ícones, e **pelo menos um bloco de cor cheia por página** (ex: uma
  faixa `sage-900` com texto `cream-300`, não necessariamente um botão)
  para criar um momento de contraste forte e premium, em vez de sage
  aparecer só em detalhes pequenos. Isso é o que dá o "confidence" de
  marca que referências como a Graza têm — bloco de cor saturada, não só
  acento.

`ink-900`/`ink-600` continuam como estão (texto principal e secundário)
— já cumprem bem o papel de "não preto puro", mantendo o tom quente.

## 3. Estilo de componentes

### 3.1 Botão — um componente único, com identidade mais forte

A auditoria (item 4) já apontou que o botão-pill principal está
copiado em 6 lugares — a decisão de arquitetura de componentizá-lo fica
para a Etapa 4, mas a especificação visual final é definida aqui, para
que a implementação não precise voltar a decidir isso:

- **Primário**: mantém `radius-pill`, fundo `sage-500`, texto
  `cream-300`. Muda o label para Bricolage Grotesque 600, com
  `letter-spacing` levemente positivo (~0.01em) — um detalhe tipográfico
  simples que separa visualmente "isto é um botão de marca" de "isto é
  um link qualquer", sem precisar de caixa alta (caixa alta em todo CTA
  ficaria "corporativo" demais).
- **Secundário** (já especificado na Fase 2, nunca implementado):
  borda `1px solid sage-500`, fundo transparente, texto `sage-700`. A
  Etapa 4 deveria de fato passar a usá-lo — hoje todo CTA do site é o
  mesmo botão sólido verde repetido, o que reforça visualmente a
  sensação de redundância de CTA já criticada na auditoria (item 1). Ter
  dois pesos de botão disponíveis ajuda a diferenciar "ação principal da
  página" de "ação alternativa", mesmo mantendo os CTAs que a Etapa 3 (IA)
  decidir preservar.

### 3.2 Cards — menos dependência de sombra, mais de campo de cor + borda fina

Os cards atuais (`radius-lg`, `cream-300`, `shadow-sm` → `shadow-md`)
funcionam, mas a sombra como principal recurso de definição de bordas lê
"card de UI genérico" — não é exclusivo de confeitaria nem de marca
nenhuma. Ajuste:

- Repouso: sombra quase imperceptível (ou nenhuma) + uma borda fina de
  1px em `cream-700` (sobre fundo branco) ou `sage-100` (sobre fundo
  `cream-500`) para dar definição sem depender de sombra.
- `shadow-md` continua existindo, mas só como reforço no estado
  active/hover (que já é o comportamento documentado no style-guide) —
  o card "sobe" fisicamente ao ser tocado, em vez de já vir com sombra
  pesada em repouso.

Isso mantém o `radius-lg` e a paleta como estão, só muda onde o peso
visual é aplicado — menos genérico, mais editorial/premium.

### 3.3 Ícones e elementos gráficos — um único motivo, usado com extrema moderação

Nada de conjuntos de ícones (cupcake, coração, confete, emoji) — a marca
não precisa de iconografia decorativa espalhada pela página para parecer
uma confeitaria; os produtos e as fotos já fazem esse trabalho. Manter
exatamente **um** motivo gráfico, o que já existe embrionariamente no
hero da Home hoje (`app/page.tsx:33-40`, as manchas de aquarela
desfocadas): uma forma orgânica e abstrata (blob), nas cores da paleta,
com baixa opacidade e blur — nunca literal (não é uma forma de bolo, não
é uma gota de cobertura desenhada). Regra de moderação explícita: no
máximo 1–2 ocorrências por página, sempre atrás do conteúdo, nunca como
protagonista.

Se a Etapa 4 quiser experimentar uma segunda forma gráfica, o único
candidato que cabe no princípio "orgânico, não literal, extrema
moderação" seria uma única linha fina tipo "drip" (uma curva simples,
não uma gota de cobertura desenhada com rosto) usada no máximo uma vez
no site inteiro — ex: como um divisor sutil entre duas seções do hero.
Não é uma recomendação obrigatória, é o teto do que se permite nessa
direção, para não abrir margem para "excesso de decoração" voltar pela
porta dos fundos.

### 3.4 Tratamento de fotografia — a resolução baixa vira parte do enquadramento, não um defeito escondido

As fotos do portfólio (~230×325px, recorte de carrossel do Instagram)
não vão melhorar de resolução nesta fase — a direção artística precisa
assumir esse limite em vez de tentar mascará-lo:

- **Nunca** usar uma foto do portfólio como elemento hero em tamanho
  grande/full-bleed — isso evidenciaria a baixa resolução exatamente no
  lugar de maior destaque da página. As fotos continuam em cards
  pequenos/médios (como já é hoje), nunca ampliadas além do necessário.
- Aplicar uma moldura consistente ao card de foto — fundo `cream-300` ou
  `sage-100` como "passe-partout" (uma margem interna sólida ao redor da
  foto, tipo moldura de Polaroid) em vez de a foto ocupar 100% do card.
  Isso muda a leitura de "foto de baixa qualidade cortada de rede
  social" para "peça curada, apresentada com intenção" — o mesmo recurso
  visual (moldura) resolve o problema de percepção sem precisar mexer no
  arquivo de imagem.
- Manter o crop de proporção fixa (3:4, já usado hoje) — proporção
  retrato consistente em toda a grade é o que faz a galeria parecer
  organizada mesmo com fotos de fontes/qualidades ligeiramente
  diferentes entre si.

## 4. Espaçamento

A escala de valores (`4, 8, 12, 16, 24, 32, 48, 64, 96` px) já definida
na Fase 2 não muda. O que a auditoria mostrou faltar (item 6) é uma
**regra de aplicação** explícita, para parar de depender de copiar o
padrão de um arquivo pro outro:

- **Entre o H1 de uma página e o primeiro bloco de conteúdo:** sempre
  40px (`mt-10`).
- **Entre blocos de conteúdo seguintes, dentro da mesma página:** sempre
  56px (`mt-14`) — e nunca um valor menor que o anterior. É a regra que
  a página Contato quebrava (auditoria, item 6): o espaçamento deve
  manter ou crescer ao descer a página, nunca diminuir.
- **Padding externo de página (topo/base de `<main>`):** 64px mobile /
  96px desktop (`py-16`/`md:py-24`) em todas as páginas internas — igual
  ao que já existe hoje. O hero da Home é a única exceção documentada
  (`py-24`/`md:py-32`), por ser a única seção do site com esse papel.
- **Padding interno de card:** 24px (`p-6`), como já especificado.

## 5. Consistência entre páginas — fechando o "degradê de capricho"

A auditoria (itens 3.1 e 3.2) apontou que só a Home tem copy de marca e
animação de entrada. Regra para a Etapa 4 aplicar em **todas** as seis
páginas, não só a Home:

1. **Frase de abertura sob o H1.** Toda página ganha 1 frase curta (não
   um parágrafo) com voz de marca logo abaixo do título — no mesmo
   espírito da frase que a Galeria já tem hoje
   (`cardapio.portfolio.status`). A frase descreve o propósito da
   página; não introduz nenhum dado comercial que não exista em
   `content/cardapio.json` (nada de números inventados, quantidade de
   clientes, prêmios etc. — só tom de voz).
2. **Animação de entrada ao rolar.** O mecanismo já existente
   (`RevealOnScroll`, CSS + IntersectionObserver — ver
   `docs/design/motion-principles.md`) passa a envolver as seções de
   **todas** as páginas, com os mesmos parâmetros já definidos (fade +
   8–16px de slide, respeitando `prefers-reduced-motion`). Não é uma
   mudança de princípio de motion, só de escopo de aplicação — a Etapa 2
   não precisa (nem deve) alterar `motion-principles.md`.
3. **Alternância de fundo de seção.** Como na seção 2, páginas internas
   passam a variar entre fundo branco e `cream-500` por seção, em vez de
   serem brancas do topo ao rodapé — dá às páginas internas parte do
   mesmo ritmo visual que a Home já tem entre hero e resto da página.

Essas três regras, aplicadas de forma idêntica nas seis páginas, são o
que fecha o "degradê de capricho": a Home para de ser a única página
"acabada" e vira o topo de um padrão que todas seguem.

## Resumo das decisões

| Área            | Decisão                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Fonte display   | Mantém Fraunces — reservada para H1–H3, hero, e preço em destaque (exceção deliberada)                 |
| Fonte funcional | Troca Lora por Bricolage Grotesque — corpo, H4–H6, nav, botões, badges, legendas                       |
| Paleta          | Mesmos tokens; nova regra de distribuição (~60/30/10) para dar mais contraste de bloco                 |
| Botão           | Componente único (implementação na Etapa 4); primário com letter-spacing; secundário passa a ser usado |
| Cards           | Menos sombra em repouso, mais borda fina de 1px                                                        |
| Ícones/gráficos | Um único motivo orgânico (blob), extrema moderação — nada de cupcake/coração/confete/emoji             |
| Fotografia      | Moldura tipo passe-partout nos cards; nunca ampliada além do necessário                                |
| Espaçamento     | Regras explícitas de `mt-10`/`mt-14` (nunca decrescente) e `py-16`/`md:py-24`                          |
| Consistência    | Frase de abertura + `RevealOnScroll` + alternância de fundo em **todas** as páginas, não só a Home     |
