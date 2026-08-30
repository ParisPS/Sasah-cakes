import { cardapio } from "@/lib/cardapio";

// Formulário de pedido (Fase 8, ver docs/fase8-formulario-pedido.md;
// multi-categoria adicionada depois, ver a mesma doc) — monta uma
// mensagem de WhatsApp a partir dos dados preenchidos. Nenhum dado é
// inventado aqui: categorias, tamanhos, recheios e sabores só existem
// porque vêm de content/cardapio.json via lib/cardapio.ts. Sem backend,
// API route ou persistência — tudo roda no navegador do cliente (ver
// docs/fase8-formulario-pedido.md, "Por que sem backend").

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

export type ItemPedidoBolo = {
  categoria: "bolo-redondo" | "bolo-quadrado";
  tamanho: string;
  recheio: string;
};

export type ItemPedidoDocinhos = {
  categoria: "docinhos";
  quantidadeSabores: 2 | 4;
  sabores: string[];
};

/** Um produto dentro do pedido. Uma encomenda pode ter até um item por
 * categoria (ex: um Bolo Redondo + um Docinhos), nunca dois itens da
 * mesma categoria — ver `RascunhoPedido`, que reflete isso tendo um
 * único "slot" por categoria em vez de uma lista livre. */
export type ItemPedido = ItemPedidoBolo | ItemPedidoDocinhos;

/** Dados de um pedido já completo e válido — só existe depois de passar
 * por `normalizarRascunho`. `dataDesejada`, `nome` e `observacoes` são
 * únicos e compartilhados por todo o pedido (uma só data de retirada,
 * um só pedido) mesmo quando `itens` tem mais de um produto.
 * `dataDesejada` no formato ISO `yyyy-mm-dd` (mesmo formato do valor de
 * um <input type="date">). */
export type DadosPedido = {
  /** Sempre não-vazio — `normalizarRascunho` devolve `null` se nenhuma
   * categoria estiver marcada. */
  itens: ItemPedido[];
  dataDesejada: string;
  nome: string;
  observacoes?: string;
};

export type RascunhoItemBolo = {
  marcado: boolean;
  tamanho: string;
  recheio: string;
};

export type RascunhoItemDocinhos = {
  marcado: boolean;
  quantidadeSabores: 2 | 4 | null;
  /** Um item por sabor escolhido, na ordem dos campos do formulário. */
  sabores: string[];
};

/** Estado do formulário enquanto o cliente ainda está preenchendo. Cada
 * categoria tem seu próprio "slot" independente (`marcado` + seus
 * campos), em vez de um único campo `categoria` compartilhado — é assim
 * que várias categorias marcadas ao mesmo tempo convivem no mesmo
 * rascunho. Nunca é usado para montar a mensagem diretamente: primeiro
 * passa por `normalizarRascunho`, que só devolve um `DadosPedido`
 * quando pelo menos uma categoria está marcada e totalmente preenchida. */
export type RascunhoPedido = {
  bolosRedondo: RascunhoItemBolo;
  bolosQuadrado: RascunhoItemBolo;
  docinhos: RascunhoItemDocinhos;
  dataDesejada: string;
  nome: string;
  observacoes: string;
};

