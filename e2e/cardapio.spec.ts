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

    // .first(): "Beijinho" aparece tanto em recheiosDisponiveis (bolo)
    // quanto em saboresDisponiveis (docinho) em content/cardapio.json —
    // desde que as duas seções passaram a conviver na mesma página
    // (Fase 9), o badge existe duas vezes; a seção de recheios vem
    // antes da de Docinhos no DOM, então .first() pega a instância certa.
    for (const recheio of cardapio.bolos.recheiosDisponiveis) {
      await expect(
        page.getByText(recheio, { exact: true }).first(),
      ).toBeVisible();
    }
  });
});

// Docinhos é uma seção de /cardapio desde a Fase 9 (redesign de marca),
// não uma página própria — ver docs/redesign/arquitetura.md "1.1".
test.describe("seção Docinhos (dentro do Cardápio)", () => {
  test("exibe o pacote, as opções de sabores e o preço", async ({ page }) => {
    await page.goto("/cardapio#docinhos");

    await expect(
      page.getByText(`${cardapio.docinhos.quantidade} docinhos`),
    ).toBeVisible();
    await expect(
      page.getByText(formatarPreco(cardapio.docinhos.preco)).first(),
    ).toBeVisible();

    // Escopado a #docinhos, não getByText solto: "Beijinho" também é um
    // recheio de bolo (content/cardapio.json), então aparece 2x na
    // página inteira — aqui o que importa é confirmar que está dentro
    // da seção de Docinhos especificamente.
    const secaoDocinhos = page.locator("#docinhos");
    for (const sabor of cardapio.docinhos.saboresDisponiveis) {
      await expect(
        secaoDocinhos.getByText(sabor, { exact: true }),
      ).toBeVisible();
    }
  });
});
