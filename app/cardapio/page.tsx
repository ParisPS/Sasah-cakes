import type { Metadata } from "next";
import Link from "next/link";
import { cardapio } from "@/lib/cardapio";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/Badge";

export const metadata: Metadata = {
  title: "Cardápio · Sasah Cakes",
};

// Cardápio — ver docs/design/wireframes.md ("Cardápio"). As duas seções de
// tamanho (Redondos/Quadrados) ficam empilhadas em vez de em tabs — o
// wireframe permite ambas as abordagens ("Tabs podem virar duas seções
// lado a lado ou manter tabs no topo, conforme espaço"); seções evitam
// esconder conteúdo atrás de JS no mobile-first.
export default function CardapioPage() {
  const { redondos, quadrados, recheiosDisponiveis } = cardapio.bolos;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900">Cardápio</h1>

      <section className="mt-10">
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

      <section className="mt-14">
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
        <div className="mt-6 flex flex-wrap gap-3">
          {recheiosDisponiveis.map((recheio) => (
            <Badge key={recheio}>{recheio}</Badge>
          ))}
        </div>
      </section>

      <div className="mt-14 text-center">
        <Link
          href="/como-encomendar"
          className="inline-block rounded-pill bg-sage-500 px-7 py-3 font-body text-cream-300 shadow-sm transition-[box-shadow,transform] active:scale-[0.98] active:bg-sage-700 active:shadow-md md:hover:bg-sage-700 md:hover:shadow-md"
        >
          Quero Encomendar
        </Link>
      </div>
    </main>
  );
}
