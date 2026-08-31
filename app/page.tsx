import Image from "next/image";
import { GallerySection } from "@/components/GallerySection";
import { PortfolioImage } from "@/components/PortfolioImage";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import {
  amostraCuradaPortfolio,
  cardapio,
  linkWhatsApp,
  primeiraFotoDaCategoria,
  tamanhoIntermediario,
} from "@/lib/cardapio";

// Produtos reais de content/cardapio.json — Fase 9 (redesign de marca):
// substitui os 3 cards "Destaque" que só espelhavam a navegação (achado
// da auditoria, item 1.1) por uma amostra de produto de verdade. Tamanho
// "do meio" de cada lista de bolo, critério objetivo (ver
// lib/cardapio.ts, tamanhoIntermediario) — não favorece arbitrariamente
// o mais caro nem o mais barato. A foto é a primeira do portfólio na
// categoria correspondente: ilustra a categoria, não afirma que aquele
// bolo específico é o tamanho/preço mostrado ao lado.
const boloRedondo = tamanhoIntermediario(cardapio.bolos.redondos);
const boloQuadrado = tamanhoIntermediario(cardapio.bolos.quadrados);
const fotoBoloRedondo = primeiraFotoDaCategoria(
  cardapio.portfolio.itens,
  "bolo-redondo",
);
const fotoBoloQuadrado = primeiraFotoDaCategoria(
  cardapio.portfolio.itens,
  "bolo-quadrado",
);
const fotoDocinho = primeiraFotoDaCategoria(
  cardapio.portfolio.itens,
  "docinho",
);

const PRODUTOS_DESTAQUE = [
  {
    foto: fotoBoloRedondo,
    title: boloRedondo.tamanho,
    subtitle: `Rende ${boloRedondo.rendimento}`,
    price: boloRedondo.preco,
  },
  {
    foto: fotoBoloQuadrado,
    title: boloQuadrado.tamanho,
    subtitle: `Rende ${boloQuadrado.rendimento}`,
    price: boloQuadrado.preco,
  },
  {
    foto: fotoDocinho,
    title: `${cardapio.docinhos.quantidade} docinhos`,
    subtitle: "Escolha entre 2 ou 4 sabores",
    price: cardapio.docinhos.preco,
  },
].filter(
  (
    produto,
  ): produto is typeof produto & { foto: NonNullable<typeof produto.foto> } =>
    produto.foto !== undefined,
);

// Amostra da galeria: 4 fotos, não as 12 (Etapa 3 — corrige a "prévia"
// que hoje mostra o portfólio inteiro, achado da auditoria, item 2).
// Exclui as fotos já usadas em PRODUTOS_DESTAQUE acima, pra não repetir
// a mesma imagem duas vezes na mesma página.
const arquivosUsadosNosDestaque = new Set(
  PRODUTOS_DESTAQUE.map((produto) => produto.foto.arquivo),
);
const fotosDisponiveisParaAmostra = cardapio.portfolio.itens.filter(
  (item) => !arquivosUsadosNosDestaque.has(item.arquivo),
);
const AMOSTRA_GALERIA = amostraCuradaPortfolio(fotosDisponiveisParaAmostra, 4);

