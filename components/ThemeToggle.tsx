"use client";

import { useEffect, useState } from "react";
import {
  lerPreferenciaSalva,
  salvarPreferencia,
  temaEfetivo,
  type Tema,
} from "@/lib/tema";

const OPCOES: { valor: Tema; rotulo: string }[] = [
  { valor: "claro", rotulo: "Claro" },
  { valor: "escuro", rotulo: "Escuro" },
  { valor: "sistema", rotulo: "Sistema" },
];

/** Aplica/remove a classe `dark` em <html> conforme o tema efetivo. */
function aplicarClasseDark(escuro: boolean) {
  document.documentElement.classList.toggle("dark", escuro);
}

/**
 * Toggle de tema — claro / escuro / seguir sistema (Fase 11, dark
 * mode). Padrão inicial "sistema"; a escolha manual persiste em
 * localStorage (lib/tema.ts) entre visitas. `<select>` nativo em vez
 * de um grupo de botões: 3 opções nomeadas são exatamente o caso de
 * uso de um <select> — já vem com navegação por teclado, leitura por
 * leitor de tela e semântica corretas de graça, sem precisar de
 * nenhum ícone novo (o projeto não tem uma biblioteca de ícones).
 *
 * O flash de tema errado no carregamento inicial é evitado à parte,
 * por um script inline síncrono em app/layout.tsx
 * (`SCRIPT_INLINE_TEMA`, ver lib/tema.ts) que já aplica a classe
 * `dark` antes da primeira pintura — este componente só assume o
 * controle depois de montado (useEffect abaixo lê o mesmo estado que o
 * script já aplicou, sem alterá-lo).
 */
export function ThemeToggle() {
  // "sistema" por padrão (mesmo valor default de lib/tema.ts) até o
  // useEffect ler a preferência salva de verdade — evita um
  // mismatch de hidratação (servidor não tem acesso a localStorage).
  const [tema, setTema] = useState<Tema>("sistema");

  useEffect(() => {
    // Só pode ler localStorage no client (não existe durante a
    // renderização no servidor) — precisa ser um efeito, não o
    // inicializador do useState, ou o HTML do servidor e a primeira
    // renderização no cliente divergiriam (erro de hidratação).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTema(lerPreferenciaSalva() ?? "sistema");
  }, []);

  useEffect(() => {
    const mediaEscuro = window.matchMedia("(prefers-color-scheme: dark)");

    function atualizar() {
      aplicarClasseDark(temaEfetivo(tema, mediaEscuro.matches) === "escuro");
    }

    atualizar();

    // Só precisa escutar mudanças do SO quando a preferência é
    // "sistema" — nos outros dois casos, o tema já está fixo e não
    // deve reagir ao SO mudar de tema no meio da sessão.
    if (tema === "sistema") {
      mediaEscuro.addEventListener("change", atualizar);
      return () => mediaEscuro.removeEventListener("change", atualizar);
    }
  }, [tema]);

  function handleChange(novoTema: Tema) {
    setTema(novoTema);
    salvarPreferencia(novoTema);
  }

  return (
    <label className="font-body text-ink-900 flex items-center gap-1.5 text-sm">
      <span className="sr-only">Tema do site</span>
      <select
        value={tema}
        onChange={(e) => handleChange(e.target.value as Tema)}
        aria-label="Tema do site"
        className="border-cream-700 text-ink-900 focus:border-sage-500 focus:ring-sage-500 rounded-sm border bg-white px-2 py-1.5 text-sm focus:ring-2 focus:outline-none motion-reduce:transition-none"
      >
        {OPCOES.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </label>
  );
}
