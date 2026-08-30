"use client";

import { useState, type FormEvent } from "react";
import { cardapio, linkWhatsApp, type TamanhoBolo } from "@/lib/cardapio";
import {
  dataMinimaPermitida,
  LABEL_CATEGORIA_PEDIDO,
  montarMensagemPedido,
  normalizarRascunho,
  OBSERVACOES_MAX_LENGTH,
  RASCUNHO_PEDIDO_VAZIO,
  validarDataDesejada,
  type RascunhoItemBolo,
  type RascunhoPedido,
} from "@/lib/pedido";
import { Button } from "@/components/Button";

const LABEL_CLASSES = "font-body block text-sm font-medium text-ink-900";

// Cor de erro: a Fase 2 não definiu um token de validação (ver
// docs/design/design-tokens.md, nota no fim de "Paleta de cores") — a
// Fase 8 não inventa uma cor nova (restrição não-negociável). Em vez
// disso, um campo inválido usa borda mais grossa (já existe na paleta)
// e a mensagem de erro usa negrito — a diferença de peso/traço já
// distingue do texto de apoio (ink-600, regular), sem depender só de
// cor para transmitir "isto é um erro" (acessibilidade: não depender
// só de cor).
//
// Dark mode (Fase 11): a borda inválida usa sage-300 (não sage-700) —
// sage-700 (fixo nos dois temas) mede só ~3.06:1 contra o bg branco do
// campo no escuro, abaixo da margem confortável para um indicador de
// UI; sage-300 mede ~8:1. O texto de erro usa sage-100 no escuro (era
// sage-900 no claro) pelo mesmo motivo dos headings — ver
// docs/design/design-tokens.md ("Dark mode").
const CAMPO_CLASSES =
  "w-full rounded-sm border border-cream-700 bg-white px-4 py-2.5 text-ink-900 transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-500 focus:outline-none motion-reduce:transition-none";
const CAMPO_INVALIDO_CLASSES = "dark:border-sage-300 border-2 border-sage-700";
const ERRO_CLASSES =
  "text-sage-900 dark:text-sage-100 mt-1.5 text-sm font-semibold";

function classesPill(selecionado: boolean): string {
  // `relative`: o <input> real fica visualmente escondido via `sr-only`
  // (position: absolute) — sem um ancestral posicionado, ele escaparia
  // para o canto superior esquerdo do documento inteiro (containing
  // block = raiz da página), quebrando o scroll automático do navegador
  // ao focar o campo via teclado (o foco pareceria "pular" para o topo
  // da página em vez de ficar no pill). `relative` no <label> faz o
  // input absoluto ficar contido dentro do próprio pill.
  //
  // Dark mode: selecionado usa text-on-accent (texto claro fixo sobre
  // fundo sage saturado, também fixo). Não selecionado usa
  // dark:text-sage-300 em repouso, com dark:hover: reafirmando
  // sage-900 no hover (mesmo par sage-900-sobre-sage-100, também
  // fixo, do claro) — ver docs/design/design-tokens.md ("Dark mode").
  const base =
    "rounded-pill font-body has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-500 has-[:focus-visible]:ring-offset-2 relative cursor-pointer border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none";
  return selecionado
    ? `${base} border-sage-700 bg-sage-700 text-on-accent`
    : `${base} border-sage-300 text-sage-700 dark:text-sage-300 hover:bg-sage-100 hover:text-sage-900 dark:hover:text-sage-900`;
}

// Transição de altura ao aparecer os campos de uma categoria marcada —
// docs/design/motion-principles.md (duration-300, ease-in-out, mesmo
// padrão do menu mobile em components/Header.tsx, incluindo o `inert`:
// o truque de grid-rows só esconde visualmente via `overflow-hidden` —
// os campos continuam com seu tamanho "natural" por baixo do clipe, e
// sem `inert` ficariam alcançáveis por Tab mesmo escondidos. `inert`
// tira o bloco fechado da árvore de acessibilidade e do foco por
// teclado, mesmo com o nó continuando no DOM). Cada categoria tem seu
// próprio wrapper (não um único compartilhado): com múltiplas
// categorias marcáveis ao mesmo tempo, cada bloco precisa expandir/
// recolher de forma independente dos outros.
function BlocoExpansivel({
  aberto,
  children,
}: {
  aberto: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      inert={!aberto}
      className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
        aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="min-h-0">{children}</div>
    </div>
  );
}

