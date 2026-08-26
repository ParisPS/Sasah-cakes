import type { Metadata } from "next";
import { cardapio } from "@/lib/cardapio";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Cardápio · Sasah Cakes",
};

// Cardápio — ver docs/design/wireframes.md ("Cardápio"). As três seções
// (Redondos/Quadrados/Docinhos) ficam empilhadas em vez de em tabs que
// escondem conteúdo atrás de JS — o wireframe original já permitia essa
// abordagem para as duas de bolo; Docinhos entrou como uma terceira
// seção na Fase 9 (redesign de marca — deixou de ser página própria, ver
// docs/redesign/arquitetura.md "1.1"). `scroll-mt-24` nos ids de âncora
// evita que o header sticky cubra o título ao navegar direto para uma
// seção (ex: vindo do redirect de /docinhos). A navegação por
// âncora/categoria (tabs) é adicionada na Etapa 4.5 — esta página já
// fica funcional com ids simples antes disso.
export default function CardapioPage() {
  const { redondos, quadrados, recheiosDisponiveis } = cardapio.bolos;
  const { quantidade, preco, opcoesDeSabores, saboresDisponiveis } =
    cardapio.docinhos;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900">Cardápio</h1>

      <section id="bolos-redondos" className="mt-10 scroll-mt-24">
        <h2 className="text-sage-900">Bolos Redondos</h2>
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

      <section id="bolos-quadrados" className="mt-14 scroll-mt-24">
        <h2 className="text-sage-900">Bolos Quadrados</h2>
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

      <section className="mt-14">
        <h2 className="text-sage-900">Recheios disponíveis</h2>
        <p className="text-ink-600 mt-2">
          Vale para os bolos redondos e quadrados.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {recheiosDisponiveis.map((recheio) => (
            <Badge key={recheio}>{recheio}</Badge>
          ))}
        </div>
      </section>

      <section id="docinhos" className="mt-14 scroll-mt-24">
        <h2 className="text-sage-900">Docinhos</h2>
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
                    <span className="text-sage-700 font-semibold">
                      {opcao.quantidadeSabores} sabores
                    </span>{" "}
                    — {opcao.descricao}
                  </li>
                ))}
              </ul>
            </ProductCard>
          </div>
        </div>

        <h3 className="text-sage-900 mt-8">Sabores disponíveis</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {saboresDisponiveis.map((sabor) => (
            <Badge key={sabor}>{sabor}</Badge>
          ))}
        </div>
      </section>

      <div className="mt-14 text-center">
        <Button variant="primary" href="/como-encomendar">
          Quero Encomendar
        </Button>
      </div>
    </main>
  );
}
