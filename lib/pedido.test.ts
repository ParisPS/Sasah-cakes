import { describe, expect, it } from "vitest";
import {
  antecedenciaMinimaDias,
  dataMinimaPermitida,
  formatarDataBR,
  montarMensagemPedido,
  normalizarRascunho,
  RASCUNHO_PEDIDO_VAZIO,
  validarDataDesejada,
  type RascunhoPedido,
} from "./pedido";

// Data fixa para os testes não dependerem do dia em que rodam. Meio de
// mês, longe de virada de mês/ano, para evitar qualquer efeito colateral
// de fuso horário na aritmética de dias.
const HOJE = new Date(2026, 0, 15); // 15/01/2026 (mês 0-indexado)

describe("antecedenciaMinimaDias", () => {
  it("lê o número a partir do texto real de content/cardapio.json", () => {
    expect(antecedenciaMinimaDias()).toBe(4);
  });
});

describe("dataMinimaPermitida", () => {
  it("soma a antecedência mínima a partir de hoje", () => {
    expect(dataMinimaPermitida(HOJE)).toBe("2026-01-19");
  });

  it("atravessa a virada de mês corretamente", () => {
    expect(dataMinimaPermitida(new Date(2026, 0, 29))).toBe("2026-02-02");
  });
});

describe("formatarDataBR", () => {
  it("converte yyyy-mm-dd para dd/mm/aaaa", () => {
    expect(formatarDataBR("2026-01-19")).toBe("19/01/2026");
  });
});

describe("validarDataDesejada", () => {
  it("rejeita data vazia", () => {
    const resultado = validarDataDesejada("", HOJE);
    expect(resultado.valida).toBe(false);
  });

  it("rejeita uma data com menos de 4 dias de antecedência", () => {
    const resultado = validarDataDesejada("2026-01-18", HOJE);
    expect(resultado.valida).toBe(false);
    if (!resultado.valida) {
      expect(resultado.erro).toBe(
        "Encomendas precisam de no mínimo 4 dias de antecedência.",
      );
    }
  });

  it("aceita a data mínima exata", () => {
    expect(validarDataDesejada("2026-01-19", HOJE).valida).toBe(true);
  });

  it("aceita uma data bem no futuro", () => {
    expect(validarDataDesejada("2026-06-01", HOJE).valida).toBe(true);
  });
});

describe("normalizarRascunho", () => {
  const base: RascunhoPedido = {
    ...RASCUNHO_PEDIDO_VAZIO,
    dataDesejada: "2026-01-19",
    nome: "Maria Silva",
  };

  it("retorna null se a categoria não foi escolhida", () => {
    expect(normalizarRascunho(base, HOJE)).toBeNull();
  });

  it("retorna null se o nome estiver vazio ou só com espaços", () => {
    const rascunho: RascunhoPedido = {
      ...base,
      nome: "   ",
      categoria: "bolo-redondo",
      tamanho: "20cm",
      recheio: "Brigadeiro",
    };
    expect(normalizarRascunho(rascunho, HOJE)).toBeNull();
  });

  it("retorna null se a data for inválida (menos de 4 dias)", () => {
    const rascunho: RascunhoPedido = {
      ...base,
      categoria: "bolo-redondo",
      tamanho: "20cm",
      recheio: "Brigadeiro",
      dataDesejada: "2026-01-16",
    };
    expect(normalizarRascunho(rascunho, HOJE)).toBeNull();
  });

  describe("bolo redondo/quadrado", () => {
    it("retorna null sem tamanho ou sem recheio", () => {
      expect(
        normalizarRascunho(
          { ...base, categoria: "bolo-redondo", recheio: "Brigadeiro" },
          HOJE,
        ),
      ).toBeNull();
      expect(
        normalizarRascunho(
          { ...base, categoria: "bolo-redondo", tamanho: "20cm" },
          HOJE,
        ),
      ).toBeNull();
    });

    it("normaliza um pedido completo de bolo redondo", () => {
      const resultado = normalizarRascunho(
        {
          ...base,
          categoria: "bolo-redondo",
          tamanho: "20cm",
          recheio: "Brigadeiro",
          observacoes: "  Tema festa junina  ",
        },
        HOJE,
      );

      expect(resultado).toEqual({
        categoria: "bolo-redondo",
        tamanho: "20cm",
        recheio: "Brigadeiro",
        dataDesejada: "2026-01-19",
        nome: "Maria Silva",
        observacoes: "Tema festa junina",
      });
    });

    it("observações vira undefined quando vazia (não string vazia)", () => {
      const resultado = normalizarRascunho(
        {
          ...base,
          categoria: "bolo-quadrado",
          tamanho: "30x22",
          recheio: "Ninho",
        },
        HOJE,
      );
      expect(resultado?.observacoes).toBeUndefined();
    });
  });

  describe("docinhos", () => {
    it("retorna null sem quantidade de sabores escolhida", () => {
      expect(
        normalizarRascunho(
          { ...base, categoria: "docinhos", sabores: ["Beijinho", "Ninho"] },
          HOJE,
        ),
      ).toBeNull();
    });

    it("retorna null se a quantidade de sabores preenchidos não bater com a escolhida", () => {
      expect(
        normalizarRascunho(
          {
            ...base,
            categoria: "docinhos",
            quantidadeSabores: 4,
            sabores: ["Beijinho", "Ninho"],
          },
          HOJE,
        ),
      ).toBeNull();
    });

    it("retorna null se houver sabor duplicado", () => {
      expect(
        normalizarRascunho(
          {
            ...base,
            categoria: "docinhos",
            quantidadeSabores: 2,
            sabores: ["Beijinho", "Beijinho"],
          },
          HOJE,
        ),
      ).toBeNull();
    });

    it("normaliza um pedido completo de docinhos (2 sabores)", () => {
      const resultado = normalizarRascunho(
        {
          ...base,
          categoria: "docinhos",
          quantidadeSabores: 2,
          sabores: ["Beijinho", "Brigadeiro"],
        },
        HOJE,
      );

      expect(resultado).toEqual({
        categoria: "docinhos",
        quantidadeSabores: 2,
        sabores: ["Beijinho", "Brigadeiro"],
        dataDesejada: "2026-01-19",
        nome: "Maria Silva",
        observacoes: undefined,
      });
    });

    it("normaliza um pedido completo de docinhos (4 sabores)", () => {
      const resultado = normalizarRascunho(
        {
          ...base,
          categoria: "docinhos",
          quantidadeSabores: 4,
          sabores: ["Beijinho", "Brigadeiro", "Cajuzinho", "Churros"],
        },
        HOJE,
      );
      expect(resultado?.sabores).toHaveLength(4);
    });
  });
});

