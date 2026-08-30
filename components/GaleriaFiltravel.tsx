"use client";

import { useState } from "react";
import {
  CATEGORIA_PORTFOLIO_LABELS,
  type CategoriaPortfolio,
  type ItemPortfolio,
} from "@/lib/cardapio";
import { GallerySection } from "./GallerySection";

type Filtro = "todos" | CategoriaPortfolio;

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: "todos", label: "Todos" },
  ...(
    Object.entries(CATEGORIA_PORTFOLIO_LABELS) as [CategoriaPortfolio, string][]
  ).map(([valor, label]) => ({ valor, label })),
];

type GaleriaFiltravelProps = {
  itens: ItemPortfolio[];
  arquivosDestacados?: string[];
};

/**
 * Filtro de categoria da Galeria (Fase 9) — substitui o badge repetido
 * em cada foto (ver docs/redesign/arquitetura.md "3.3"). "use client"
 * só pelo estado do filtro em si; a grade de fotos continua a mesma
 * GallerySection usada em toda a Home. O grid editorial (2 fotos maiores
 * via `arquivosDestacados`) só se aplica com "Todos" selecionado — um
 * subconjunto filtrado fica mais limpo em grid uniforme.
 */
export function GaleriaFiltravel({
  itens,
  arquivosDestacados = [],
}: GaleriaFiltravelProps) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const itensFiltrados =
    filtro === "todos"
      ? itens
      : itens.filter((item) => item.categoria === filtro);

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrar por categoria"
        className="flex flex-wrap gap-3"
      >
        {FILTROS.map((opcao) => {
          const ativo = filtro === opcao.valor;
          return (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={ativo}
              onClick={() => setFiltro(opcao.valor)}
              // Ativo usa sage-700 (não sage-500) por contraste de
              // texto: cream-300 sobre sage-700 mede 5.4:1 (WCAG AA),
              // contra 3.47:1 sobre sage-500 — sage-700 já é a cor de
              // "estado ativo" documentada em design-tokens.md. Inativo,
              // no hover, o texto sobe de sage-700 para sage-900 (achado
              // da Etapa 5): o fundo sage-100 do hover mede só 4.37:1
              // contra sage-700, abaixo do mínimo AA — e 7.13:1 contra
              // sage-900.
              className={`rounded-pill font-body border px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none ${
                ativo
                  ? "bg-sage-700 border-sage-700 text-on-accent"
                  : "border-sage-300 text-sage-700 dark:text-sage-300 hover:bg-sage-100 hover:text-sage-900 dark:hover:text-sage-900"
              }`}
            >
              {opcao.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <GallerySection
          variant="full"
          itens={itensFiltrados}
          showBadge={false}
          arquivosDestacados={filtro === "todos" ? arquivosDestacados : []}
        />
      </div>
    </div>
  );
}
