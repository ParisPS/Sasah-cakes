import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";
import { WhatsAppButton } from "./WhatsAppButton";

describe("WhatsAppButton", () => {
  it("aponta para o link wa.me montado a partir do telefone de contato do cardápio", () => {
    render(<WhatsAppButton />);

    const link = screen.getByRole("link", { name: /chamar no whatsapp/i });
    expect(link).toHaveAttribute(
      "href",
      linkWhatsApp(cardapio.comoEncomendar.contato.telefone),
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
