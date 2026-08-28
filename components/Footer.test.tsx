import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import { cardapio } from "@/lib/cardapio";
import { Footer } from "./Footer";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("Footer", () => {
  it("mostra nome, telefone e link de WhatsApp em páginas comuns", () => {
    vi.mocked(usePathname).mockReturnValue("/cardapio");
    render(<Footer />);

    const { nome, telefone } = cardapio.comoEncomendar.contato;
    // Não usa new RegExp(telefone) direto: o telefone tem parênteses e
    // hífen, que viram sintaxe de regex em vez de caracteres literais.
    expect(
      screen.getByText((_, el) => el?.textContent === `${nome} · ${telefone}`),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /fale no whatsapp/i }),
    ).toBeInTheDocument();
  });

  // Em /como-encomendar a própria página já mostra nome, telefone e um
  // CTA primário de WhatsApp — o rodapé não repete (auditoria, item
  // 1.4; ver docs/redesign/arquitetura.md "3.5").
  it("não repete nome/telefone/WhatsApp em /como-encomendar", () => {
    vi.mocked(usePathname).mockReturnValue("/como-encomendar");
    render(<Footer />);

    const { nome } = cardapio.comoEncomendar.contato;
    expect(screen.queryByText(new RegExp(nome))).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /fale no whatsapp/i }),
    ).not.toBeInTheDocument();
  });

  it("sempre mostra o selo do mascote e o copyright", () => {
    vi.mocked(usePathname).mockReturnValue("/como-encomendar");
    render(<Footer />);

    // O wordmark de texto virou o selo do mascote na Fase 10 (ver
    // docs/redesign/mascote-e-tipografia.md "2") — alt descritivo no
    // lugar do texto "Sasah Cakes" que existia antes.
    expect(screen.getByAltText("Sasah Cakes")).toBeInTheDocument();
    expect(screen.getByText(/feito à mão, com carinho/i)).toBeInTheDocument();
  });
});
