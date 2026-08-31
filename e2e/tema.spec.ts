import { expect, test, type Page } from "@playwright/test";
import { TEMA_STORAGE_KEY } from "@/lib/tema";

// Testes E2E do dark mode (Fase 11) — Issue #132; toggle de ícone único
// com morph sol/lua (Fase 11.1) — Issue #135. Cobre: o toggle troca de
// tema de verdade (classe `dark` em <html>), o aria-label descreve a
// ação e atualiza a cada clique, a escolha persiste ao recarregar, o
// morph de hover tem equivalente em :focus-visible (teclado), e cada
// página principal renderiza sem quebra visual/de layout no modo
// escuro (sem confiar só em screenshot manual — ver
// docs/design/design-tokens.md "Dark mode" para a auditoria de
// contraste completa, feita à parte com um script de contraste, não
// aqui).

async function estaEscuro(page: Page): Promise<boolean> {
  return page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
}

function botaoTema(page: Page) {
  return page.getByRole("button", { name: /mudar para modo/i });
}

test.describe("toggle de tema", () => {
  test("clicar alterna o tema e atualiza o aria-label pra descrever a próxima ação", async ({
    page,
  }) => {
    await page.goto("/");
    const botao = botaoTema(page);

    // Sem emular color-scheme, o padrão do navegador em teste é
    // "claro" — aria-label descreve a ação de MUDAR (ir pro escuro).
    await expect(botao).toHaveAttribute("aria-label", "Mudar para modo escuro");
    await expect.poll(() => estaEscuro(page)).toBe(false);

    await botao.click();
    await expect.poll(() => estaEscuro(page)).toBe(true);
    await expect(botao).toHaveAttribute("aria-label", "Mudar para modo claro");

    await botao.click();
    await expect.poll(() => estaEscuro(page)).toBe(false);
    await expect(botao).toHaveAttribute("aria-label", "Mudar para modo escuro");
  });

  test("a escolha manual persiste ao recarregar a página", async ({ page }) => {
    await page.goto("/");
    await botaoTema(page).click();
    await expect.poll(() => estaEscuro(page)).toBe(true);

    await page.reload();

    // A classe já deve estar aplicada mesmo antes de qualquer interação
    // — é o script inline (beforeInteractive) que faz isso, não o
    // componente React (que só assume depois de montado).
    await expect.poll(() => estaEscuro(page)).toBe(true);
    await expect(botaoTema(page)).toHaveAttribute(
      "aria-label",
      "Mudar para modo claro",
    );

    // Volta para claro, pra não vazar estado entre testes que
    // reutilizem o mesmo localStorage (contextos de teste não
    // compartilham storage entre si por padrão, mas fica explícito).
    await botaoTema(page).click();
  });

  test("com o sistema operacional preferindo escuro e nenhuma escolha salva, o site abre escuro", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");

    await expect.poll(() => estaEscuro(page)).toBe(true);
    // Já começa escuro (seguindo o sistema) — a ação oferecida é ir
    // pro claro.
    await expect(botaoTema(page)).toHaveAttribute(
      "aria-label",
      "Mudar para modo claro",
    );

    await context.close();
  });

  test(":focus-visible (navegação por teclado) aciona o mesmo morph do hover", async ({
    page,
  }) => {
    await page.goto("/");
    const botao = botaoTema(page);

    // Ícone de repouso é o SVG cujo pai imediato tem opacity-100 —
    // localizado pelo próprio atributo de classe, já que os dois SVGs
    // (repouso/prévia) não têm outro identificador. Em vez de inspecionar
    // classe diretamente, confirma o efeito real: o par
    // transform/opacity muda de estado quando o botão fica focado.
    const svgs = botao.locator("svg");
    const opacidadeRepouso = await svgs
      .nth(0)
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacidadeRepouso).toBe("1");

    await page.keyboard.press("Tab"); // garante que algo tenha foco antes
    await botao.focus();
    // .focus() programático nem sempre aciona :focus-visible no
    // Chromium — mas como o teste já rodou um Tab real na página antes
    // (linha acima), o "input modality" fica marcado como teclado,
    // então o focus subsequente é tratado como :focus-visible aqui.
    await page.waitForTimeout(350); // duration-300 do morph

    const opacidadeIconeRepousoNoFoco = await svgs
      .nth(0)
      .evaluate((el) => getComputedStyle(el).opacity);
    const opacidadeIconePreviewNoFoco = await svgs
      .nth(1)
      .evaluate((el) => getComputedStyle(el).opacity);

    // Com foco, o ícone de repouso esconde e o de prévia aparece —
    // igual ao hover.
    expect(Number(opacidadeIconeRepousoNoFoco)).toBeLessThan(0.5);
    expect(Number(opacidadeIconePreviewNoFoco)).toBeGreaterThan(0.5);
  });

  test("prefers-reduced-motion desativa a animação do morph (troca vira instantânea)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const svg = botaoTema(page).locator("svg").first();
    // motion-reduce:transition-none define transition-property: none —
    // duration continua "definida" (a mesma classe duration-300), mas
    // sem propriedade nenhuma pra transicionar, nada anima de fato.
    await expect(svg).toHaveCSS("transition-property", "none");

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
      await expect(botaoTema(page)).toBeVisible();

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
