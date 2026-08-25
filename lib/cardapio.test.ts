import { describe, expect, it } from "vitest";
import {
  cardapio,
  CATEGORIA_PORTFOLIO_LABELS,
  formatarPreco,
  linkWhatsApp,
  telefoneParaWhatsApp,
} from "./cardapio";

// Normaliza espaços (Intl.NumberFormat pode usar NBSP U+00A0 entre "R$" e
// o valor, dependendo da build de ICU do Node) para a asserção não
// depender do ambiente onde o teste roda.
function semEspacosEspeciais(texto: string): string {
  return texto.replace(/ /g, " ");
}

describe("formatarPreco", () => {
  it("formata um valor inteiro como moeda brasileira", () => {
    expect(semEspacosEspeciais(formatarPreco(180))).toBe("R$ 180,00");
  });

  it("formata um valor com centavos", () => {
    expect(semEspacosEspeciais(formatarPreco(199.9))).toBe("R$ 199,90");
  });

  it("formata zero", () => {
    expect(semEspacosEspeciais(formatarPreco(0))).toBe("R$ 0,00");
  });
});

describe("telefoneParaWhatsApp", () => {
  it("remove formatação e adiciona o código do país", () => {
    expect(telefoneParaWhatsApp("(21) 98200-8885")).toBe("5521982008885");
  });

  it("funciona com um número já sem formatação", () => {
    expect(telefoneParaWhatsApp("21982008885")).toBe("5521982008885");
  });
});

describe("linkWhatsApp", () => {
  it("monta a URL wa.me com o telefone formatado e mensagem padrão", () => {
    const url = linkWhatsApp("(21) 98200-8885");
    expect(url).toContain("https://wa.me/5521982008885?text=");
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(
      "Olá! Vi o site da Sasah Cakes e quero fazer uma encomenda.",
    );
  });

  it("aceita uma mensagem customizada e a codifica corretamente", () => {
    const url = linkWhatsApp("(21) 98200-8885", "Quero um bolo de 20cm!");
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(
      "Quero um bolo de 20cm!",
    );
  });
});

describe("dados de content/cardapio.json", () => {
  it("tem pelo menos um tamanho de bolo redondo e um quadrado", () => {
    expect(cardapio.bolos.redondos.length).toBeGreaterThan(0);
    expect(cardapio.bolos.quadrados.length).toBeGreaterThan(0);
  });

  it("todo tamanho de bolo tem tamanho, rendimento e preço positivo", () => {
    for (const item of [
      ...cardapio.bolos.redondos,
      ...cardapio.bolos.quadrados,
    ]) {
      expect(item.tamanho).toBeTruthy();
      expect(item.rendimento).toBeTruthy();
      expect(item.preco).toBeGreaterThan(0);
    }
  });

  it("contato de encomenda tem nome e telefone preenchidos", () => {
    expect(cardapio.comoEncomendar.contato.nome).toBeTruthy();
    expect(cardapio.comoEncomendar.contato.telefone).toBeTruthy();
  });

  it("portfólio tem 12 itens, cada um com arquivo, categoria válida e alt", () => {
    expect(cardapio.portfolio.itens).toHaveLength(12);
    for (const item of cardapio.portfolio.itens) {
      expect(item.arquivo).toMatch(/\.jpg$/);
      expect(Object.keys(CATEGORIA_PORTFOLIO_LABELS)).toContain(item.categoria);
      expect(item.alt.length).toBeGreaterThan(10);
    }
  });
});