type BlocoBoloProps = {
  idPrefix: string;
  opcoesTamanho: TamanhoBolo[];
  slot: RascunhoItemBolo;
  onChange: (slot: RascunhoItemBolo) => void;
};

// Bolo Redondo e Bolo Quadrado pedem exatamente os mesmos dois campos
// (tamanho + recheio), só a lista de tamanhos reais muda — extraído
// para não duplicar o JSX entre as duas categorias.
function BlocoBolo({
  idPrefix,
  opcoesTamanho,
  slot,
  onChange,
}: BlocoBoloProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-tamanho`} className={LABEL_CLASSES}>
          Tamanho <span aria-hidden="true">*</span>
        </label>
        <select
          id={`${idPrefix}-tamanho`}
          required
          value={slot.tamanho}
          onChange={(e) => onChange({ ...slot, tamanho: e.target.value })}
          className={`${CAMPO_CLASSES} mt-1.5`}
        >
          <option value="">Selecione o tamanho</option>
          {opcoesTamanho.map((opcao) => (
            <option key={opcao.tamanho} value={opcao.tamanho}>
              {opcao.tamanho} ({opcao.rendimento})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-recheio`} className={LABEL_CLASSES}>
          Recheio <span aria-hidden="true">*</span>
        </label>
        <select
          id={`${idPrefix}-recheio`}
          required
          value={slot.recheio}
          onChange={(e) => onChange({ ...slot, recheio: e.target.value })}
          className={`${CAMPO_CLASSES} mt-1.5`}
        >
          <option value="">Selecione o recheio</option>
          {cardapio.bolos.recheiosDisponiveis.map((recheio) => (
            <option key={recheio} value={recheio}>
              {recheio}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Formulário de pedido — CTA primário de /como-encomendar desde a Fase
 * 8 (ver docs/fase8-formulario-pedido.md). Monta a mensagem via
 * lib/pedido.ts e abre o WhatsApp já preenchido — sem backend, API
 * route ou persistência: tudo roda no navegador do cliente.
 *
 * Multi-categoria: até um item por categoria pode ser marcado na mesma
 * encomenda (ex: Bolo Redondo + Docinhos) — cada categoria é um
 * checkbox independente (não radio: a Fase 8 original só permitia
 * escolher uma categoria por vez), cada uma revelando seu próprio
 * bloco de campos num <fieldset> aninhado. Data, nome e observações
 * continuam únicos para o pedido inteiro.
 */
export function FormularioPedido() {
  const [rascunho, setRascunho] = useState<RascunhoPedido>(
    RASCUNHO_PEDIDO_VAZIO,
  );
  const [nomeTocado, setNomeTocado] = useState(false);

  const dataMinima = dataMinimaPermitida();
  const validacaoData = rascunho.dataDesejada
    ? validarDataDesejada(rascunho.dataDesejada)
    : null;
  const erroData =
    validacaoData && !validacaoData.valida ? validacaoData.erro : null;
  const erroNome =
    nomeTocado && !rascunho.nome.trim() ? "Digite seu nome." : null;

  const dadosCompletos = normalizarRascunho(rascunho);

  function handleToggleBolo(
    chave: "bolosRedondo" | "bolosQuadrado",
    marcado: boolean,
  ) {
    setRascunho((r) => ({
      ...r,
      [chave]: marcado
        ? { ...r[chave], marcado: true }
        : { marcado: false, tamanho: "", recheio: "" },
    }));
  }

  function handleToggleDocinhos(marcado: boolean) {
    setRascunho((r) => ({
      ...r,
      docinhos: marcado
        ? { ...r.docinhos, marcado: true }
        : { marcado: false, quantidadeSabores: null, sabores: [] },
    }));
  }

  function handleQuantidadeSaboresChange(quantidade: 2 | 4) {
    setRascunho((r) => ({
      ...r,
      docinhos: {
        ...r.docinhos,
        quantidadeSabores: quantidade,
        sabores: Array.from(
          { length: quantidade },
          (_, i) => r.docinhos.sabores[i] ?? "",
        ),
      },
    }));
  }

  function handleSaborChange(indice: number, valor: string) {
    setRascunho((r) => {
      const sabores = [...r.docinhos.sabores];
      sabores[indice] = valor;
      return { ...r, docinhos: { ...r.docinhos, sabores } };
    });
  }

  function opcoesSaborDisponiveis(indice: number): string[] {
    const escolhidosEmOutroCampo = rascunho.docinhos.sabores.filter(
      (sabor, i) => i !== indice && sabor,
    );
    return cardapio.docinhos.saboresDisponiveis.filter(
      (sabor) => !escolhidosEmOutroCampo.includes(sabor),
    );
  }

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!dadosCompletos) return; // botão já fica desabilitado até aqui

    const mensagem = montarMensagemPedido(dadosCompletos);
    window.open(
      linkWhatsApp(cardapio.comoEncomendar.contato.telefone, mensagem),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-ink-600 text-sm">
        Campos marcados com <span aria-hidden="true">*</span> (obrigatório) são
        obrigatórios.
      </p>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="font-body text-ink-900 text-base font-semibold">
          Produto <span aria-hidden="true">*</span>
          <span className="sr-only"> (obrigatório) — marque um ou mais</span>
        </legend>
        <p className="text-ink-600 mt-1 text-sm">
          Pode marcar mais de uma categoria na mesma encomenda.
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          <label className={classesPill(rascunho.bolosRedondo.marcado)}>
            <input
              type="checkbox"
              checked={rascunho.bolosRedondo.marcado}
              onChange={(e) =>
                handleToggleBolo("bolosRedondo", e.target.checked)
              }
              className="sr-only"
            />
            {LABEL_CATEGORIA_PEDIDO["bolo-redondo"]}
          </label>
          <label className={classesPill(rascunho.bolosQuadrado.marcado)}>
            <input
              type="checkbox"
              checked={rascunho.bolosQuadrado.marcado}
              onChange={(e) =>
                handleToggleBolo("bolosQuadrado", e.target.checked)
              }
              className="sr-only"
            />
            {LABEL_CATEGORIA_PEDIDO["bolo-quadrado"]}
          </label>
          <label className={classesPill(rascunho.docinhos.marcado)}>
            <input
              type="checkbox"
              checked={rascunho.docinhos.marcado}
              onChange={(e) => handleToggleDocinhos(e.target.checked)}
              className="sr-only"
            />
            {LABEL_CATEGORIA_PEDIDO["docinhos"]}
          </label>
        </div>

        <BlocoExpansivel aberto={rascunho.bolosRedondo.marcado}>
          <fieldset className="bg-cream-300 mt-4 rounded-md border-0 p-4">
            <legend className="font-body text-sage-700 dark:text-sage-300 px-1 text-sm font-semibold">
              {LABEL_CATEGORIA_PEDIDO["bolo-redondo"]}
            </legend>
            <BlocoBolo
              idPrefix="pedido-bolo-redondo"
              opcoesTamanho={cardapio.bolos.redondos}
              slot={rascunho.bolosRedondo}
              onChange={(slot) =>
                setRascunho((r) => ({ ...r, bolosRedondo: slot }))
              }
            />
          </fieldset>
        </BlocoExpansivel>

        <BlocoExpansivel aberto={rascunho.bolosQuadrado.marcado}>
          <fieldset className="bg-cream-300 mt-4 rounded-md border-0 p-4">
            <legend className="font-body text-sage-700 dark:text-sage-300 px-1 text-sm font-semibold">
              {LABEL_CATEGORIA_PEDIDO["bolo-quadrado"]}
            </legend>
            <BlocoBolo
              idPrefix="pedido-bolo-quadrado"
              opcoesTamanho={cardapio.bolos.quadrados}
              slot={rascunho.bolosQuadrado}
              onChange={(slot) =>
                setRascunho((r) => ({ ...r, bolosQuadrado: slot }))
              }
            />
          </fieldset>
        </BlocoExpansivel>

        <BlocoExpansivel aberto={rascunho.docinhos.marcado}>
          <fieldset className="bg-cream-300 mt-4 rounded-md border-0 p-4">
            <legend className="font-body text-sage-700 dark:text-sage-300 px-1 text-sm font-semibold">
              {LABEL_CATEGORIA_PEDIDO["docinhos"]}
            </legend>

            <span className={LABEL_CLASSES}>
              Quantidade de sabores <span aria-hidden="true">*</span>
            </span>
            <div
              role="radiogroup"
              aria-label="Quantidade de sabores"
              className="mt-1.5 flex flex-wrap gap-3"
            >
              {cardapio.docinhos.opcoesDeSabores.map((opcao) => (
                <label
                  key={opcao.quantidadeSabores}
                  className={classesPill(
                    rascunho.docinhos.quantidadeSabores ===
                      opcao.quantidadeSabores,
                  )}
                >
                  <input
                    type="radio"
                    name="pedido-quantidade-sabores"
                    value={opcao.quantidadeSabores}
                    checked={
                      rascunho.docinhos.quantidadeSabores ===
                      opcao.quantidadeSabores
                    }
                    onChange={() =>
                      handleQuantidadeSaboresChange(
                        opcao.quantidadeSabores as 2 | 4,
                      )
                    }
                    required={rascunho.docinhos.marcado}
                    className="sr-only"
                  />
                  {opcao.quantidadeSabores} sabores ({opcao.descricao})
                </label>
              ))}
            </div>

            {rascunho.docinhos.quantidadeSabores !== null && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({
                  length: rascunho.docinhos.quantidadeSabores,
                }).map((_, indice) => (
                  <div key={indice}>
                    <label
                      htmlFor={`pedido-sabor-${indice}`}
                      className={LABEL_CLASSES}
                    >
                      Sabor {indice + 1} <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id={`pedido-sabor-${indice}`}
                      required
                      value={rascunho.docinhos.sabores[indice] ?? ""}
                      onChange={(e) =>
                        handleSaborChange(indice, e.target.value)
                      }
                      className={`${CAMPO_CLASSES} mt-1.5`}
                    >
                      <option value="">Selecione o sabor</option>
                      {opcoesSaborDisponiveis(indice).map((sabor) => (
                        <option key={sabor} value={sabor}>
                          {sabor}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        </BlocoExpansivel>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="pedido-data" className={LABEL_CLASSES}>
          Data desejada <span aria-hidden="true">*</span>
        </label>
        <input
          id="pedido-data"
          type="date"
          required
          min={dataMinima}
          value={rascunho.dataDesejada}
          aria-describedby={erroData ? "pedido-data-erro" : undefined}
          aria-invalid={erroData ? "true" : undefined}
          onChange={(e) =>
            setRascunho((r) => ({ ...r, dataDesejada: e.target.value }))
          }
          className={`${CAMPO_CLASSES} mt-1.5 ${erroData ? CAMPO_INVALIDO_CLASSES : ""}`}
        />
        {erroData && (
          <p id="pedido-data-erro" role="alert" className={ERRO_CLASSES}>
            {erroData}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="pedido-nome" className={LABEL_CLASSES}>
          Nome <span aria-hidden="true">*</span>
        </label>
        <input
          id="pedido-nome"
          type="text"
          required
          value={rascunho.nome}
          onBlur={() => setNomeTocado(true)}
          aria-describedby={erroNome ? "pedido-nome-erro" : undefined}
          aria-invalid={erroNome ? "true" : undefined}
          onChange={(e) => setRascunho((r) => ({ ...r, nome: e.target.value }))}
          className={`${CAMPO_CLASSES} mt-1.5 ${erroNome ? CAMPO_INVALIDO_CLASSES : ""}`}
        />
        {erroNome && (
          <p id="pedido-nome-erro" role="alert" className={ERRO_CLASSES}>
            {erroNome}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="pedido-observacoes" className={LABEL_CLASSES}>
          Observações / tema do bolo{" "}
          <span className="text-ink-600 font-normal">(opcional)</span>
        </label>
        <textarea
          id="pedido-observacoes"
          rows={3}
          maxLength={OBSERVACOES_MAX_LENGTH}
          value={rascunho.observacoes}
          placeholder="Alguma referência de tema, cor ou decoração?"
          aria-describedby="pedido-observacoes-contador"
          onChange={(e) =>
            setRascunho((r) => ({ ...r, observacoes: e.target.value }))
          }
          className={`${CAMPO_CLASSES} mt-1.5`}
        />
        <p
          id="pedido-observacoes-contador"
          className="caption mt-1.5 text-right"
        >
          {rascunho.observacoes.length}/{OBSERVACOES_MAX_LENGTH}
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={!dadosCompletos}
        className="mt-8 w-full md:w-auto"
      >
        Enviar Pedido
      </Button>
    </form>
  );
}