export const RASCUNHO_PEDIDO_VAZIO: RascunhoPedido = {
  bolosRedondo: { marcado: false, tamanho: "", recheio: "" },
  bolosQuadrado: { marcado: false, tamanho: "", recheio: "" },
  docinhos: { marcado: false, quantidadeSabores: null, sabores: [] },
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

function normalizarItemBolo(
  categoria: "bolo-redondo" | "bolo-quadrado",
  slot: RascunhoItemBolo,
): ItemPedidoBolo | null {
  const tamanho = slot.tamanho.trim();
  const recheio = slot.recheio.trim();
  if (!tamanho || !recheio) return null;
  return { categoria, tamanho, recheio };
}

function normalizarItemDocinhos(
  slot: RascunhoItemDocinhos,
): ItemPedidoDocinhos | null {
  if (!slot.quantidadeSabores) return null;

  const sabores = slot.sabores.map((s) => s.trim()).filter(Boolean);
  if (sabores.length !== slot.quantidadeSabores) return null;
  if (new Set(sabores).size !== sabores.length) return null; // sabor repetido

  return {
    categoria: "docinhos",
    quantidadeSabores: slot.quantidadeSabores,
    sabores,
  };
}

/** Valida e normaliza um rascunho em preenchimento para um pedido
 * completo — devolve `null` se: nenhuma categoria estiver marcada; a
 * data estiver inválida; o nome estiver vazio; ou qualquer categoria
 * MARCADA estiver com campos obrigatórios faltando (marcar uma
 * categoria e deixá-la pela metade invalida o pedido inteiro, não só
 * aquele item — evita enviar uma mensagem incompleta sem o cliente
 * perceber). É a única porta de entrada para produzir um `DadosPedido`:
 * nem a UI nem os testes montam esse tipo à mão. */
export function normalizarRascunho(
  rascunho: RascunhoPedido,
  hoje: Date = new Date(),
): DadosPedido | null {
  const nome = rascunho.nome.trim();
  if (!nome) return null;
  if (!validarDataDesejada(rascunho.dataDesejada, hoje).valida) return null;

  const itens: ItemPedido[] = [];

  for (const [categoria, slot] of [
    ["bolo-redondo", rascunho.bolosRedondo],
    ["bolo-quadrado", rascunho.bolosQuadrado],
  ] as const) {
    if (!slot.marcado) continue;
    const item = normalizarItemBolo(categoria, slot);
    if (!item) return null; // marcado mas incompleto
    itens.push(item);
  }

  if (rascunho.docinhos.marcado) {
    const item = normalizarItemDocinhos(rascunho.docinhos);
    if (!item) return null;
    itens.push(item);
  }

  if (itens.length === 0) return null; // nenhuma categoria marcada

  return {
    itens,
    dataDesejada: rascunho.dataDesejada,
    nome,
    observacoes: rascunho.observacoes.trim() || undefined,
  };
}

/** Linhas de detalhe de um único item (sem a saudação/data/nome, que
 * são do pedido inteiro, não do item). Reaproveitada tanto no caso de
 * um único item (formato "achatado", igual ao de antes da
 * multi-categoria) quanto no de vários itens (formato numerado). */
function linhasItem(item: ItemPedido): string[] {
  if (item.categoria === "docinhos") {
    const opcao = cardapio.docinhos.opcoesDeSabores.find(
      (o) => o.quantidadeSabores === item.quantidadeSabores,
    );
    const detalheQuantidade = opcao
      ? `${item.quantidadeSabores} sabores (${opcao.descricao})`
      : `${item.quantidadeSabores} sabores`;
    return [
      `Categoria: ${LABEL_CATEGORIA_PEDIDO[item.categoria]}`,
      `Sabores: ${detalheQuantidade} — ${item.sabores.join(", ")}`,
    ];
  }

  return [
    `Categoria: ${LABEL_CATEGORIA_PEDIDO[item.categoria]}`,
    `Tamanho: ${item.tamanho}`,
    `Recheio: ${item.recheio}`,
  ];
}

/** Monta a mensagem de texto do pedido, pronta para virar o `text` de
 * um link `wa.me` (ver `linkWhatsApp` em lib/cardapio.ts). Só aceita um
 * `DadosPedido` já validado por `normalizarRascunho` — não faz nenhuma
 * validação própria.
 *
 * Um único item: formato "achatado" (igual ao de antes da
 * multi-categoria) — saudação, categoria e detalhes, data, observações
 * (se houver), nome.
 *
 * Vários itens: cada um numerado ("1) Bolo Redondo", "2) Docinhos", …),
 * separado por linha em branco, seguido de data/observações/nome —
 * únicos e compartilhados por todo o pedido, nunca repetidos por item. */
export function montarMensagemPedido(dados: DadosPedido): string {
  const linhas: string[] = [];

  if (dados.itens.length === 1) {
    linhas.push("Olá! Gostaria de fazer uma encomenda:", "");
    linhas.push(...linhasItem(dados.itens[0]));
  } else {
    linhas.push(
      `Olá! Gostaria de fazer uma encomenda com ${dados.itens.length} itens:`,
      "",
    );
    dados.itens.forEach((item, indice) => {
      linhas.push(`${indice + 1}) ${LABEL_CATEGORIA_PEDIDO[item.categoria]}`);
      linhas.push(...linhasItem(item).slice(1)); // sem repetir "Categoria: X" (já é o título numerado)
      if (indice < dados.itens.length - 1) linhas.push("");
    });
  }

  linhas.push("", `Data desejada: ${formatarDataBR(dados.dataDesejada)}`);

  if (dados.observacoes) {
    linhas.push(`Observações: ${dados.observacoes}`);
  }

  linhas.push(`Nome: ${dados.nome}`);

  return linhas.join("\n");
}