describe("montarMensagemPedido", () => {
  it("monta a mensagem de um bolo redondo, sem observações", () => {
    const mensagem = montarMensagemPedido({
      categoria: "bolo-redondo",
      tamanho: "20cm",
      recheio: "Brigadeiro",
      dataDesejada: "2026-01-19",
      nome: "Maria Silva",
    });

    expect(mensagem).toBe(
      [
        "Olá! Gostaria de fazer uma encomenda:",
        "",
        "Categoria: Bolo Redondo",
        "Tamanho: 20cm",
        "Recheio: Brigadeiro",
        "Data desejada: 19/01/2026",
        "Nome: Maria Silva",
      ].join("\n"),
    );
  });

  it("monta a mensagem de um bolo quadrado, com observações", () => {
    const mensagem = montarMensagemPedido({
      categoria: "bolo-quadrado",
      tamanho: "30x22",
      recheio: "Ninho",
      dataDesejada: "2026-02-01",
      nome: "João",
      observacoes: "Tema futebol",
    });

    expect(mensagem).toContain("Categoria: Bolo Quadrado");
    expect(mensagem).toContain("Tamanho: 30x22");
    expect(mensagem).toContain("Recheio: Ninho");
    expect(mensagem).toContain("Observações: Tema futebol");
    expect(mensagem).toContain("Nome: João");
    // Observações vem depois da data e antes do nome, na ordem pedida.
    expect(mensagem.indexOf("Data desejada")).toBeLessThan(
      mensagem.indexOf("Observações"),
    );
    expect(mensagem.indexOf("Observações")).toBeLessThan(
      mensagem.indexOf("Nome:"),
    );
  });

  it("monta a mensagem de docinhos com a descrição real da quantidade de sabores", () => {
    const mensagem = montarMensagemPedido({
      categoria: "docinhos",
      quantidadeSabores: 2,
      sabores: ["Beijinho", "Brigadeiro"],
      dataDesejada: "2026-01-19",
      nome: "Ana",
    });

    expect(mensagem).toContain("Categoria: Docinhos");
    expect(mensagem).toContain(
      "Sabores: 2 sabores (50 unidades de cada sabor) — Beijinho, Brigadeiro",
    );
  });

  it("monta a mensagem de docinhos com 4 sabores", () => {
    const mensagem = montarMensagemPedido({
      categoria: "docinhos",
      quantidadeSabores: 4,
      sabores: ["Beijinho", "Brigadeiro", "Cajuzinho", "Churros"],
      dataDesejada: "2026-01-19",
      nome: "Ana",
    });

    expect(mensagem).toContain(
      "Sabores: 4 sabores (25 unidades de cada sabor) — Beijinho, Brigadeiro, Cajuzinho, Churros",
    );
  });
});
