import { expect, test } from "@playwright/test";
import { cardapio } from "@/lib/cardapio";

test.describe("página Galeria", () => {
  test("com o filtro 'Todos' (padrão), exibe as 12 fotos reais do portfólio", async ({
    page,
  }) => {
    await page.goto("/galeria");

    const fotos = page.locator("main img");
    await expect(fotos).toHaveCount(cardapio.portfolio.itens.length);

    for (const item of cardapio.portfolio.itens) {
      await expect(page.getByAltText(item.alt)).toBeVisible();
    }
  });

  // Filtro de categoria (Fase 9) substitui o badge que antes aparecia
  // repetido em cada foto — ver docs/redesign/arquitetura.md "3.3".
  test("filtro por categoria mostra só as fotos daquela categoria", async ({
    page,
  }) => {
    await page.goto("/galeria");

    const fotosRedondo = cardapio.portfolio.itens.filter(
      (item) => item.categoria === "bolo-redondo",
    );
    const filtro = page.getByRole("group", { name: "Filtrar por categoria" });
    const botaoRedondo = filtro.getByRole("button", { name: "Bolo redondo" });

    await botaoRedondo.click();
    await expect(botaoRedondo).toHaveAttribute("aria-pressed", "true");

    const fotos = page.locator("main img");
    await expect(fotos).toHaveCount(fotosRedondo.length);
    for (const item of fotosRedondo) {
      await expect(page.getByAltText(item.alt)).toBeVisible();
    }

    // Volta pra "Todos" — confirma que o filtro não é um estado
    // permanente/sem saída.
    await filtro.getByRole("button", { name: "Todos" }).click();
    await expect(fotos).toHaveCount(cardapio.portfolio.itens.length);
  });

  test("filtro de categoria é operável só por teclado", async ({ page }) => {
    await page.goto("/galeria");

    const botaoDocinho = page.getByRole("button", { name: "Docinhos" });
    await botaoDocinho.focus();
    await page.keyboard.press("Enter");

    await expect(botaoDocinho).toHaveAttribute("aria-pressed", "true");
    const fotosDocinho = cardapio.portfolio.itens.filter(
      (item) => item.categoria === "docinho",
    );
    await expect(page.locator("main img")).toHaveCount(fotosDocinho.length);
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
