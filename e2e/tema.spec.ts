import { expect, test, type Page } from "@playwright/test";
import { TEMA_STORAGE_KEY } from "@/lib/tema";

// Testes E2E do dark mode (Fase 11) — Issue #132. Cobre: o toggle troca
// de tema de verdade (classe `dark` em <html>), a escolha persiste ao
// recarregar a página, e cada página principal renderiza sem quebra
// visual/de layout no modo escuro (sem confiar só em screenshot manual
// — ver docs/design/design-tokens.md "Dark mode" para a auditoria de
// contraste completa, feita à parte com um script de contraste, não
// aqui).

async function estaEscuro(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
}

test.describe("toggle de tema", () => {
  test("troca entre claro, escuro e sistema, e aplica a classe dark corretamente", async ({
    page,
  }) => {
    await page.goto("/");
    const select = page.getByLabel("Tema do site");

    await select.selectOption("escuro");
    await expect.poll(() => estaEscuro(page)).toBe(true);

    await select.selectOption("claro");
    await expect.poll(() => estaEscuro(page)).toBe(false);

    await select.selectOption("sistema");
    // Sem emular color-scheme, o padrão do navegador em teste é "claro".
    await expect.poll(() => estaEscuro(page)).toBe(false);
  });

  test("a escolha manual persiste ao recarregar a página", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Tema do site").selectOption("escuro");
    await expect.poll(() => estaEscuro(page)).toBe(true);

    await page.reload();

    // A classe já deve estar aplicada mesmo antes de qualquer interação
    // — é o script inline (beforeInteractive) que faz isso, não o
    // componente React (que só assume depois de montado).
    await expect.poll(() => estaEscuro(page)).toBe(true);
    await expect(page.getByLabel("Tema do site")).toHaveValue("escuro");

    // Volta para claro, pra não vazar estado entre testes que
    // reutilizem o mesmo localStorage (contextos de teste não
    // compartilham storage entre si por padrão, mas fica explícito).
    await page.getByLabel("Tema do site").selectOption("claro");
  });

  test("com o sistema operacional preferindo escuro e nenhuma escolha salva, o site abre escuro", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");

    await expect.poll(() => estaEscuro(page)).toBe(true);
    await expect(page.getByLabel("Tema do site")).toHaveValue("sistema");

    await context.close();
  });
});

test.describe("páginas renderizam no modo escuro sem quebra", () => {
  for (const { path, heading } of [
    { path: "/", heading: "Bolos e docinhos feitos à mão, com carinho" },
    { path: "/cardapio", heading: "Cardápio" },
    { path: "/galeria", heading: "Nosso Trabalho" },
    { path: "/como-encomendar", heading: "Como Encomendar" },
  ]) {
    test(`${path} — elementos principais visíveis, sem erro de console`, async ({
      page,
    }) => {
      const errosConsole: string[] = [];
      page.on("pageerror", (erro) => errosConsole.push(erro.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") errosConsole.push(msg.text());
      });

      await page.addInitScript(
        (chave) => window.localStorage.setItem(chave, "escuro"),
        TEMA_STORAGE_KEY,
      );
      await page.goto(path);

      // expect.poll (não uma checagem única logo após goto): sob
      // contenção pesada de CPU rodando a suíte inteira em paralelo, o
      // script inline beforeInteractive pode levar um instante a mais
      // para aplicar a classe — mesma categoria de flakiness de timing
      // já vista neste projeto (ex: CLS da Galeria), não um bug real de
      // corrida entre o script e a leitura do localStorage.
      await expect.poll(() => estaEscuro(page)).toBe(true);
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
      await expect(page.getByLabel("Tema do site")).toBeVisible();

      expect(errosConsole).toEqual([]);
    });
  }

  test("formulário de pedido continua funcional no modo escuro", async ({
    page,
  }) => {
    await page.addInitScript(
      (chave) => window.localStorage.setItem(chave, "escuro"),
      TEMA_STORAGE_KEY,
    );
    await page.goto("/como-encomendar");
    await expect.poll(() => estaEscuro(page)).toBe(true);

    await page
      .getByRole("heading", { name: "Faça seu pedido" })
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await page.locator("label", { hasText: "Bolo Redondo" }).click();
    await expect(
      page.getByRole("group", { name: "Bolo Redondo" }),
    ).toBeVisible();
  });
});
