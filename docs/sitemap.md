# Sitemap — Sasah Cakes

Estrutura de páginas do site institucional. Definida originalmente na
Fase 1 (arquitetura de informação) e **revisada na Fase 9, Etapa 3**
(arquitetura do redesign de marca) — ver justificativa completa das
mudanças em [`docs/redesign/arquitetura.md`](redesign/arquitetura.md).
Docinhos e Contato deixaram de ser páginas próprias, absorvidos por
Cardápio e Como Encomendar respectivamente. O design visual está
especificado em [`docs/design/wireframes.md`](design/wireframes.md)
(Fase 2, estrutura original) e
[`docs/redesign/`](redesign/) (Fase 9, redesign).

## Páginas

- **Home**
  Apresentação da confeitaria, produtos em destaque (reais, extraídos de
  `content/cardapio.json`), amostra curada da galeria (4 fotos) e um CTA
  final de WhatsApp.

- **Cardápio** (inclui Docinhos como categoria)
  Três categorias endereçáveis por âncora: Bolos Redondos
  (`#bolos-redondos`), Bolos Quadrados (`#bolos-quadrados`) e Docinhos
  (`#docinhos`) — tamanhos/pacotes, rendimento e preços, mais recheios e
  sabores disponíveis. Fonte de dados: `content/cardapio.json` (`bolos`,
  `docinhos`).

- **Galeria**
  Portfólio completo (12 fotos) de bolos decorados e bandejas de
  docinhos, com filtro por categoria — mostra mais do que a amostra da
  Home. Fonte de dados: `content/cardapio.json` (`portfolio`); imagens em
  `public/portfolio/`.

- **Como Encomendar** (inclui Contato)
  Passo a passo para encomendar, contato (nome, telefone, CTA primário de
  WhatsApp), forma de pagamento (Pix), condição de retirada (sem
  entrega), prazo mínimo de antecedência e sinal exigido. Fonte de dados:
  `content/cardapio.json` (`comoEncomendar`).

## Redirects (Fase 9)

As rotas abaixo deixam de existir como páginas e passam a redirecionar
(301), preservando links já compartilhados/indexados:

```
/docinhos → /cardapio#docinhos
/contato  → /como-encomendar
```

## Hierarquia

```
Home
├── Cardápio
│   ├── #bolos-redondos
│   ├── #bolos-quadrados
│   └── #docinhos
├── Galeria
└── Como Encomendar
```

Navegação principal (header) com 3 itens: Cardápio, Como Encomendar,
Galeria — Home é acessada pelo logo, não é um item de nav. Nível único
(sem subpáginas HTML), como na estrutura original.
