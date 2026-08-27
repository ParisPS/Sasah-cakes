# Wireframes — Sasah Cakes

Wireframes de baixa fidelidade para as páginas definidas em
[`docs/sitemap.md`](../sitemap.md). Foco em hierarquia de blocos, não
pixel-perfect. Projeto **mobile-first**: o público acessa majoritariamente
via link na bio do Instagram, pelo celular.

Convenção: cada wireframe é descrito primeiro na versão mobile (coluna
única, a base do design) e depois nas adaptações para desktop (≥768px).

Em todas as páginas, um **botão flutuante de WhatsApp** (`radius-pill`,
circular) fica fixo no canto inferior direito, sempre visível.

**Atualizado na Fase 9 (redesign de marca), Etapa 5:** os diagramas
abaixo refletem a estrutura de 4 páginas do redesign (Docinhos virou
seção do Cardápio, Contato foi absorvido por Como Encomendar — ver
justificativa completa em
[`../redesign/arquitetura.md`](../redesign/arquitetura.md) e a estrutura
final em [`../sitemap.md`](../sitemap.md)). As páginas Docinhos e Contato
da versão original (Fase 2) foram removidas deste documento — seu
conteúdo aparece integrado nos wireframes de Cardápio e Como Encomendar,
respectivamente.

---

## Home

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │  header fixo, fundo branco
├─────────────────────────────┤
│ 🌿 mancha aquarela (fundo)  │
│                              │  fundo cream-500
│   Bolos e docinhos feitos   │  H1 + frase de apoio
│   à mão, com carinho        │
│                              │
│   [ Ver Cardápio ]          │  botão SECUNDÁRIO (navegação, não é a
├─────────────────────────────┤  conversão final da página)
│  Um gostinho do nosso        │  H2, fundo branco
│  cardápio                    │
│  [produto][produto][produto]│  3 produtos REAIS de cardapio.json (não
│  R$ · R$ · R$                │  cards que só espelham a navegação)
│  [ Ver cardápio completo ]   │  botão secundário
├─────────────────────────────┤
│  Nosso Trabalho              │  H2, fundo cream-500
│  [foto][foto][foto][foto] → │  scroll horizontal — amostra curada
│  Ver galeria completa →     │  (4 fotos, não as 12 do portfólio)
├─────────────────────────────┤
│  Vamos combinar sua          │  H2, fundo sage-900 (cor cheia)
│  encomenda?                  │  único CTA de conversão da Home
│  [ Falar no WhatsApp ]       │  botão primário → wa.me
├─────────────────────────────┤
│  rodapé                      │
└─────────────────────────────┘
                          [💬]  ← WhatsApp flutuante (chrome global)
```

**Desktop (≥768px):** header com nav inline (Cardápio · Como Encomendar ·
Galeria — 3 itens, não 5) substituindo o `☰`. Os 3 produtos em destaque
viram uma linha de 3 colunas. O preview de galeria vira grid de 4 colunas
em vez de scroll horizontal. Ver especificação completa em
[`../redesign/arquitetura.md`](../redesign/arquitetura.md#31-home).

---

## Cardápio (inclui Docinhos como categoria — Fase 9)

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Cardápio                    │  H1 + frase de apoio
│  [Redondos][Quadrados][Doc.] │  barra de âncoras (pills, não tabs —
├─────────────────────────────┤  rola até a seção, não troca conteúdo)
│  Bolos Redondos               │  H2, #bolos-redondos
│  ┌─────────────────────┐    │
│  │ 15cm · 12 fatias     │    │  card de produto
│  │ R$ 180,00            │    │
│  └─────────────────────┘    │
│  ... (demais tamanhos)      │
├─────────────────────────────┤
│  Bolos Quadrados              │  H2, #bolos-quadrados, fundo cream-500
│  ... (mesma estrutura)       │
├─────────────────────────────┤
│  Recheios disponíveis        │  H2 — compartilhado entre Redondos e
│  (Amendoim)(Beijinho)(...)  │  Quadrados, aparece uma vez só
├─────────────────────────────┤
│  Docinhos                     │  H2, #docinhos, fundo cream-500
│  ┌─────────────────────┐    │
│  │ 100 docinhos          │    │  card de pacote (mesmo ProductCard)
│  │ R$ 120,00             │    │
│  │ 2 sabores (50 + 50)   │    │
│  │  ou 4 sabores (25 ea) │    │
│  └─────────────────────┘    │
│  Sabores disponíveis         │
│  (Beijinho)(Brigadeiro)(...)│  badges pill, wrap
├─────────────────────────────┤
│  [ Quero Encomendar ]        │  CTA secundário → /como-encomendar
├─────────────────────────────┤
│  rodapé                      │
└─────────────────────────────┘
                          [💬]
```

