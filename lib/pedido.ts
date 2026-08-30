import { cardapio } from "@/lib/cardapio";

// Formulário de pedido (Fase 8, ver docs/fase8-formulario-pedido.md) —
// monta uma mensagem de WhatsApp a partir dos dados preenchidos. Nenhum
// dado é inventado aqui: categorias, tamanhos, recheios e sabores só
// existem porque vêm de content/cardapio.json via lib/cardapio.ts. Sem
// backend, API route ou persistência — tudo roda no navegador do
// cliente (ver docs/fase8-formulario-pedido.md, "Por que sem backend").

export type CategoriaPedido = "bolo-redondo" | "bolo-quadrado" | "docinhos";

/** Rótulo legível de cada categoria do formulário de pedido. Domínio
 * próprio (não reaproveita CATEGORIA_PORTFOLIO_LABELS de lib/cardapio.ts):
 * o portfólio usa "docinho" (singular, é o rótulo de UMA foto), aqui é
 * "docinhos" (a categoria inteira, como o cliente escolhe no formulário). */
export const LABEL_CATEGORIA_PEDIDO: Record<CategoriaPedido, string> = {
  "bolo-redondo": "Bolo Redondo",
  "bolo-quadrado": "Bolo Quadrado",
  docinhos: "Docinhos",
};

/** Limite de caracteres do campo opcional de observações/tema do bolo. */
export const OBSERVACOES_MAX_LENGTH = 300;

export type DadosPedidoBolo = {
  categoria: "bolo-redondo" | "bolo-quadrado";
  tamanho: string;
  recheio: string;
  dataDesejada: string;
  nome: string;
  observacoes?: string;
};

export type DadosPedidoDocinhos = {
  categoria: "docinhos";
  quantidadeSabores: 2 | 4;
  sabores: string[];
  dataDesejada: string;
  nome: string;
  observacoes?: string;
};

/** Dados de um pedido já completo e válido — só existe depois de passar
 * por `normalizarRascunho`. `dataDesejada` no formato ISO `yyyy-mm-dd`
 * (mesmo formato do valor de um <input type="date">). */
export type DadosPedido = DadosPedidoBolo | DadosPedidoDocinhos;

/** Estado do formulário enquanto o cliente ainda está preenchendo —
 * todos os campos começam vazios/nulos, mesmo os obrigatórios. Nunca é
 * usado para montar a mensagem diretamente: primeiro passa por
 * `normalizarRascunho`, que só devolve um `DadosPedido` quando tudo que
 * é obrigatório está preenchido e válido. */
export type RascunhoPedido = {
  categoria: CategoriaPedido | "";
  tamanho: string;
  recheio: string;
  quantidadeSabores: 2 | 4 | null;
  /** Um item por sabor escolhido, na ordem dos campos do formulário. */
  sabores: string[];
  dataDesejada: string;
  nome: string;
  observacoes: string;
};

export const RASCUNHO_PEDIDO_VAZIO: RascunhoPedido = {
  categoria: "",
  tamanho: "",
  recheio: "",
  quantidadeSabores: null,
  sabores: [],
  dataDesejada: "",
  nome: "",
  observacoes: "",
};

/** Extrai o número de dias de `comoEncomendar.antecedenciaMinima` (ex:
 * "4 dias" → 4) em vez de hardcodar o número de novo — se o valor real
 * do negócio mudar em content/cardapio.json, a validação acompanha sem
 * precisar editar código. Cai para 4 só se o texto não tiver nenhum
 * dígito (nunca deveria acontecer com o conteúdo real do projeto). */
export function antecedenciaMinimaDias(): number {
  const match = cardapio.comoEncomendar.antecedenciaMinima.match(/\d+/);
  return match ? Number(match[0]) : 4;
}

/** yyyy-mm-dd de uma data, na hora LOCAL de quem está preenchendo o
 * formulário (não UTC) — precisa bater com o valor que o navegador dá
 * para um <input type="date"> e com a ideia de "hoje" de quem está
 * escolhendo a data. */
function paraISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** Primeira data (yyyy-mm-dd) permitida para retirada, dado "hoje" —
 * usada tanto para validar quanto para o atributo `min` do campo de
 * data no formulário (evita nem deixar o cliente abrir o calendário e
 * escolher uma data que já sabemos que será rejeitada). */
export function dataMinimaPermitida(hoje: Date = new Date()): string {
  const data = new Date(hoje);
  data.setDate(data.getDate() + antecedenciaMinimaDias());
  return paraISO(data);
}

