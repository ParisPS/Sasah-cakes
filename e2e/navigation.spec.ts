import { expect, test, type Page } from "@playwright/test";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";

// Docinhos e Contato saíram como páginas próprias na Fase 9 (redesign de
// marca) — Docinhos virou seção de /cardapio, Contato foi absorvido por
// /como-encomendar. Ver docs/redesign/arquitetura.md "1".
const PAGINAS = [
  {
    path: "/",
    label: null,
    heading: "Bolos e docinhos feitos à mão, com carinho",
  },
  { path: "/cardapio", label: "Cardápio", heading: "Cardápio" },
  {
    path: "/como-encomendar",
    label: "Como Encomendar",
    heading: "Como Encomendar",
  },
  { path: "/galeria", label: "Galeria", heading: "Nosso Trabalho" },
];

// No mobile, os links de navegação só entram na árvore de acessibilidade
// depois de abrir o menu (☰) — no desktop já ficam visíveis inline. Ver
// components/Header.tsx.
async function abrirMenuSeMobile(page: Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }
}

test.describe("navegação entre páginas via header", () => {
  for (const destino of PAGINAS.filter((p) => p.label)) {
    test(`menu leva até ${destino.label}`, async ({ page }) => {
      await page.goto("/");
      await abrirMenuSeMobile(page);
      await page
        .getByRole("link", { name: destino.label!, exact: true })
        .click();

      await expect(page).toHaveURL(destino.path);
      // getByRole (não locator("h1") solto): com app/loading.tsx (Fase 7),
      // o Next.js pode manter a página anterior renderizada por um
      // instante enquanto a nova carrega — nessa janela, dois <h1>
      // coexistem no DOM. Filtrar por nome evita o "strict mode
      // violation" de pegar os dois.
      await expect(
        page.getByRole("heading", { level: 1, name: destino.heading }),
      ).toBeVisible();
    });
  }

  test("logo 'Sasah Cakes' sempre volta para a Home", async ({ page }) => {
    await page.goto("/como-encomendar");
    await page.getByRole("link", { name: "Sasah Cakes" }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("redirects de páginas removidas (Fase 9)", () => {
  test("/docinhos redireciona para a seção Docinhos do Cardápio", async ({
    page,
  }) => {
    await page.goto("/docinhos");
    await expect(page).toHaveURL("/cardapio#docinhos");
    await expect(
      page.getByRole("heading", { level: 2, name: "Docinhos" }),
    ).toBeVisible();
  });

  test("/contato redireciona para Como Encomendar", async ({ page }) => {
    await page.goto("/contato");
    await expect(page).toHaveURL("/como-encomendar");
    await expect(
      page.getByRole("heading", { level: 1, name: "Como Encomendar" }),
    ).toBeVisible();
  });
});

test.describe("rodapé não duplica conteúdo da página (Fase 9)", () => {
  // Achado da auditoria, item 1.4: em Como Encomendar a própria página já
  // mostra nome/telefone/WhatsApp em destaque — o rodapé não repete. Ver
  // components/Footer.tsx e docs/redesign/arquitetura.md "3.5".
  test("rodapé de /como-encomendar não repete o link de WhatsApp", async ({
    page,
  }) => {
    await page.goto("/como-encomendar");
    const rodape = page.locator("footer");

    await expect(
      rodape.getByRole("link", { name: /fale no whatsapp/i }),
    ).toHaveCount(0);
    await expect(rodape.getByText("Sasah Cakes").first()).toBeVisible();
  });

  test("rodapé de /cardapio mostra o link de WhatsApp normalmente", async ({
    page,
  }) => {
    await page.goto("/cardapio");
    const rodape = page.locator("footer");

    await expect(
      rodape.getByRole("link", { name: /fale no whatsapp/i }),
    ).toBeVisible();
  });
});

test.describe("botão flutuante de WhatsApp", () => {
  const linkEsperado = linkWhatsApp(cardapio.comoEncomendar.contato.telefone);

  for (const pagina of PAGINAS) {
    test(`presente e com link correto em ${pagina.path}`, async ({ page }) => {
      await page.goto(pagina.path);
      const botao = page.getByTestId("whatsapp-float");
      await expect(botao).toBeVisible();
      await expect(botao).toHaveAttribute("href", linkEsperado);
      await expect(botao).toHaveAttribute("target", "_blank");
    });
  }
});
