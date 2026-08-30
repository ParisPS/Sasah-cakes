"use client";

import { useState, type FormEvent } from "react";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";
import {
  dataMinimaPermitida,
  LABEL_CATEGORIA_PEDIDO,
  montarMensagemPedido,
  normalizarRascunho,
  OBSERVACOES_MAX_LENGTH,
  RASCUNHO_PEDIDO_VAZIO,
  validarDataDesejada,
  type CategoriaPedido,
  type RascunhoPedido,
} from "@/lib/pedido";
import { Button } from "@/components/Button";

const LABEL_CLASSES = "font-body block text-sm font-medium text-ink-900";

// Cor de erro: a Fase 2 não definiu um token de validação (ver
// docs/design/design-tokens.md, nota no fim de "Paleta de cores") — a
// Fase 8 não inventa uma cor nova (restrição não-negociável). Em vez
// disso, um campo inválido usa borda mais grossa em sage-700 (já existe
// na paleta) e a mensagem de erro usa sage-900 em negrito — a diferença
// de peso/traço já distingue do texto de apoio (ink-600, regular), sem
// depender só de cor para transmitir "isto é um erro" (acessibilidade:
// não depender só de cor).
const CAMPO_CLASSES =
  "w-full rounded-sm border border-cream-700 bg-white px-4 py-2.5 text-ink-900 transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-500 focus:outline-none motion-reduce:transition-none";
const CAMPO_INVALIDO_CLASSES = "border-2 border-sage-700";
const ERRO_CLASSES = "text-sage-900 mt-1.5 text-sm font-semibold";

const CATEGORIAS: CategoriaPedido[] = [
  "bolo-redondo",
  "bolo-quadrado",
  "docinhos",
];

function classesPill(selecionado: boolean): string {
  // `relative`: o <input> real fica visualmente escondido via `sr-only`
  // (position: absolute) — sem um ancestral posicionado, ele escaparia
  // para o canto superior esquerdo do documento inteiro (containing
  // block = raiz da página), quebrando o scroll automático do navegador
  // ao focar o campo via teclado (o foco pareceria "pular" para o topo
  // da página em vez de ficar no pill). `relative` no <label> faz o
  // input absoluto ficar contido dentro do próprio pill.
  const base =
    "rounded-pill font-body has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-500 has-[:focus-visible]:ring-offset-2 relative cursor-pointer border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors motion-reduce:transition-none";
  return selecionado
    ? `${base} border-sage-700 bg-sage-700 text-cream-300`
    : `${base} border-sage-300 text-sage-700 hover:bg-sage-100 hover:text-sage-900`;
}

/**
 * Formulário de pedido — CTA primário de /como-encomendar desde a Fase
 * 8 (ver docs/fase8-formulario-pedido.md). Monta a mensagem via
 * lib/pedido.ts e abre o WhatsApp já preenchido — sem backend, API
 * route ou persistência: tudo roda no navegador do cliente.
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

  function handleCategoriaChange(categoria: CategoriaPedido) {
    // Troca de categoria reseta só os campos condicionais dela (tamanho/
    // recheio/sabores) — data, nome e observações já preenchidos não se
    // perdem, não têm relação com a categoria escolhida.
    setRascunho((r) => ({
      ...RASCUNHO_PEDIDO_VAZIO,
      categoria,
      dataDesejada: r.dataDesejada,
      nome: r.nome,
      observacoes: r.observacoes,
    }));
  }

  function handleQuantidadeSaboresChange(quantidade: 2 | 4) {
    setRascunho((r) => ({
      ...r,
      quantidadeSabores: quantidade,
      sabores: Array.from({ length: quantidade }, (_, i) => r.sabores[i] ?? ""),
    }));
  }

  function handleSaborChange(indice: number, valor: string) {
    setRascunho((r) => {
      const sabores = [...r.sabores];
      sabores[indice] = valor;
      return { ...r, sabores };
    });
  }

  function opcoesSaborDisponiveis(indice: number): string[] {
    const escolhidosEmOutroCampo = rascunho.sabores.filter(
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
          <span className="sr-only"> (obrigatório)</span>
        </legend>

        <div
          role="radiogroup"
          aria-label="Categoria"
          className="mt-3 flex flex-wrap gap-3"
        >
          {CATEGORIAS.map((categoria) => (
            <label
              key={categoria}
              className={classesPill(rascunho.categoria === categoria)}
            >
              <input
                type="radio"
                name="pedido-categoria"
                value={categoria}
                checked={rascunho.categoria === categoria}
                onChange={() => handleCategoriaChange(categoria)}
                required
                className="sr-only"
              />
              {LABEL_CATEGORIA_PEDIDO[categoria]}
            </label>
          ))}
        </div>

        {/* Transição de altura ao aparecer os campos condicionais da
            categoria escolhida — docs/design/motion-principles.md
            (duration-300, ease-in-out, mesmo padrão do menu mobile em
            components/Header.tsx). */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
            rascunho.categoria ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            {(rascunho.categoria === "bolo-redondo" ||
              rascunho.categoria === "bolo-quadrado") && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="pedido-tamanho" className={LABEL_CLASSES}>
                    Tamanho <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="pedido-tamanho"
                    required
                    value={rascunho.tamanho}
                    onChange={(e) =>
                      setRascunho((r) => ({ ...r, tamanho: e.target.value }))
                    }
                    className={`${CAMPO_CLASSES} mt-1.5`}
                  >
                    <option value="">Selecione o tamanho</option>
                    {(rascunho.categoria === "bolo-redondo"
                      ? cardapio.bolos.redondos
                      : cardapio.bolos.quadrados
                    ).map((opcao) => (
                      <option key={opcao.tamanho} value={opcao.tamanho}>
                        {opcao.tamanho} ({opcao.rendimento})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pedido-recheio" className={LABEL_CLASSES}>
                    Recheio <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="pedido-recheio"
                    required
                    value={rascunho.recheio}
                    onChange={(e) =>
                      setRascunho((r) => ({ ...r, recheio: e.target.value }))
                    }
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
            )}

            {rascunho.categoria === "docinhos" && (
              <div className="mt-4">
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
                        rascunho.quantidadeSabores === opcao.quantidadeSabores,
                      )}
                    >
                      <input
                        type="radio"
                        name="pedido-quantidade-sabores"
                        value={opcao.quantidadeSabores}
                        checked={
                          rascunho.quantidadeSabores === opcao.quantidadeSabores
                        }
                        onChange={() =>
                          handleQuantidadeSaboresChange(
                            opcao.quantidadeSabores as 2 | 4,
                          )
                        }
                        required
                        className="sr-only"
                      />
                      {opcao.quantidadeSabores} sabores ({opcao.descricao})
                    </label>
                  ))}
                </div>

                {rascunho.quantidadeSabores !== null && (
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: rascunho.quantidadeSabores }).map(
                      (_, indice) => (
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
                            value={rascunho.sabores[indice] ?? ""}
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
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
