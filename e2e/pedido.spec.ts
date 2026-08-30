import { expect, test, type Locator, type Page } from "@playwright/test";
import { cardapio } from "@/lib/cardapio";
import { antecedenciaMinimaDias, dataMinimaPermitida } from "@/lib/pedido";

// Testes E2E do formulário de pedido (Fase 8, ver
// docs/fase8-formulario-pedido.md) — Issue #116, multi-categoria
// adicionada depois (ver a mesma doc). Cobre o que os testes unitários
// de lib/pedido.test.ts não cobrem: o fluxo real no navegador
// (categorias marcadas → campos condicionais de cada uma → data → nome
// → link wa.me aberto). Datas nunca são hardcodadas: derivadas de
// lib/pedido.ts, a mesma fonte de verdade que o próprio formulário usa.

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

// Marca (ou desmarca) o checkbox de uma categoria. Clica no <label>
// visível, não no <input type="checkbox"> escondido via sr-only
// (getByRole("checkbox", ...)): mesmo posicionado corretamente (ver
// nota de `relative` em components/FormularioPedido.tsx), um elemento
// de 1x1px faz o hit-test do navegador resolver o clique para o próprio
// <label> ancestral em vez do <input>, travando a espera de
// actionability do Playwright indefinidamente — artefato já visto neste
// projeto com os antigos pills de rádio. `page.getByText(label, {exact:
// true})` sozinho também não serve: cada categoria marcada abre um
// <fieldset><legend>{label}</legend> com o MESMO texto, então depois de
// marcar uma categoria `getByText` fica ambíguo (pill + legend). Filtrar
// por tag `label` evita as duas ciladas de uma vez.
function pillCategoria(page: Page, label: string): Locator {
  return page.locator("label", { hasText: label });
}

// O <fieldset><legend> aninhado de cada categoria marcada vira um grupo
// nomeado pelo texto do <legend> — escopar por ele evita ambiguidade:
// "Tamanho"/"Recheio" existem uma vez por categoria de bolo no DOM o
// tempo todo (só ficam `inert` quando a categoria não está marcada,
// nunca desmontados — RascunhoPedido preserva um "slot" por categoria),
// então `page.getByLabel("Tamanho")` sozinho bateria em mais de um
// elemento assim que qualquer categoria estiver marcada.
function grupoCategoria(page: Page, label: string): Locator {
  return page.getByRole("group", { name: label });
}

