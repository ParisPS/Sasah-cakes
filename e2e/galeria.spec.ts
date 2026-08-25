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

  test("preview de galeria aparece na Home", async ({ page }) => {
    await page.goto("/");

    const fotos = page.locator("main img");
    await expect(fotos).toHaveCount(cardapio.portfolio.itens.length);
  });
});
