"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav";

// Header sticky — ver docs/design/style-guide.md ("Componentes
// recorrentes" → "Cabeçalho (header)"). Mobile: logo + ☰ que abre o menu;
// desktop (≥768px, breakpoint md do Tailwind): nav inline substitui o ☰.
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-cream-700 sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-heading text-sage-700 text-xl font-bold"
        >
          Sasah Cakes
        </Link>

        {/* Nav inline — desktop */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-ink-900 hover:text-sage-700 transition-colors motion-reduce:transition-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Botão hamburguer — mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="text-sage-700 grid text-2xl active:opacity-70 md:hidden"
        >
          {/* Duas camadas sobrepostas (grid + mesma célula) em vez de
              trocar o texto na hora — permite um fade/rotate suave entre
              ☰ e ✕ em vez de um corte seco. Ver
              docs/design/motion-principles.md (duration-200, ease-in-out). */}
          <span
            aria-hidden="true"
            className={`col-start-1 row-start-1 transition-all duration-200 ease-in-out motion-reduce:transition-none ${
              open ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
            }`}
          >
            ☰
          </span>
          <span
            aria-hidden="true"
            className={`col-start-1 row-start-1 transition-all duration-200 ease-in-out motion-reduce:transition-none ${
              open ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
            }`}
          >
            ✕
          </span>
        </button>
      </div>

      {/* Menu mobile — sempre no DOM (não condicional) para poder animar
          a saída, não só a entrada. Truque do CSS grid para animar até
          "altura automática" sem JS medindo o conteúdo: uma única linha
          de grid transiciona de 0fr para 1fr. `inert` tira o menu
          fechado da árvore de acessibilidade e do foco por teclado,
          mesmo com o nó continuando no DOM. */}
      <nav
        id="menu-mobile"
        inert={!open}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="border-cream-700 flex min-h-0 flex-col gap-1 overflow-hidden border-t bg-white px-4 pb-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-body text-ink-900 active:bg-sage-100 rounded-sm px-2 py-3"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
