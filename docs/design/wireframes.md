# Wireframes — Sasah Cakes

Wireframes de baixa fidelidade para as páginas definidas em
[`docs/sitemap.md`](../sitemap.md). Foco em hierarquia de blocos, não
pixel-perfect. Projeto **mobile-first**: o público acessa majoritariamente
via link na bio do Instagram, pelo celular.

Convenção: cada wireframe é descrito primeiro na versão mobile (coluna
única, a base do design) e depois nas adaptações para desktop (≥768px).

Em todas as páginas, um **botão flutuante de WhatsApp** (`radius-pill`,
circular) fica fixo no canto inferior direito, sempre visível.

---

## Home

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │  header fixo, fundo branco
├─────────────────────────────┤
│ 🌿 mancha aquarela (fundo)  │
│                              │
│   Bolos e docinhos feitos   │  H1, fundo sage-500 ou cream-500
│   à mão, com carinho        │
│                              │
│   [ Ver Cardápio ]          │  botão primário, pill
├─────────────────────────────┤
│  Cardápio de Bolos    →     │  card 1 (link para /cardapio)
├─────────────────────────────┤
│  Docinhos              →    │  card 2 (link para /docinhos)
├─────────────────────────────┤
│  Como Encomendar       →    │  card 3 (link para /como-encomendar)
├─────────────────────────────┤
│  Nosso Trabalho              │  H2
│  [foto][foto][foto][foto] → │  scroll horizontal (preview galeria)
│  Ver galeria completa →     │
├─────────────────────────────┤
│  Contato · Redes sociais    │  rodapé
└─────────────────────────────┘
                          [💬]  ← WhatsApp flutuante
```

**Desktop (≥768px):** header com nav inline (Cardápio · Docinhos · Como
Encomendar · Galeria · Contato) substituindo o `☰`. Os 3 cards de destaque
(Cardápio/Docinhos/Como Encomendar) viram uma linha de 3 colunas. O preview
de galeria vira grid de 4 colunas em vez de scroll horizontal.

---

## Cardápio

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Cardápio                    │  H1
│  [Redondos] [Quadrados]      │  tabs/toggle
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 15cm · 12 fatias     │    │  card de produto
│  │ R$ 180,00            │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 20cm · 25 fatias     │    │
│  │ R$ 210,00            │    │
│  └─────────────────────┘    │
│  ... (demais tamanhos)      │
├─────────────────────────────┤
│  Recheios disponíveis        │  H2
│  (Amendoim)(Beijinho)(...)  │  badges pill, wrap
├─────────────────────────────┤
│  [ Quero Encomendar ]        │  CTA → /como-encomendar
├─────────────────────────────┤
│  rodapé                      │
└─────────────────────────────┘
                          [💬]
```

**Desktop:** cards de tamanho em grid 3 colunas por tab (Redondos /
Quadrados). Tabs podem virar duas seções lado a lado ou manter tabs no
topo, conforme espaço.

---

## Docinhos

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Docinhos                    │  H1
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 100 docinhos          │    │  card de pacote (destaque)
│  │ R$ 120,00             │    │
│  │ 2 sabores (50 + 50)   │    │
│  │  ou                   │    │
│  │ 4 sabores (25 cada)   │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Sabores disponíveis         │  H2
│  (Beijinho)(Brigadeiro)(...)│  badges pill, wrap
├─────────────────────────────┤
│  [ Quero Encomendar ]        │  CTA → /como-encomendar
├─────────────────────────────┤
│  rodapé                      │
└─────────────────────────────┘
                          [💬]
```

**Desktop:** card de pacote centralizado, largura máxima ~480px; badges de
sabores em grid/wrap mais largo abaixo.

---

## Como Encomendar

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Como Encomendar              │  H1
├─────────────────────────────┤
│  1  Escolha bolo/docinhos     │  passos numerados,
│  2  Chame no WhatsApp         │  empilhados
│  3  Pague 50% de sinal (Pix)  │
│  4  Retire no local            │
├─────────────────────────────┤
│  📞 Samirah Carvalho Paula    │  bloco de contato, destaque
│  (21) 98200-8885              │
│  [ Chamar no WhatsApp ]       │  botão primário
├─────────────────────────────┤
│  💳 Pagamento via Pix          │  bloco info
│  (chave = telefone acima)     │
│  ⏱ Antecedência mínima: 4 dias│
│  📍 Somente retirada no local  │
├─────────────────────────────┤
│  rodapé                        │
└─────────────────────────────┘
                          [💬]
```

**Desktop:** os 4 passos numerados podem virar uma linha horizontal de 4
colunas (estilo "timeline"); bloco de contato e bloco de pagamento lado a
lado em 2 colunas.

---

## Galeria

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Nosso Trabalho               │  H1
│  (fotos reais em breve)       │  nota, enquanto usa placeholders
├─────────────────────────────┤
│  [ foto placeholder 01 ]      │  1 coluna no mobile
│  (Bolo temático)               │  badge de categoria sobre a foto
├─────────────────────────────┤
│  [ foto placeholder 02 ]      │
│  (Bolo futebol)                │
├─────────────────────────────┤
│  [ foto placeholder 03 ]      │
│  (Bolo festa)                  │
├─────────────────────────────┤
│  [ foto placeholder 04 ]      │
│  (Bandeja de docinhos)         │
├─────────────────────────────┤
│  rodapé                        │
└─────────────────────────────┘
                          [💬]
```

**Desktop:** grid 3 colunas (estilo masonry/Pinterest opcional para
variar alturas de foto).

---

## Contato

```
┌─────────────────────────────┐
│ ☰   Sasah Cakes             │
├─────────────────────────────┤
│  Contato                      │  H1
├─────────────────────────────┤
│  📞 Samirah Carvalho Paula    │  destaque central
│  (21) 98200-8885              │
│  [ Chamar no WhatsApp ]       │  botão primário
├─────────────────────────────┤
│  💳 Pagamento via Pix          │  nota reforçando
│  📍 Retirada no local          │  (sem endereço público nesta fase)
├─────────────────────────────┤
│  rodapé · redes sociais        │
└─────────────────────────────┘
                          [💬]
```

**Desktop:** conteúdo centralizado em coluna única com largura máxima
(~560px) — página é intencionalmente simples, não precisa de grid.

---

## Comportamento responsivo — regras gerais

- **Breakpoint principal:** 768px (mobile → desktop). Um breakpoint
  intermediário opcional em 1024px para ajustar grids de 3→4 colunas.
- **Header:** menu hamburguer (`☰`) no mobile vira nav inline no desktop.
- **Grids de card:** 1 coluna no mobile → 2–3 colunas no desktop,
  conforme indicado em cada página acima.
- **Botão flutuante de WhatsApp:** sempre fixo no canto inferior direito,
  em todas as breakpoints.
- **Imagens:** carregam em proporção fixa (evitar layout shift), com
  placeholder de cor `sage-100` enquanto a imagem real não é fornecida.
