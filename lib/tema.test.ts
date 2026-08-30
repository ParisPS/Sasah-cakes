import { beforeEach, describe, expect, it } from "vitest";
import {
  lerPreferenciaSalva,
  salvarPreferencia,
  temaEfetivo,
  TEMA_STORAGE_KEY,
} from "./tema";

describe("temaEfetivo", () => {
  it("retorna 'claro' quando a preferência é claro, independente do sistema", () => {
    expect(temaEfetivo("claro", true)).toBe("claro");
    expect(temaEfetivo("claro", false)).toBe("claro");
  });

  it("retorna 'escuro' quando a preferência é escuro, independente do sistema", () => {
    expect(temaEfetivo("escuro", true)).toBe("escuro");
    expect(temaEfetivo("escuro", false)).toBe("escuro");
  });

  it("segue o sistema quando a preferência é 'sistema'", () => {
    expect(temaEfetivo("sistema", true)).toBe("escuro");
    expect(temaEfetivo("sistema", false)).toBe("claro");
  });
});

describe("lerPreferenciaSalva / salvarPreferencia", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("retorna null quando nada foi salvo ainda", () => {
    expect(lerPreferenciaSalva()).toBeNull();
  });

  it("salva e lê de volta cada preferência válida", () => {
    for (const tema of ["claro", "escuro", "sistema"] as const) {
      salvarPreferencia(tema);
      expect(lerPreferenciaSalva()).toBe(tema);
    }
  });

  it("retorna null se o valor salvo for inválido (ex: versão antiga)", () => {
    window.localStorage.setItem(TEMA_STORAGE_KEY, "azul");
    expect(lerPreferenciaSalva()).toBeNull();
  });
});
