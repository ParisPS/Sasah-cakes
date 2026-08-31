"use client";

import { useEffect, useState, type SVGProps } from "react";
import { lerPreferenciaSalva, salvarPreferencia } from "@/lib/tema";

/** Aplica/remove a classe `dark` em <html> conforme o tema efetivo. */
function aplicarClasseDark(escuro: boolean) {
  document.documentElement.classList.toggle("dark", escuro);
}

// Ícones sol/lua — traço simples (stroke, não fill), mesmo espírito
// minimalista dos outros ícones do site (☰/✕ do Header são glifos de
// texto; o WhatsApp é a exceção, com logo próprio). Formas geométricas
// básicas (círculo + raios; crescente via dois arcos), sem depender de
// nenhuma biblioteca de ícones — o projeto não tem uma.
function IconeSol(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconeLua(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Transição do morph — docs/design/motion-principles.md ("Toggle",
// duration-300, ease-in-out: mesma faixa do menu mobile em
// Header.tsx). Opacity + scale + rotate combinados (não só crossfade)
// pra dar sensação de um ícone virando o outro, não só um cortando pro
// outro. motion-reduce: sem transição — troca instantânea entre os
// dois estados, não a animação completa.
const ICONE_CLASSES =
  "col-start-1 row-start-1 h-5 w-5 transition-all duration-300 ease-in-out motion-reduce:transition-none";

/**
 * Toggle de tema — ícone único com morph sol/lua (Fase 11.1). Repouso
 * mostra o ícone do tema ATUAL; hover/focus-visible faz um morph suave
 * para o ícone OPOSTO, como prévia do que vai acontecer ao clicar; sair
 * sem clicar volta ao ícone de repouso. `group-hover`/`group-focus-visible`
 * do Tailwind cuidam da troca via CSS puro — nenhum JS decide o que
 * mostrar no hover, só qual ícone é "repouso" vs. "prévia" (isso sim
 * depende do tema atual, guardado em estado).
 *
 * Substitui o antigo <select> de 3 opções (claro/escuro/sistema): a
 * partir do primeiro clique, o controle vira um toggle binário
 * claro↔escuro (a escolha ainda persiste em localStorage, ver
 * lib/tema.ts — só a apresentação simplificou). Antes do primeiro
 * clique, sem preferência salva, o site continua abrindo conforme
 * `prefers-color-scheme` do sistema, como sempre — só não expõe mais
 * "sistema" como uma terceira opção clicável, redundante com um ícone
 * que já é binário por natureza.
 *
 * O flash de tema errado no carregamento inicial é evitado à parte,
 * por um script inline síncrono em app/layout.tsx
 * (`SCRIPT_INLINE_TEMA`, ver lib/tema.ts) que já aplica a classe
 * `dark` antes da primeira pintura — este componente só assume o
 * controle depois de montado.
 */
export function ThemeToggle() {
  // false (claro) é só o palpite pro HTML do servidor — corrigido pelo
  // efeito abaixo assim que montar, lendo o estado real já aplicado
  // pelo script inline (evita divergir do <html> real por mais que um
  // instante).
  const [escuro, setEscuro] = useState(false);
  // Enquanto nenhuma escolha manual foi salva, o tema "segue o
  // sistema" implicitamente — precisa reagir se o SO mudar de tema no
  // meio da sessão. Isso para de valer no primeiro clique (handleClick
  // abaixo), quando uma preferência explícita é salva.
  const [seguindoSistema, setSeguindoSistema] = useState(true);

  useEffect(() => {
    const salvo = lerPreferenciaSalva();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- só pode ler localStorage/DOM no client, ver comentário da função acima
    setSeguindoSistema(salvo === null || salvo === "sistema");
    setEscuro(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!seguindoSistema) return;

    const mediaEscuro = window.matchMedia("(prefers-color-scheme: dark)");
    function atualizar() {
      aplicarClasseDark(mediaEscuro.matches);
      setEscuro(mediaEscuro.matches);
    }

    mediaEscuro.addEventListener("change", atualizar);
    return () => mediaEscuro.removeEventListener("change", atualizar);
  }, [seguindoSistema]);

  function handleClick() {
    const novoEscuro = !escuro;
    aplicarClasseDark(novoEscuro);
    setEscuro(novoEscuro);
    // A partir daqui é uma escolha explícita — não escuta mais mudança
    // de tema do sistema operacional nesta sessão.
    setSeguindoSistema(false);
    salvarPreferencia(novoEscuro ? "escuro" : "claro");
  }

  const IconeRepouso = escuro ? IconeLua : IconeSol;
  const IconePreview = escuro ? IconeSol : IconeLua;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={escuro ? "Mudar para modo claro" : "Mudar para modo escuro"}
      // ring-offset-white (não o padrão do navegador): sem isso, o
      // "gap" do ring-offset fica branco por padrão nos dois temas —
      // no escuro criava um halo branco em volta do ícone em vez de se
      // misturar com o fundo do header. `white` já inverte sozinho sob
      // `.dark` (ver docs/design/design-tokens.md "Dark mode"), então
      // uma única classe cobre os dois temas.
      className="text-sage-700 dark:text-sage-300 focus-visible:ring-sage-500 group grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
    >
      <IconeRepouso
        className={`${ICONE_CLASSES} scale-100 rotate-0 opacity-100 group-hover:scale-50 group-hover:-rotate-90 group-hover:opacity-0 group-focus-visible:scale-50 group-focus-visible:-rotate-90 group-focus-visible:opacity-0`}
      />
      <IconePreview
        className={`${ICONE_CLASSES} scale-50 rotate-90 opacity-0 group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100`}
      />
    </button>
  );
}
