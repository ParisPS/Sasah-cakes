import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Sem isso, o DOM de um render() persiste entre testes do mesmo arquivo
// (test.globals não está ligado em vitest.config.ts, então o
// afterEach automático do Testing Library não é registrado sozinho) —
// passou despercebido até a Fase 9 porque nenhum teste anterior tinha
// múltiplos render() do mesmo componente com texto que se repete entre
// eles (ex: Footer, chamado 1x por teste em cenários diferentes).
afterEach(() => {
  cleanup();
});
