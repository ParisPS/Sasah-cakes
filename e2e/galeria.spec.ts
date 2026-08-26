import { expect, test } from "@playwright/test";
import { cardapio } from "@/lib/cardapio";

test.describe("página Galeria", () => {
  test("exibe as 12 fotos reais do portfólio, cada uma com sua categoria", async ({
    page,
  }) => {
    await page.goto("/galeria");

    const fotos = page.locator("main img");
    await expect(fotos).toHaveCount(cardapio.portfolio.itens.length);

    for (const item of cardapio.portfolio.itens) {
      await expect(page.getByAltText(item.alt)).toBeVisible();
    }
  });

  // Amostra curada de 4 fotos desde a Fase 9 (redesign de marca) — não é
  // mais uma cópia do portfólio inteiro. Ver docs/redesign/arquitetura.md
  // "3.1 Home" e lib/cardapio.ts (amostraCuradaPortfolio).
  test("preview de galeria na Home mostra uma amostra curada, não o portfólio inteiro", async ({
    page,
  }) => {
    await page.goto("/");

    // 4 da prévia de galeria + 3 fotos de produto em destaque (uma por
    // categoria: bolo redondo, bolo quadrado, docinho) = 7 imagens do
    // portfólio na Home, sempre menos que as 12 da Galeria completa.
    const fotos = page.locator("main img");
    await expect(fotos).toHaveCount(7);
  });
});
