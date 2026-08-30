import { expect, test, type Page } from "@playwright/test";
import { cardapio } from "@/lib/cardapio";
import { antecedenciaMinimaDias, dataMinimaPermitida } from "@/lib/pedido";

// Testes E2E do formulário de pedido (Fase 8, ver
// docs/fase8-formulario-pedido.md) — Issue #116. Cobre o que os testes
// unitários de lib/pedido.test.ts não cobrem: o fluxo real no navegador
// (categoria → campos condicionais → data → nome → link wa.me aberto).
// Datas nunca são hardcodadas: derivadas de lib/pedido.ts, a mesma fonte
// de verdade que o próprio formulário usa.

function hojeISO(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

const DATA_VALIDA = dataMinimaPermitida(); // limite exato — ainda válida
const DATA_INVALIDA = hojeISO(); // hoje é sempre < antecedência mínima

// wa.me redireciona para api.whatsapp.com re-codificando espaços como
// "+" (convenção application/x-www-form-urlencoded) em vez de "%20" —
// decodeURIComponent por si só não trata "+" como espaço (só faz isso
// para sequências %XX), então sem esse replace antes as asserções de
// texto (com espaço de verdade) nunca bateriam com a URL final.
function decodificarUrlFormulario(url: string): string {
  return decodeURIComponent(url.replace(/\+/g, " "));
}

// O card "Faça seu pedido" (FormularioPedido) começa fora da viewport
// inicial (abaixo dos 4 passos) e é revelado via RevealOnScroll
// (docs/design/motion-principles.md) — só fica com opacidade/posição
// finais depois que o IntersectionObserver dispara ao entrar na
// viewport. Interagir com os campos antes disso pode competir com essa
// transição (mesma categoria de artefato já documentada neste projeto
// para RevealOnScroll sob automação). Rolar até o formulário e esperar
// a transição (duration-500) assentar evita isso.
async function abrirFormulario(page: Page) {
  await page.goto("/como-encomendar");
  await page
    .getByRole("heading", { name: "Faça seu pedido" })
    .scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
}

test.describe("formulário de pedido — bolo (redondo e quadrado)", () => {
  for (const { label, opcoes } of [
    { label: "Bolo Redondo", opcoes: cardapio.bolos.redondos },
    { label: "Bolo Quadrado", opcoes: cardapio.bolos.quadrados },
  ]) {
    test(`preenche ${label} e abre o WhatsApp com os dados corretos`, async ({
      page,
    }) => {
      await abrirFormulario(page);

      await page.getByText(label, { exact: true }).click();

      const tamanho = opcoes[0];
      await page.getByLabel("Tamanho").selectOption(tamanho.tamanho);
      await page
        .getByLabel("Recheio")
        .selectOption(cardapio.bolos.recheiosDisponiveis[0]);
      await page.locator("#pedido-data").fill(DATA_VALIDA);
      await page.getByLabel("Nome").fill("Maria Teste");

      const botao = page.getByRole("button", { name: "Enviar Pedido" });
      await expect(botao).toBeEnabled();

      const [popup] = await Promise.all([
        page.waitForEvent("popup"),
        botao.click(),
      ]);

      const url = decodificarUrlFormulario(popup.url());
      expect(url).toContain(
        `phone=55${cardapio.comoEncomendar.contato.telefone.replace(/\D/g, "")}`,
      );
      expect(url).toContain(`Categoria: ${label}`);
      expect(url).toContain(`Tamanho: ${tamanho.tamanho}`);
      expect(url).toContain(
        `Recheio: ${cardapio.bolos.recheiosDisponiveis[0]}`,
      );
      expect(url).toContain("Nome: Maria Teste");
    });
  }
});

test.describe("formulário de pedido — docinhos", () => {
  test("preenche docinhos com 4 sabores sem duplicar e abre o WhatsApp com os dados corretos", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await page.getByText("Docinhos", { exact: true }).click();
    await page.getByText(/^4 sabores/).click();

    const sabores = cardapio.docinhos.saboresDisponiveis.slice(0, 4);
    const selects = page.locator('select[id^="pedido-sabor-"]');
    for (let i = 0; i < sabores.length; i++) {
      await selects.nth(i).selectOption(sabores[i]);
    }

    // O sabor já escolhido no 1º select não pode mais aparecer como
    // opção nos demais (regra de "sem sabor duplicado").
    const opcoesRestantes = await selects
      .nth(1)
      .locator("option")
      .allTextContents();
    expect(opcoesRestantes).not.toContain(sabores[0]);

    await page.locator("#pedido-data").fill(DATA_VALIDA);
    await page.getByLabel("Nome").fill("Ana Teste");

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "Enviar Pedido" }).click(),
    ]);

    const url = decodificarUrlFormulario(popup.url());
    expect(url).toContain("Categoria: Docinhos");
    expect(url).toContain(sabores.join(", "));
    expect(url).toContain("Nome: Ana Teste");
  });
});

test.describe("formulário de pedido — validação de data mínima", () => {
  test("data abaixo da antecedência mínima mostra erro e mantém o botão desabilitado", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await page.getByText("Bolo Redondo", { exact: true }).click();
    await page
      .getByLabel("Tamanho")
      .selectOption(cardapio.bolos.redondos[0].tamanho);
    await page
      .getByLabel("Recheio")
      .selectOption(cardapio.bolos.recheiosDisponiveis[0]);
    await page.getByLabel("Nome").fill("Maria Teste");

    await page.locator("#pedido-data").fill(DATA_INVALIDA);

    // Não usa getByRole("alert") sozinho: o próprio Next.js injeta um
    // route-announcer com role="alert" em toda página (acessibilidade
    // de troca de rota), o que tornaria o locator ambíguo. O erro do
    // campo tem id próprio (usado no aria-describedby do input).
    const erroData = page.locator("#pedido-data-erro");
    await expect(erroData).toHaveText(
      `Encomendas precisam de no mínimo ${antecedenciaMinimaDias()} dias de antecedência.`,
    );
    await expect(
      page.getByRole("button", { name: "Enviar Pedido" }),
    ).toBeDisabled();

    // Corrigindo a data, o erro some e o botão volta a ficar habilitado.
    await page.locator("#pedido-data").fill(DATA_VALIDA);
    await expect(erroData).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Enviar Pedido" }),
    ).toBeEnabled();
  });
});

test.describe("botão genérico de dúvidas (CTA secundário)", () => {
  test("continua funcional e aponta para o WhatsApp de contato", async ({
    page,
  }) => {
    await page.goto("/como-encomendar");

    const link = page.getByRole("link", {
      name: /prefere só tirar uma dúvida/i,
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      new RegExp(cardapio.comoEncomendar.contato.telefone.replace(/\D/g, "")),
    );
  });
});
