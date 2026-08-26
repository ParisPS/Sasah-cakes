import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renderiza como link interno (next/link) quando href não é externo", () => {
    render(<Button href="/cardapio">Ver Cardápio</Button>);

    const link = screen.getByRole("link", { name: "Ver Cardápio" });
    expect(link).toHaveAttribute("href", "/cardapio");
    expect(link).not.toHaveAttribute("target");
  });

  it('renderiza como <a target="_blank"> quando external está presente', () => {
    render(
      <Button href="https://wa.me/5521982008885" external>
        Chamar no WhatsApp
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Chamar no WhatsApp" });
    expect(link).toHaveAttribute("href", "https://wa.me/5521982008885");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renderiza como <button> e chama onClick quando não recebe href", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Tentar novamente</Button>);

    const button = screen.getByRole("button", { name: "Tentar novamente" });
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("aplica classes diferentes para as variantes primária e secundária", () => {
    const { rerender } = render(<Button href="/cardapio">Primário</Button>);
    const primario = screen.getByRole("link", { name: "Primário" });
    expect(primario.className).toContain("bg-sage-500");

    rerender(
      <Button href="/cardapio" variant="secondary">
        Secundário
      </Button>,
    );
    const secundario = screen.getByRole("link", { name: "Secundário" });
    expect(secundario.className).toContain("border-sage-500");
    expect(secundario.className).not.toContain("bg-sage-500");
  });
});
