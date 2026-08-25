import data from "@/content/cardapio.json";

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

export type ItemPortfolio = {
  arquivo: string;
  categoria: string;
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
