# Mascote e Tipografia — Fase 10

Documenta as decisões da Fase 10: um mascote ilustrado (fatia de bolo
antropomorfizada, estilo retrô "rubber hose", num selo circular vintage)
e uma tipografia display com mais personalidade de confeitaria. Não
reabre a paleta sálvia/creme definida em
[`../design/design-tokens.md`](../design/design-tokens.md) — só adiciona
o rosa do mascote como acento pontual, já presente na ilustração
original, sem expandir seu uso a outros elementos do site.

Este arquivo é escrito incrementalmente ao longo dos PRs desta fase —
cada seção abaixo é adicionada/expandida conforme a entrega
correspondente é mergeada.

## 1. Tipografia — Titan One substitui a Fraunces

A Fraunces (fonte display da Fase 2/9, ver
[`direcao-artistica.md`](direcao-artistica.md) "1.1") é elegante e
serifada — combinava com uma direção "cottagecore" mais sóbria, mas
destoa do personagem retrô/cartoon do mascote. A Fase 10 troca a fonte
display por [Titan One](https://fonts.google.com/specimen/Titan+One)
(Google Fonts): uma display bold, arredondada, só maiúsculas, com a
mesma "massa" visual dos rótulos de embalagem e quadrinhos vintage do
estilo "rubber hose" do personagem.

- **Onde entra:** H1–H4 (`app/globals.css`), o texto do selo do mascote
  (`public/brand/mascote-selo.png`, já embutido na imagem, não é texto
  HTML). H4 é o nome de produto em `components/ProductCard.tsx` — volta
  a usar a fonte display nesta fase (na Fase 9 tinha migrado para a
  fonte funcional, lógica "catálogo escaneável"); o selo do mascote pede
  mais personalidade de marca no nome do produto do que aquela leitura
  neutra.
- **Onde NÃO entra:** corpo de texto, nav, botões, badges, H5–H6 —
  continuam em Bricolage Grotesque (fonte funcional da Fase 9,
  inalterada).
- **Peso único:** Titan One só existe em peso 400 no Google Fonts (é uma
  fonte "black"/bold por desenho). Todo heading que usava `font-bold`
  (700) ou `font-semibold`/`font-medium` (600/500) em cima da fonte
  display passa a usar `font-normal` explicitamente — pedir um peso que
  a fonte não tem forçaria negrito sintético do navegador, distorcendo o
  traço da letra.
- **Maiúsculas:** Titan One já é visualmente "caixa alta" por desenho de
  glifo (não tem uma forma minúscula distinta da maiúscula) — nenhum
  `text-transform: uppercase` foi adicionado, o texto continua digitado
  normalmente no HTML (importante para SEO/leitura por leitor de tela).

## 2. Mascote e selo

O mascote é uma fatia de bolo antropomorfizada (olhos, braços, mãos com
luva, acenando/segurando um batedor de arame), desenhada no estilo
"rubber hose" — traço grosso preto/sálvia, cores chapadas, sem
gradientes — a mesma linguagem visual de personagens de desenho animado
retrô dos anos 1930. O rosa (cobertura/calda derretendo no topo,
~`#D55E78` — medido diretamente do PNG) é o único uso desse tom no site
inteiro — não é um token de paleta novo (não existe em
`design-tokens.md`), é um acento pontual já embutido na ilustração, e
não é reaproveitado em nenhum outro lugar da UI.

Três arquivos, três recortes do mesmo personagem, um propósito cada:

| Arquivo                                  | Conteúdo                                                                                                                                                        | Uso                                                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `public/brand/mascote-selo.png`          | Selo circular completo, com o texto "SASAH CAKES" e "FEITO A MÃO COM CARINHO" em arco, borda tracejada e anel sálvia — como um selo/carimbo vintage de padaria. | Logo do Header e do Footer (`components/Header.tsx`, `components/Footer.tsx`); fonte do `apple-icon.png`. |
| `public/brand/mascote-corpo-inteiro.png` | Personagem sozinho, corpo inteiro, sem o selo/texto ao redor.                                                                                                   | Hero da Home (Issue #102).                                                                                |
| `public/brand/favicon-source.png`        | Recorte fechado no busto/rosto do personagem, sem o selo.                                                                                                       | Fonte do `app/icon.png` (favicon).                                                                        |

### Logo (Header/Footer)

O wordmark de texto "Sasah Cakes" (`font-heading`, ver seção 1) foi
substituído pelo selo em ambos os lugares onde aparecia:

- **Header:** `mascote-selo.png` dentro do link para `/`, 48px
  (mobile) / 56px (desktop) — tamanho de "esta é a marca", sem competir
  com os 3 itens de navegação ao lado. `alt="Sasah Cakes"` funciona como
  nome acessível do link: os testes E2E que localizam o logo por
  `getByRole("link", { name: "Sasah Cakes" })` continuam passando sem
  alteração, porque o nome acessível de um link cujo único conteúdo é
  uma imagem vem do `alt` dela.
- **Footer:** mesmo selo, 80px, centralizado — funciona como um "carimbo"
  de fechamento da página. O nome da marca continua existindo como
  texto de verdade na linha de copyright logo abaixo (nenhuma
  informação passou a existir só dentro de uma imagem).

### Favicon e apple-touch-icon

Convenção de arquivo do Next.js App Router — nenhum código de
configuração explícito, os arquivos abaixo já viram os `<link>` de
`<head>` corretos automaticamente:

- **`app/icon.png`** (256×256, gerado a partir de
  `public/brand/favicon-source.png`) — favicon. O recorte fechado no
  rosto do personagem foi escolhido especificamente para isso: em 16–32px
  (tamanho real de exibição de um favicon), um selo inteiro com texto
  ficaria ilegível, mas o rosto/confete de cobertura ainda formam uma
  forma reconhecível.
- **`app/apple-icon.png`** (180×180, tamanho exato recomendado pela
  Apple, gerado a partir de `public/brand/mascote-selo.png`) — nesse
  tamanho maior, o selo completo com o texto ainda é legível.
- O `app/favicon.ico` anterior (o triângulo genérico do template inicial
  do Next.js/Vercel, nunca substituído por uma marca própria) foi
  removido — `app/icon.png` o substitui integralmente.

## 3. Hero da Home

`public/brand/mascote-corpo-inteiro.png` entra no hero da Home como o
único "momento" de marca do personagem fora do selo — não é repetido em
nenhuma outra página (Cardápio, Galeria, Como Encomendar continuam sem
o mascote solto, só o selo no Header/Footer).

- **Mobile (sem espaço lateral sobrando):** o texto do hero já ocupa a
  largura útil da tela centralizado — não há onde ancorar o personagem
  ao lado sem sobrepor o H1/parágrafo/botão. Ele entra em fluxo normal,
  centralizado, logo abaixo do botão "Ver Cardápio", num tamanho
  pequeno (160px).
- **A partir do `md` (768px):** o personagem sai do fluxo do texto e
  vira um elemento "flutuante" ancorado ao canto inferior direito da
  seção inteira — a mesma lógica das manchas de aquarela decorativas já
  existentes no hero, só que com o mascote em vez de uma mancha de cor.
  Cresce progressivamente (224px no `md`, 288px no `lg`) para
  acompanhar o espaço lateral que sobra ao redor do texto centralizado
  (`max-w-2xl`) em telas maiores.
- **Um único elemento** (`<Image>`) cobre os dois casos via classes
  responsivas do Tailwind (`relative` → `md:absolute`), evitando
  duplicar a mesma imagem em dois lugares do DOM.
- **`alt=""`:** decorativo — a ilustração não carrega nenhuma
  informação que o H1 e o parágrafo de apoio já não digam por texto.
- Testado em 390px, 768px, 1280px e 1920px — em nenhum caso o
  personagem sobrepõe o H1, o parágrafo ou o botão "Ver Cardápio".

## 4. Fotos placeholder (`public/produtos-ia/`)

_(preenchido no PR de fotos placeholder — Issue #103)_
