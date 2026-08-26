import { describe, expect, it } from "vitest";
import {
  amostraCuradaPortfolio,
  cardapio,
  CATEGORIA_PORTFOLIO_LABELS,
  formatarPreco,
  linkWhatsApp,
  primeiraFotoDaCategoria,
  tamanhoIntermediario,
  telefoneParaWhatsApp,
  type ItemPortfolio,
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

describe("tamanhoIntermediario", () => {
  it("retorna o item do meio de uma lista com número ímpar de itens", () => {
    expect(tamanhoIntermediario(["a", "b", "c"])).toBe("b");
  });

  it("retorna o item logo depois do meio de uma lista com número par de itens", () => {
    expect(tamanhoIntermediario(["a", "b", "c", "d"])).toBe("c");
  });

  it("usa os tamanhos reais de content/cardapio.json", () => {
    expect(tamanhoIntermediario(cardapio.bolos.redondos).tamanho).toBe("20cm");
    expect(tamanhoIntermediario(cardapio.bolos.quadrados).tamanho).toBe(
      "30x22",
    );
  });
});

describe("primeiraFotoDaCategoria", () => {
  it("retorna a primeira foto de uma categoria, na ordem do JSON", () => {
    const foto = primeiraFotoDaCategoria(
      cardapio.portfolio.itens,
      "bolo-quadrado",
    );
    expect(foto?.arquivo).toBe("bolo-quadrado-lilas-edicao-limitada.jpg");
  });

  it("retorna undefined se a categoria não existir na lista", () => {
    const foto = primeiraFotoDaCategoria([], "docinho");
    expect(foto).toBeUndefined();
  });
});

describe("amostraCuradaPortfolio", () => {
  const ITENS: ItemPortfolio[] = [
    { arquivo: "r1.jpg", categoria: "bolo-redondo", alt: "r1" },
    { arquivo: "r2.jpg", categoria: "bolo-redondo", alt: "r2" },
    { arquivo: "r3.jpg", categoria: "bolo-redondo", alt: "r3" },
    { arquivo: "q1.jpg", categoria: "bolo-quadrado", alt: "q1" },
    { arquivo: "d1.jpg", categoria: "docinho", alt: "d1" },
  ];

  it("cobre cada categoria existente pelo menos uma vez antes de repetir categoria", () => {
    const amostra = amostraCuradaPortfolio(ITENS, 3);
    const categorias = new Set(amostra.map((item) => item.categoria));
    expect(categorias.size).toBe(3);
  });

  it("completa a quantidade pedida com os itens restantes, na ordem original", () => {
    const amostra = amostraCuradaPortfolio(ITENS, 4);
    expect(amostra.map((item) => item.arquivo)).toEqual([
      "r1.jpg",
      "q1.jpg",
      "d1.jpg",
      "r2.jpg",
    ]);
  });

  it("nunca retorna mais itens do que existem na lista original", () => {
    const amostra = amostraCuradaPortfolio(ITENS, 100);
    expect(amostra).toHaveLength(ITENS.length);
  });

  it("nunca repete o mesmo item na amostra", () => {
    const amostra = amostraCuradaPortfolio(ITENS, ITENS.length);
    const arquivosUnicos = new Set(amostra.map((item) => item.arquivo));
    expect(arquivosUnicos.size).toBe(amostra.length);
  });
});
