import type { Metadata } from "next";
import Link from "next/link";
import { cardapio } from "@/lib/cardapio";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/Badge";

export const metadata: Metadata = {
  title: "Docinhos · Sasah Cakes",
};

// Docinhos — ver docs/design/wireframes.md ("Docinhos").
export default function DocinhosPage() {
  const { quantidade, preco, opcoesDeSabores, saboresDisponiveis } =
    cardapio.docinhos;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900">Docinhos</h1>

      <section className="mt-10 flex justify-center">
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
      </section>

      <section className="mt-14">
        <h2 className="text-sage-900">Sabores disponíveis</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {saboresDisponiveis.map((sabor) => (
            <Badge key={sabor}>{sabor}</Badge>
          ))}
        </div>
      </section>

      <div className="mt-14 text-center">
        <Link
          href="/como-encomendar"
          className="rounded-pill bg-sage-500 font-body text-cream-300 active:bg-sage-700 md:hover:bg-sage-700 inline-block px-7 py-3 shadow-sm transition-[box-shadow,transform] active:scale-[0.98] active:shadow-md md:hover:shadow-md"
        >
          Quero Encomendar
        </Link>
      </div>
    </main>
  );
}
