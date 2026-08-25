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
              className="font-body text-ink-900 hover:text-sage-700 transition-colors"
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
          className="text-sage-700 text-2xl active:opacity-70 md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav
          id="menu-mobile"
          className="border-cream-700 flex flex-col gap-1 border-t bg-white px-4 pb-4 md:hidden"
        >
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
        </nav>
      )}
    </header>
  );
}
