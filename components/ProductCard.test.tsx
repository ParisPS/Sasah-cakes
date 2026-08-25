import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
  it("renderiza título, subtítulo e preço formatado", () => {
    render(<ProductCard title="20cm" subtitle="Rende 25 fatias" price={210} />);

    expect(screen.getByText("20cm")).toBeInTheDocument();
    expect(screen.getByText("Rende 25 fatias")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?210,00/)).toBeInTheDocument();
  });

  it("renderiza conteúdo adicional passado via children", () => {
    render(
      <ProductCard
        title="100 docinhos"
        subtitle="Escolha entre 2 ou 4 sabores"
        price={120}
      >
        <p>2 sabores — 50 unidades de cada sabor</p>
      </ProductCard>,
    );

    expect(
      screen.getByText("2 sabores — 50 unidades de cada sabor"),
    ).toBeInTheDocument();
  });
});