/** Converte yyyy-mm-dd para dd/mm/aaaa (formato de exibição da mensagem
 * e da UI) sem passar por `Date`/fuso horário — comparar strings ISO
 * diretamente evita o clássico bug de off-by-one-dia de `new
 * Date("yyyy-mm-dd")` (interpretada como UTC meia-noite). */
export function formatarDataBR(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

export type ValidacaoData = { valida: true } | { valida: false; erro: string };

/** Valida a data desejada contra a antecedência mínima do negócio.
 * Comparação puramente textual (strings ISO `yyyy-mm-dd` comparam na
 * ordem certa com `<`/`>`, sem precisar de `Date`) — evita qualquer
 * ambiguidade de fuso horário entre "hoje" e a data escolhida. */
export function validarDataDesejada(
  dataISO: string,
  hoje: Date = new Date(),
): ValidacaoData {
  if (!dataISO) {
    return { valida: false, erro: "Escolha a data desejada." };
  }

  const minima = dataMinimaPermitida(hoje);
  if (dataISO < minima) {
    return {
      valida: false,
      erro: `Encomendas precisam de no mínimo ${antecedenciaMinimaDias()} dias de antecedência.`,
    };
  }

  return { valida: true };
}

/** Valida e normaliza um rascunho em preenchimento para um pedido
 * completo — devolve `null` se qualquer campo obrigatório (dependendo
 * da categoria) estiver faltando, com data inválida, ou com sabores
 * duplicados/incompletos. É a única porta de entrada para produzir um
 * `DadosPedido`: nem a UI nem os testes montam esse tipo à mão. */
export function normalizarRascunho(
  rascunho: RascunhoPedido,
  hoje: Date = new Date(),
): DadosPedido | null {
  const nome = rascunho.nome.trim();
  if (!rascunho.categoria || !nome) return null;
  if (!validarDataDesejada(rascunho.dataDesejada, hoje).valida) return null;

  const observacoes = rascunho.observacoes.trim() || undefined;

  if (rascunho.categoria === "docinhos") {
    if (!rascunho.quantidadeSabores) return null;

    const sabores = rascunho.sabores.map((s) => s.trim()).filter(Boolean);
    if (sabores.length !== rascunho.quantidadeSabores) return null;
    if (new Set(sabores).size !== sabores.length) return null; // sabor repetido

    return {
      categoria: "docinhos",
      quantidadeSabores: rascunho.quantidadeSabores,
      sabores,
      dataDesejada: rascunho.dataDesejada,
      nome,
      observacoes,
    };
  }

  const tamanho = rascunho.tamanho.trim();
  const recheio = rascunho.recheio.trim();
  if (!tamanho || !recheio) return null;

  return {
    categoria: rascunho.categoria,
    tamanho,
    recheio,
    dataDesejada: rascunho.dataDesejada,
    nome,
    observacoes,
  };
}

/** Monta a mensagem de texto do pedido, na ordem: saudação, categoria e
 * detalhes (tamanho/recheio ou sabores), data desejada, observações (se
 * houver) e nome — pronta para virar o `text` de um link `wa.me` (ver
 * `linkWhatsApp` em lib/cardapio.ts). Só aceita um `DadosPedido` já
 * validado por `normalizarRascunho` — não faz nenhuma validação própria. */
export function montarMensagemPedido(dados: DadosPedido): string {
  const linhas = [
    "Olá! Gostaria de fazer uma encomenda:",
    "",
    `Categoria: ${LABEL_CATEGORIA_PEDIDO[dados.categoria]}`,
  ];

  if (dados.categoria === "docinhos") {
    const opcao = cardapio.docinhos.opcoesDeSabores.find(
      (o) => o.quantidadeSabores === dados.quantidadeSabores,
    );
    const detalheQuantidade = opcao
      ? `${dados.quantidadeSabores} sabores (${opcao.descricao})`
      : `${dados.quantidadeSabores} sabores`;
    linhas.push(`Sabores: ${detalheQuantidade} — ${dados.sabores.join(", ")}`);
  } else {
    linhas.push(`Tamanho: ${dados.tamanho}`, `Recheio: ${dados.recheio}`);
  }

  linhas.push(`Data desejada: ${formatarDataBR(dados.dataDesejada)}`);

  if (dados.observacoes) {
    linhas.push(`Observações: ${dados.observacoes}`);
  }

  linhas.push(`Nome: ${dados.nome}`);

  return linhas.join("\n");
}