test.describe("formulário de pedido — uma categoria só (fluxo original, sem regressão)", () => {
  for (const { label, opcoes } of [
    { label: "Bolo Redondo", opcoes: cardapio.bolos.redondos },
    { label: "Bolo Quadrado", opcoes: cardapio.bolos.quadrados },
  ]) {
    test(`preenche só ${label} e abre o WhatsApp com os dados corretos`, async ({
      page,
    }) => {
      await abrirFormulario(page);

      await pillCategoria(page, label).click();

      const grupo = grupoCategoria(page, label);
      const tamanho = opcoes[0];
      await grupo.getByLabel("Tamanho").selectOption(tamanho.tamanho);
      await grupo
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
      // Formato "achatado" (não numerado): só existe quando há 1 item só.
      expect(url).not.toContain("com 2 itens");
      expect(url).not.toContain("1)");
      expect(url).toContain(`Categoria: ${label}`);
      expect(url).toContain(`Tamanho: ${tamanho.tamanho}`);
      expect(url).toContain(
        `Recheio: ${cardapio.bolos.recheiosDisponiveis[0]}`,
      );
      expect(url).toContain("Nome: Maria Teste");
    });
  }

  test("preenche só Docinhos (4 sabores, sem duplicar) e abre o WhatsApp com os dados corretos", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await pillCategoria(page, "Docinhos").click();
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

test.describe("formulário de pedido — múltiplas categorias juntas", () => {
  test("Bolo Redondo + Docinhos juntos geram uma mensagem numerada com os 2 itens", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await pillCategoria(page, "Bolo Redondo").click();
    const grupoRedondo = grupoCategoria(page, "Bolo Redondo");
    await grupoRedondo
      .getByLabel("Tamanho")
      .selectOption(cardapio.bolos.redondos[0].tamanho);
    await grupoRedondo
      .getByLabel("Recheio")
      .selectOption(cardapio.bolos.recheiosDisponiveis[0]);

    await pillCategoria(page, "Docinhos").click();
    await page.getByText(/^2 sabores/).click();
    const sabores = cardapio.docinhos.saboresDisponiveis.slice(0, 2);
    const selects = page.locator('select[id^="pedido-sabor-"]');
    await selects.nth(0).selectOption(sabores[0]);
    await selects.nth(1).selectOption(sabores[1]);

    await page.locator("#pedido-data").fill(DATA_VALIDA);
    await page.getByLabel("Nome").fill("Cliente Combo");

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "Enviar Pedido" }).click(),
    ]);

    const url = decodificarUrlFormulario(popup.url());
    expect(url).toContain("encomenda com 2 itens");
    expect(url).toContain("1) Bolo Redondo");
    expect(url).toContain(`Tamanho: ${cardapio.bolos.redondos[0].tamanho}`);
    expect(url).toContain("2) Docinhos");
    expect(url).toContain(sabores.join(", "));
    expect(url).toContain("Nome: Cliente Combo");
    // Data e nome aparecem uma única vez (compartilhados), não por item.
    expect(url.match(/Nome:/g)).toHaveLength(1);
    expect(url.match(/Data desejada:/g)).toHaveLength(1);
  });

  test("as 3 categorias juntas geram uma mensagem numerada com os 3 itens", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await pillCategoria(page, "Bolo Redondo").click();
    await grupoCategoria(page, "Bolo Redondo")
      .getByLabel("Tamanho")
      .selectOption(cardapio.bolos.redondos[0].tamanho);
    await grupoCategoria(page, "Bolo Redondo")
      .getByLabel("Recheio")
      .selectOption(cardapio.bolos.recheiosDisponiveis[0]);

    await pillCategoria(page, "Bolo Quadrado").click();
    await grupoCategoria(page, "Bolo Quadrado")
      .getByLabel("Tamanho")
      .selectOption(cardapio.bolos.quadrados[0].tamanho);
    await grupoCategoria(page, "Bolo Quadrado")
      .getByLabel("Recheio")
      .selectOption(cardapio.bolos.recheiosDisponiveis[1]);

    await pillCategoria(page, "Docinhos").click();
    await page.getByText(/^4 sabores/).click();
    const sabores = cardapio.docinhos.saboresDisponiveis.slice(0, 4);
    const selects = page.locator('select[id^="pedido-sabor-"]');
    for (let i = 0; i < sabores.length; i++) {
      await selects.nth(i).selectOption(sabores[i]);
    }

    await page.locator("#pedido-data").fill(DATA_VALIDA);
    await page.getByLabel("Nome").fill("Festa Grande");

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "Enviar Pedido" }).click(),
    ]);

    const url = decodificarUrlFormulario(popup.url());
    expect(url).toContain("encomenda com 3 itens");
    expect(url).toContain("1) Bolo Redondo");
    expect(url).toContain("2) Bolo Quadrado");
    expect(url).toContain("3) Docinhos");
    expect(url.match(/Nome:/g)).toHaveLength(1);
  });

  test("desmarcar uma categoria some com seus campos e não entra mais na mensagem", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await pillCategoria(page, "Bolo Redondo").click();
    await grupoCategoria(page, "Bolo Redondo")
      .getByLabel("Tamanho")
      .selectOption(cardapio.bolos.redondos[0].tamanho);
    await grupoCategoria(page, "Bolo Redondo")
      .getByLabel("Recheio")
      .selectOption(cardapio.bolos.recheiosDisponiveis[0]);

    await pillCategoria(page, "Bolo Quadrado").click();
    // Desmarca de novo, deixando só o Bolo Redondo.
    await pillCategoria(page, "Bolo Quadrado").click();

    await page.locator("#pedido-data").fill(DATA_VALIDA);
    await page.getByLabel("Nome").fill("Maria Teste");

    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("button", { name: "Enviar Pedido" }).click(),
    ]);

    const url = decodificarUrlFormulario(popup.url());
    expect(url).not.toContain("Bolo Quadrado");
    expect(url).not.toContain("itens"); // formato achatado, só 1 item
    expect(url).toContain("Categoria: Bolo Redondo");
  });

  test("marcar uma categoria e deixá-la incompleta mantém o botão desabilitado mesmo com outra completa", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await pillCategoria(page, "Bolo Redondo").click();
    await grupoCategoria(page, "Bolo Redondo")
      .getByLabel("Tamanho")
      .selectOption(cardapio.bolos.redondos[0].tamanho);
    await grupoCategoria(page, "Bolo Redondo")
      .getByLabel("Recheio")
      .selectOption(cardapio.bolos.recheiosDisponiveis[0]);

    // Marca Docinhos mas não escolhe quantidade/sabores — fica incompleto.
    await pillCategoria(page, "Docinhos").click();

    await page.locator("#pedido-data").fill(DATA_VALIDA);
    await page.getByLabel("Nome").fill("Maria Teste");

    await expect(
      page.getByRole("button", { name: "Enviar Pedido" }),
    ).toBeDisabled();
  });
});

test.describe("formulário de pedido — validação de data mínima", () => {
  test("data abaixo da antecedência mínima mostra erro e mantém o botão desabilitado", async ({
    page,
  }) => {
    await abrirFormulario(page);

    await pillCategoria(page, "Bolo Redondo").click();
    await grupoCategoria(page, "Bolo Redondo")
      .getByLabel("Tamanho")
      .selectOption(cardapio.bolos.redondos[0].tamanho);
    await grupoCategoria(page, "Bolo Redondo")
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
