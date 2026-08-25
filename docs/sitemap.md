# Sitemap — Sasah Cakes

Estrutura de páginas do site institucional, definida na Fase 1
(arquitetura de informação). O design visual de cada página está
especificado em [`docs/design/wireframes.md`](design/wireframes.md)
(Fase 2); implementação de UI fica para a Fase 3.

## Páginas

- **Home**
  Apresentação da confeitaria, chamadas para as demais seções (Cardápio,
  Docinhos, Galeria) e contato rápido para encomendas.

- **Cardápio**
  Bolos redondos e quadrados: tamanhos, rendimento (fatias) e preços.
  Lista de recheios disponíveis. Fonte de dados: `content/cardapio.json`
  (`bolos`).

- **Docinhos**
  Pacotes de 100 docinhos (2 ou 4 sabores) e lista de sabores disponíveis.
  Fonte de dados: `content/cardapio.json` (`docinhos`).

- **Como Encomendar**
  Contato para encomendas, forma de pagamento (Pix), condição de retirada
  (sem entrega), prazo mínimo de antecedência e sinal exigido. Fonte de
  dados: `content/cardapio.json` (`comoEncomendar`).

- **Galeria**
  Portfólio de bolos decorados (temáticos, futebol, festas) e bandejas de
  docinhos. Usa placeholders até que fotos reais sejam fornecidas. Fonte
  de dados: `content/cardapio.json` (`portfolio`).

- **Contato**
  Repete as informações de contato (nome e telefone) e reforça o canal de
  pagamento via Pix, para quem chega direto nesta página.

## Hierarquia

```
Home
├── Cardápio
├── Docinhos
├── Como Encomendar
├── Galeria
└── Contato
```

Navegação prevista como menu principal de nível único (sem subpáginas)
nesta fase.
