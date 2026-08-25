import { expect, test } from "@playwright/test";
import { cardapio, formatarPreco } from "@/lib/cardapio";

test.describe("página Cardápio", () => {
  test("exibe todos os tamanhos e preços de content/cardapio.json", async ({
    page,
  }) => {
    await page.goto("/cardapio");

    for (const item of [
      ...cardapio.bolos.redondos,
      ...cardapio.bolos.quadrados,
    ]) {
      await expect(
        page.getByText(item.tamanho, { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByText(formatarPreco(item.preco)).first(),
      ).toBeVisible();
    }

    for (const recheio of cardapio.bolos.recheiosDisponiveis) {
      await expect(page.getByText(recheio, { exact: true })).toBeVisible();
    }
  });
});

test.describe("página Docinhos", () => {
  test("exibe o pacote, as opções de sabores e o preço", async ({ page }) => {
    await page.goto("/docinhos");

    await expect(
      page.getByText(`${cardapio.docinhos.quantidade} docinhos`),
    ).toBeVisible();
    await expect(
      page.getByText(formatarPreco(cardapio.docinhos.preco)).first(),
    ).toBeVisible();

    for (const sabor of cardapio.docinhos.saboresDisponiveis) {
      await expect(page.getByText(sabor, { exact: true })).toBeVisible();
    }
  });
});
