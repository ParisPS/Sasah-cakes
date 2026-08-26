// O atributo `with { type: "json" }` é exigido pelo loader ESM nativo do
// Node (usado pelos testes E2E do Playwright, que rodam fora do bundler
// do Next.js/Vite) desde que o package.json declara "type": "module".
// Next.js (Turbopack) e Vitest (Vite) ignoram/aceitam o atributo — o
// import continua funcionando normalmente nos dois.
import data from "@/content/cardapio.json" with { type: "json" };

// Tipos derivados de content/cardapio.json (fonte de verdade do conteúdo,
// definida na Fase 1 — ver docs/sitemap.md). Nenhuma página deve
// hardcodar preço/produto: sempre importar deste módulo.

export type TamanhoBolo = {
  tamanho: string;
  rendimento: string;
  preco: number;
};

export type OpcaoSabores = {
  quantidadeSabores: number;
  descricao: string;
};

export type CategoriaPortfolio = "bolo-redondo" | "bolo-quadrado" | "docinho";

export type ItemPortfolio = {
  arquivo: string;
  categoria: CategoriaPortfolio;
  /** Texto alternativo descritivo, para acessibilidade (ver next/image). */
  alt: string;
};

export type Cardapio = {
  bolos: {
    redondos: TamanhoBolo[];
    quadrados: TamanhoBolo[];
    recheiosDisponiveis: string[];
  };
  docinhos: {
    quantidade: number;
    preco: number;
    opcoesDeSabores: OpcaoSabores[];
    saboresDisponiveis: string[];
  };
  comoEncomendar: {
    contato: {
      nome: string;
      telefone: string;
    };
    pagamento: string;
    entrega: string;
    antecedenciaMinima: string;
    sinal: string;
  };
  portfolio: {
    status: string;
    itens: ItemPortfolio[];
  };
};

export const cardapio = data as Cardapio;

/** Rótulo legível para cada categoria de foto do portfólio (usado no Badge). */
export const CATEGORIA_PORTFOLIO_LABELS: Record<CategoriaPortfolio, string> = {
  "bolo-redondo": "Bolo redondo",
  "bolo-quadrado": "Bolo quadrado",
  docinho: "Docinhos",
};

/** Formata um valor numérico como preço em reais (ex: 180 → "R$ 180,00"). */
export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Remove tudo que não é dígito do telefone (ex: "(21) 98200-8885" → "5521982008885"). */
export function telefoneParaWhatsApp(telefone: string): string {
  const digitos = telefone.replace(/\D/g, "");
  return `55${digitos}`;
}

/** Monta a URL wa.me com mensagem pré-preenchida a partir do telefone de contato. */
export function linkWhatsApp(
  telefone: string,
  mensagem = "Olá! Vi o site da Sasah Cakes e quero fazer uma encomenda.",
): string {
  return `https://wa.me/${telefoneParaWhatsApp(telefone)}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Tamanho "do meio" de uma lista (ex: entre os tamanhos de bolo redondo)
 * — critério objetivo para a Home escolher qual tamanho mostrar na seção
 * de produtos em destaque, sem favorecer arbitrariamente o mais caro ou
 * o mais barato. Ver docs/redesign/arquitetura.md ("3.1 Home").
 */
export function tamanhoIntermediario<T>(lista: T[]): T {
  return lista[Math.floor(lista.length / 2)];
}

/** Primeira foto do portfólio de uma categoria, na ordem em que aparece
 * em content/cardapio.json. Usada para dar uma foto representativa a um
 * produto em destaque na Home — não afirma que a foto retrata
 * exatamente aquele tamanho/preço, só ilustra a categoria. */
export function primeiraFotoDaCategoria(
  itens: ItemPortfolio[],
  categoria: CategoriaPortfolio,
): ItemPortfolio | undefined {
  return itens.find((item) => item.categoria === categoria);
}

/**
 * Amostra curada de fotos do portfólio: cobre cada categoria existente
 * pelo menos uma vez (na ordem em que a categoria aparece pela primeira
 * vez em `itens`), completando o restante pela ordem original — em vez
 * de simplesmente pegar as N primeiras fotos, o que mostraria só uma
 * categoria se ela tiver mais itens que as outras (hoje, 7 das 12 fotos
 * são de bolo redondo). Usada pela Home para a prévia da galeria (Etapa
 * 3, ver docs/redesign/arquitetura.md "3.1"), sem repetir fotos já
 * usadas em outra seção da mesma página (passe o restante via
 * `itens.filter(...)`).
 */
export function amostraCuradaPortfolio(
  itens: ItemPortfolio[],
  quantidade: number,
): ItemPortfolio[] {
  const resultado: ItemPortfolio[] = [];
  const categoriasUsadas = new Set<CategoriaPortfolio>();

  for (const item of itens) {
    if (resultado.length >= quantidade) break;
    if (!categoriasUsadas.has(item.categoria)) {
      resultado.push(item);
      categoriasUsadas.add(item.categoria);
    }
  }

  for (const item of itens) {
    if (resultado.length >= quantidade) break;
    if (!resultado.includes(item)) resultado.push(item);
  }

  return resultado;
}
