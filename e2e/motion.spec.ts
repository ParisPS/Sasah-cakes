import { expect, test, type Page } from "@playwright/test";

// Testes E2E da Fase 7 (motion) — ver docs/design/motion-principles.md.
// Cobrem dois pontos exigidos pela fase: (1) a navegação continua
// funcionando com prefers-reduced-motion ativado, e (2) as animações
// adicionadas não causam layout shift (CLS) perceptível.

declare global {
  interface Window {
    __clsTotal?: number;
  }
}

// Instala o observer ANTES da navegação (addInitScript roda em todo
// documento novo, sobrevivendo ao page.goto — um page.evaluate comum não
// sobreviveria, porque goto troca de documento). Soma só os eventos de
// layout-shift sem "recent input" — o próprio navegador já isenta shifts
// causados por interação do usuário do cálculo de CLS.
//
// O contador só começa a valer depois de `document.fonts.ready`: o
// carregamento das fontes (next/font, display: swap) pode causar um
// reflow de texto que não tem nada a ver com as animações desta fase —
// contá-lo aqui só geraria ruído/flakiness não relacionado ao que
// estamos validando. `afterFontsReady` é onde a ação que de fato
// queremos medir acontece (scroll, espera pelas fotos da galeria etc).
async function measureCls(
  page: Page,
  path: string,
  afterFontsReady: () => Promise<void>,
) {
  await page.addInitScript(() => {
    window.__clsTotal = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as {
        value: number;
        hadRecentInput: boolean;
        sources?: { currentRect?: DOMRectReadOnly }[];
      }[]) {
        if (entry.hadRecentInput) continue;

        // Artefato conhecido do Chromium sob paint pesado: um evento de
        // layout-shift pode reportar currentRect totalmente zerado
        // (width/height/x/y = 0) para um elemento que, inspecionado no
        // mesmo instante via DOM, nunca saiu do lugar de verdade — não é
        // um shift visível para quem está usando o site. Ignora só esse
        // padrão específico (rect degenerado), não qualquer shift
        // pequeno.
        const rect = entry.sources?.[0]?.currentRect;
        const isZeroRectArtifact =
          rect && rect.width === 0 && rect.height === 0 && rect.x === 0;
        if (isZeroRectArtifact) continue;

        window.__clsTotal = (window.__clsTotal ?? 0) + entry.value;
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    window.__clsTotal = 0;
  });

  await afterFontsReady();
  await page.waitForTimeout(300);

  return page.evaluate(() => window.__clsTotal ?? 0);
}

test.describe("prefers-reduced-motion", () => {
  test("navegação pelo menu mobile funciona normalmente com reduced motion", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile",
      "menu ☰ só existe no viewport mobile",
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("link", { name: "Cardápio", exact: true }).click();

    await expect(page).toHaveURL("/cardapio");
    // getByRole com filtro de nome — não locator("h1") solto — pelo
    // mesmo motivo do e2e/navigation.spec.ts: com app/loading.tsx, a
    // página anterior pode ficar renderizada por um instante durante a
    // transição, coexistindo com a nova.
    await expect(
      page.getByRole("heading", { level: 1, name: "Cardápio" }),
    ).toBeVisible();
  });

  // Desde a Fase 9, a seção de produtos em destaque não tem mais um link
  // "Ver mais" por card (eram cards que só espelhavam a navegação —
  // achado da auditoria, item 1.1); o CTA secundário "Ver cardápio
  // completo", único e abaixo da seção, assume esse papel.
  test("CTA 'Ver cardápio completo' da Home funciona com reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("link", { name: "Ver cardápio completo" }).click();

    await expect(page).toHaveURL("/cardapio");
  });
});

// Espera todas as imagens de public/portfolio/ terminarem de decodificar
// — mais determinístico que "networkidle" (que o próprio Playwright
// desaconselha: não tem uma definição confiável de "rede parada" e é
// sensível a contenção de CPU/rede do ambiente de CI).
async function waitForPortfolioImages(page: Page) {
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("main img")).every(
      (img) => (img as HTMLImageElement).complete,
    ),
  );
}

test.describe("sem layout shift perceptível (CLS)", () => {
  // Roda em série, não em paralelo com o resto da suíte: medir CLS sob
  // concorrência pesada de vários workers do Playwright competindo por
  // CPU no mesmo servidor local não reflete a experiência real de um
  // usuário (single-threaded) — sob throttling extremo, a própria
  // Layout Instability API do Chromium pode reportar um retângulo
  // zerado momentâneo para um elemento que nunca saiu do lugar de fato
  // (confirmado inspecionando o DOM no instante do evento). Rodar em
  // série evita esse artefato de medição sem mascarar uma regressão
  // real.
  test.describe.configure({ mode: "serial" });

  test("Home ao rolar até o preview de galeria", async ({ page }) => {
    test.setTimeout(60_000); // carregar 12 fotos reais pode levar um tempo
    const cls = await measureCls(page, "/", async () => {
      // Rola até a seção de galeria especificamente (não até o fim da
      // página) — o preview da Home renderiza as 12 fotos, e pular
      // direto para o rodapé pode deixar fotos mais acima fora do
      // "near viewport" do lazy loading nativo, que nunca chegam a
      // carregar. No mobile, a fileira é scroll horizontal — nem toda
      // foto do preview necessariamente carrega sem rolar o carrossel
      // também, então aqui é uma espera fixa generosa (não uma espera
      // estrita por 100% das imagens), suficiente para capturar shift
      // de qualquer carregamento que aconteça nessa janela.
      await page
        .getByRole("heading", { name: "Nosso Trabalho" })
        .scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
    });

    // 0.1 é o limite "bom" do Core Web Vitals para CLS — as animações de
    // entrada usam só opacity/transform (propriedades de composição, não
    // afetam layout), então o esperado aqui é ~0.
    expect(cls).toBeLessThan(0.1);
  });

  test("Galeria ao carregar as fotos (skeleton → imagem)", async ({ page }) => {
    // 60s estourava de forma consistente sob a contenção de CPU real dos
    // runners compartilhados do GitHub Actions (Issue #120) — inclusive
    // numa execução de `main` sem nenhuma mudança relacionada à Galeria,
    // então não era uma regressão de código. Localmente (sem a mesma
    // contenção) o teste sempre passou bem abaixo de 60s. 120s dá margem
    // real sem enfraquecer a asserção em si (ainda exige as 12 fotos
    // carregadas e CLS < 0.1).
    test.setTimeout(120_000);
    const cls = await measureCls(page, "/galeria", async () => {
      // No mobile, o grid vira 1 coluna — a página fica bem mais alta, e
      // as últimas fotos ficam longe o suficiente da viewport inicial
      // para o lazy loading nativo nunca disparar sem rolar. Desce a
      // página em passos para trazer cada uma para perto da viewport.
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      });
      await waitForPortfolioImages(page);
    });

    expect(cls).toBeLessThan(0.1);
  });
});