**Desktop:** barra de categorias sem scroll (todas visíveis lado a lado);
cards de tamanho em grid 3 colunas por seção. Ver especificação completa
em [`../redesign/arquitetura.md`](../redesign/arquitetura.md#32-cardápio).

---

## Como Encomendar (inclui Contato — Fase 9)

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Como Encomendar              │  H1 + frase de apoio
├─────────────────────────────┤
│  1  Escolha bolo/docinhos     │  passos numerados,
│  2  Chame no WhatsApp         │  empilhados
│  3  Pague 50% de sinal (Pix)  │
│  4  Retire no local            │
├─────────────────────────────┤  bloco cream-500 a partir daqui
│  📞 Samirah Carvalho Paula    │  bloco de contato, destaque (era a
│  (21) 98200-8885              │  página /contato — absorvida aqui)
│  [ Chamar no WhatsApp ]       │  único CTA primário de WhatsApp no
├─────────────────────────────┤  corpo da página (rodapé não repete)
│  💳 Pagamento via Pix          │  bloco info
│  (chave = telefone acima)     │
│  ⏱ Antecedência mínima: 4 dias│
│  📍 Somente retirada no local  │
├─────────────────────────────┤
│  rodapé (sem link de WhatsApp) │  só aqui — evita repetir o contato
└─────────────────────────────┘  que a página já mostrou em destaque
                          [💬]
```

**Desktop:** os 4 passos numerados podem virar uma linha horizontal de 4
colunas (estilo "timeline"); bloco de contato e bloco de pagamento lado a
lado em 2 colunas. Ver especificação completa em
[`../redesign/arquitetura.md`](../redesign/arquitetura.md#34-como-encomendar-inclui-contato).

---

## Galeria

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Nosso Trabalho               │  H1
│  Fotos reais de trabalhos     │  status real (Fase 4), não mais nota
│  entregues.                    │  de placeholder
├─────────────────────────────┤
│ (Todos)(Redondos)(Quad.)(Doc)│  filtro por categoria (Fase 9) —
├─────────────────────────────┤  substitui o badge repetido em cada foto
│  [ foto real 01 ]             │  1 coluna no mobile, moldura
│  [ foto real 02 ]             │  passe-partout ao redor de cada foto,
│  [ foto real 03 ]             │  crop fixo 3:4 (nunca varia, mesmo no
│  ... (12 fotos, ou menos      │  grid editorial do desktop)
│      se um filtro < Todos)    │
├─────────────────────────────┤
│  rodapé                        │
└─────────────────────────────┘
                          [💬]
```

**Desktop:** grid 3 colunas, `grid-flow-dense` — 1-2 fotos ocupam 2
colunas (grid "editorial", só quando o filtro é "Todos") para variar o
tamanho de exibição sem variar a proporção do recorte. Sem lightbox
(decisão da Etapa 2, mantida na Etapa 3: as fotos são recortes de baixa
resolução, ampliar evidenciaria isso). Ver especificação completa em
[`../redesign/arquitetura.md`](../redesign/arquitetura.md#33-galeria).

---

## Comportamento responsivo — regras gerais

- **Breakpoint principal:** 768px (mobile → desktop). Um breakpoint
  intermediário opcional em 1024px para ajustar grids de 3→4 colunas.
- **Header:** menu hamburguer (`☰`) no mobile vira nav inline no desktop.
- **Grids de card:** 1 coluna no mobile → 2–3 colunas no desktop,
  conforme indicado em cada página acima.
- **Botão flutuante de WhatsApp:** sempre fixo no canto inferior direito,
  em todas as breakpoints.
- **Imagens:** carregam em proporção fixa (evitar layout shift), com um
  skeleton na paleta da marca (`sage-100`/`cream-500`) enquanto a foto
  real carrega (`components/PortfolioImage.tsx`, desde a Fase 7).
