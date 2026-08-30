import type { Metadata } from "next";
import Image from "next/image";
import { cardapio } from "@/lib/cardapio";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Cardápio · Sasah Cakes",
  description:
    "Bolos redondos, quadrados e pacotes de docinhos da Sasah Cakes — tamanhos, rendimento, sabores e preços.",
};

const CATEGORIAS = [
  { href: "#bolos-redondos", label: "Bolos Redondos" },
  { href: "#bolos-quadrados", label: "Bolos Quadrados" },
  { href: "#docinhos", label: "Docinhos" },
];

// Cardápio — ver docs/design/wireframes.md ("Cardápio") e
// docs/redesign/arquitetura.md ("3.2 Cardápio"). Três seções
// (Redondos/Quadrados/Docinhos — Docinhos deixou de ser página própria
// na Fase 9, ver "1.1"), empilhadas em vez de escondidas atrás de tabs
// controladas por JS. A "navegação por categoria" pedida na Etapa 3 é só
// uma barra de âncoras HTML puras (<a href="#id">) — sem estado de "aba
// ativa" via scroll-spy: isso exigiria JS e um IntersectionObserver
// extra só para destacar visualmente qual seção está no viewport, o que
// não muda a funcionalidade (a pessoa já vê a seção na tela) e vai
// contra a proporcionalidade de ferramental já seguida no projeto (ver
// docs/design/motion-principles.md, mesma lógica de "CSS puro antes de
// JS"). `scroll-smooth` (app/layout.tsx) mais `scroll-mt-24` em cada
// seção cobre a UX de rolar suavemente até a seção certa, respeitando
// prefers-reduced-motion nativamente (o navegador já pula a animação de
// scroll-behavior:smooth quando reduced motion está ativo).
export default function CardapioPage() {
  const { redondos, quadrados, recheiosDisponiveis } = cardapio.bolos;
  const { quantidade, preco, opcoesDeSabores, saboresDisponiveis } =
    cardapio.docinhos;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900 dark:text-sage-100">Cardápio</h1>
      <p className="text-ink-600 mt-3">
        Bolos redondos, quadrados e pacotes de docinhos — escolha uma categoria
        ou role a página.
      </p>

      {/* Barra de categorias — scroll horizontal no mobile (pills não
          cabem todas na largura da tela), lado a lado no desktop.
          hover:text-sage-900 (achado da revisão da Fase 9, Etapa 5): o
          fundo sage-100 do hover mede só 4.37:1 contra o texto sage-700
          em repouso, abaixo do mínimo AA de 4.5:1 — 7.13:1 contra
          sage-900. Mesmo par usado em components/GaleriaFiltravel.tsx. */}
      <nav
        aria-label="Categorias do cardápio"
        className="mt-6 flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible"
      >
        {CATEGORIAS.map((categoria) => (
          <a
            key={categoria.href}
            href={categoria.href}
            className="rounded-pill border-sage-300 text-sage-700 dark:text-sage-300 hover:bg-sage-100 hover:text-sage-900 dark:hover:text-sage-900 font-body shrink-0 border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none"
          >
            {categoria.label}
          </a>
        ))}
      </nav>

      <RevealOnScroll>
        <section id="bolos-redondos" className="mt-10 scroll-mt-24">
          <h2 className="text-sage-900 dark:text-sage-100">Bolos Redondos</h2>
          {/* public/produtos-ia/bolo-redondo.jpg — PLACEHOLDER TEMPORÁRIO
              gerado por IA, a ser substituído por fotografia profissional
              real assim que houver (ver docs/redesign/mascote-e-tipografia.md
              "4"). Ilustra a categoria em geral, não um tamanho/preço
              específico da lista abaixo — por isso aparece uma vez no topo
              da seção, não repetido em cada ProductCard. Nenhum card do
              Cardápio tinha foto até a Fase 10. */}
          <div className="bg-cream-300 mt-6 rounded-md p-2">
            <div className="bg-sage-100 relative aspect-video overflow-hidden rounded-sm">
              <Image
                src="/produtos-ia/bolo-redondo.jpg"
                alt="Bolo redondo com cobertura rosa e calda escorrendo pelas laterais, com uma fatia cortada mostrando as camadas"
                fill
                sizes="(min-width: 768px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {redondos.map((item) => (
              <ProductCard
                key={item.tamanho}
                title={item.tamanho}
                subtitle={`Rende ${item.rendimento}`}
                price={item.preco}
              />
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          id="bolos-quadrados"
          className="bg-cream-500 mt-14 scroll-mt-24 rounded-lg p-6 md:p-8"
        >
          <h2 className="text-sage-900 dark:text-sage-100">Bolos Quadrados</h2>
          {/* public/produtos-ia/bolo-quadrado.jpg — mesmo raciocínio do
              placeholder de Bolos Redondos acima. */}
          <div className="bg-cream-300 mt-6 rounded-md p-2">
            <div className="bg-sage-100 relative aspect-video overflow-hidden rounded-sm">
              <Image
                src="/produtos-ia/bolo-quadrado.jpg"
                alt="Bolo quadrado com cobertura na cor caramelo, cortado ao meio mostrando as camadas e o recheio"
                fill
                sizes="(min-width: 768px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {quadrados.map((item) => (
              <ProductCard
                key={item.tamanho}
                title={item.tamanho}
                subtitle={`Rende ${item.rendimento}`}
                price={item.preco}
              />
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="mt-14">
          <h2 className="text-sage-900 dark:text-sage-100">
            Recheios disponíveis
          </h2>
          <p className="text-ink-600 mt-2">
            Vale para os bolos redondos e quadrados.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {recheiosDisponiveis.map((recheio) => (
              <Badge key={recheio}>{recheio}</Badge>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          id="docinhos"
          className="bg-cream-500 mt-14 scroll-mt-24 rounded-lg p-6 md:p-8"
        >
          <h2 className="text-sage-900 dark:text-sage-100">Docinhos</h2>
          {/* public/produtos-ia/docinhos.jpg — mesmo raciocínio do
              placeholder de Bolos Redondos acima. */}
          <div className="bg-cream-300 mt-6 rounded-md p-2">
            <div className="bg-sage-100 relative aspect-video overflow-hidden rounded-sm">
              <Image
                src="/produtos-ia/docinhos.jpg"
                alt="Três brigadeiros cobertos de granulado, servidos numa bandeja de metal"
                fill
                sizes="(min-width: 768px) 896px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-md">
              <ProductCard
                title={`${quantidade} docinhos`}
                subtitle="Escolha entre 2 ou 4 sabores"
                price={preco}
              >
                <ul className="border-cream-700 mt-4 space-y-2 border-t pt-4">
                  {opcoesDeSabores.map((opcao) => (
                    <li key={opcao.quantidadeSabores} className="text-ink-900">
                      <span className="text-sage-700 dark:text-sage-300 font-semibold">
                        {opcao.quantidadeSabores} sabores
                      </span>{" "}
                      — {opcao.descricao}
                    </li>
                  ))}
                </ul>
              </ProductCard>
            </div>
          </div>

          <h3 className="text-sage-900 dark:text-sage-100 mt-8">
            Sabores disponíveis
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {saboresDisponiveis.map((sabor) => (
              <Badge key={sabor}>{sabor}</Badge>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <div className="mt-14 text-center">
        <Button variant="primary" href="/como-encomendar">
          Quero Encomendar
        </Button>
      </div>
    </main>
  );
}
