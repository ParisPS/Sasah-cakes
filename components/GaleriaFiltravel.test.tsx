import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ItemPortfolio } from "@/lib/cardapio";
import { GaleriaFiltravel } from "./GaleriaFiltravel";

const ITENS: ItemPortfolio[] = [
  { arquivo: "r1.jpg", categoria: "bolo-redondo", alt: "Bolo redondo 1" },
  { arquivo: "q1.jpg", categoria: "bolo-quadrado", alt: "Bolo quadrado 1" },
  { arquivo: "d1.jpg", categoria: "docinho", alt: "Docinho 1" },
];

describe("GaleriaFiltravel", () => {
  it("mostra todas as fotos com o filtro 'Todos' selecionado por padrão", () => {
    render(<GaleriaFiltravel itens={ITENS} />);

    expect(screen.getAllByRole("img")).toHaveLength(ITENS.length);
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("filtra as fotos ao clicar numa categoria", () => {
    render(<GaleriaFiltravel itens={ITENS} />);

    fireEvent.click(screen.getByRole("button", { name: "Bolo redondo" }));

    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByAltText("Bolo redondo 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Bolo redondo" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("volta a mostrar todas as fotos ao clicar em 'Todos' de novo", () => {
    render(<GaleriaFiltravel itens={ITENS} />);

    fireEvent.click(screen.getByRole("button", { name: "Docinhos" }));
    expect(screen.getAllByRole("img")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Todos" }));
    expect(screen.getAllByRole("img")).toHaveLength(ITENS.length);
  });
});