// Home — ver docs/design/wireframes.md ("Home") e
// docs/redesign/arquitetura.md ("3.1 Home").
export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-cream-500 relative overflow-hidden px-4 py-24 text-center md:px-6 md:py-32">
        {/* Manchas de aquarela decorativas — ver design-tokens.md
            ("Cards" → decoração opcional). Puramente visual, sem
            interação/motion.
            Dark mode: sage-100/300 ficam FIXOS entre os temas (ver
            design-tokens.md "Dark mode") — pensados para se misturar
            num fundo claro, sem tratamento próprio viravam uma mancha
            clara/brilho sobre o fundo escuro (achado visual). dark:
            troca para sage-900 (também fixo, mas escuro) numa opacidade
            baixa — mesma linguagem decorativa, tom compatível com o
            fundo escuro em vez de removida. */}
        <div
          aria-hidden="true"
          className="rounded-pill bg-sage-300/30 dark:bg-sage-900/40 pointer-events-none absolute -top-24 -left-24 h-72 w-72 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="rounded-pill bg-sage-100/60 dark:bg-sage-900/25 pointer-events-none absolute -right-20 -bottom-32 h-80 w-80 blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl">
          <h1 className="text-sage-900 dark:text-sage-100">
            Bolos e docinhos feitos à mão, com carinho
          </h1>
          <p className="text-ink-600 mt-6 text-lg">
            Encomendas para festas e ocasiões especiais — retirada no local,
            pagamento via Pix.
          </p>
          {/* Secundário: é navegação para explorar o catálogo, não a
              conversão final da página (essa é o CTA de WhatsApp no fim
              da Home) — ver docs/redesign/arquitetura.md "3.1". */}
          <Button variant="secondary" href="/cardapio" className="mt-8">
            Ver Cardápio
          </Button>
        </div>

        {/* Mascote de corpo inteiro — "momento" de marca da Home, não
            repetido em outras páginas (Fase 10, ver
            docs/redesign/mascote-e-tipografia.md "3"). Um único
            elemento: em fluxo (position: relative) e centralizado no
            mobile, abaixo do botão — não há espaço lateral sobrando ao
            lado do texto centralizado numa tela estreita. A partir do
            md, vira um elemento "flutuante" ancorado ao canto inferior
            direito da SEÇÃO inteira (não do bloco de texto, mais
            estreito) — mesma lógica das manchas de aquarela decorativas
            acima, só que com o personagem em vez de uma mancha de cor;
            com o texto em max-w-2xl centralizado, sobra espaço lateral
            suficiente no desktop para o mascote não competir com
            H1/CTA. alt="": decorativo, não carrega informação que o
            H1/parágrafo já não digam. */}
        <Image
          src="/brand/mascote-corpo-inteiro.png"
          alt=""
          width={1055}
          height={1023}
          className="relative z-10 mx-auto mt-10 h-40 w-40 md:absolute md:right-4 md:bottom-0 md:mx-0 md:mt-0 md:h-56 md:w-56 lg:right-12 lg:h-72 lg:w-72"
        />
      </section>

      {/* Produtos em destaque */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <RevealOnScroll>
          <h2 className="text-sage-900 dark:text-sage-100">
            Um gostinho do nosso cardápio
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PRODUTOS_DESTAQUE.map((produto) => (
              <div key={produto.title}>
                <div className="bg-cream-300 rounded-md p-2">
                  <div className="bg-sage-100 relative aspect-3/4 overflow-hidden rounded-sm">
                    <PortfolioImage
                      src={`/portfolio/${produto.foto.arquivo}`}
                      alt={produto.foto.alt}
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <ProductCard
                    title={produto.title}
                    subtitle={produto.subtitle}
                    price={produto.price}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" href="/cardapio">
              Ver cardápio completo
            </Button>
          </div>
        </RevealOnScroll>
      </section>

      {/* Preview de galeria */}
      <section className="bg-cream-500 px-4 py-16 md:px-6">
        <RevealOnScroll className="mx-auto max-w-5xl">
          <h2 className="text-sage-900 dark:text-sage-100">Nosso Trabalho</h2>
          <div className="mt-8">
            <GallerySection variant="preview" itens={AMOSTRA_GALERIA} />
          </div>
          <div className="mt-6 text-center md:text-left">
            <Button variant="secondary" href="/galeria">
              Ver galeria completa
            </Button>
          </div>
        </RevealOnScroll>
      </section>

      {/* CTA final — único WhatsApp de conteúdo da Home (o botão
          flutuante é chrome global, não conta nessa contagem). Bloco de
          cor cheia em sage-900: o momento de contraste forte definido na
          distribuição de paleta da Etapa 2 (~10% sálvia saturada). */}
      <section className="bg-sage-900 px-4 py-16 text-center md:px-6">
        <RevealOnScroll className="mx-auto max-w-2xl">
          <h2 className="text-on-accent">Vamos combinar sua encomenda?</h2>
          <p className="text-on-accent/80 mt-4">
            Chama no WhatsApp — é o jeito mais rápido de confirmar sabores,
            tamanho e data de retirada.
          </p>
          {/* ring-on-accent (dark mode, Fase 11: era ring-cream-300 — na
              mesma linha de raciocínio de on-accent em
              docs/design/design-tokens.md, fixo nos dois temas): sobre
              fundo sage-900, o contorno garante contraste de borda >=
              3:1 (WCAG 1.4.11) — o fundo do
              botão sozinho (sage-700 em repouso desde a correção de
              contraste pós-Fase 9) fica em ~1.6:1 contra este fundo
              sage-900, baixo demais para depender só do preenchimento
              aqui; o ring é o que garante o contorno do botão.
              md:hover:bg-sage-700! (com "!" para vencer o md:hover:bg-sage-900
              do variant="primary"): nesta seção específica o hover padrão
              do botão (sage-900) coincidiria exatamente com o fundo desta
              seção, fazendo o preenchimento "sumir" ao passar o mouse —
              aqui o feedback de hover vem só do ring engrossando
              (ring-2 → ring-4), sem escurecer mais o preenchimento. */}
          <Button
            variant="primary"
            href={linkWhatsApp(cardapio.comoEncomendar.contato.telefone)}
            external
            className="ring-on-accent ring-offset-sage-900 md:hover:bg-sage-700! mt-8 ring-2 ring-offset-2 transition-[box-shadow,transform] md:hover:ring-4"
          >
            Falar no WhatsApp
          </Button>
        </RevealOnScroll>
      </section>
    </main>
  );
}
