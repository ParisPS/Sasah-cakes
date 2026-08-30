// Dark mode (Fase 11) — lógica pura de resolução/persistência do tema,
// separada do componente de UI (components/ThemeToggle.tsx) para poder
// ser testada sem precisar montar React. Ver
// docs/design/design-tokens.md ("Dark mode") para a tabela de tokens e
// a auditoria de contraste.

/** Preferência escolhida pela pessoa — "sistema" é o padrão inicial
 * (segue `prefers-color-scheme` do sistema operacional) até uma escolha
 * manual ser salva. */
export type Tema = "claro" | "escuro" | "sistema";

export const TEMA_STORAGE_KEY = "sasah-cakes-tema";

const TEMAS_VALIDOS: Tema[] = ["claro", "escuro", "sistema"];

function temaValido(valor: unknown): valor is Tema {
  return typeof valor === "string" && TEMAS_VALIDOS.includes(valor as Tema);
}

/** Lê a preferência salva em localStorage — `null` se nunca foi
 * escolhida, se o valor salvo for inválido (ex: de uma versão antiga),
 * ou se localStorage não estiver disponível (SSR, navegador privado
 * bloqueando storage). Nunca lança: um erro aqui não pode quebrar a
 * renderização da página. */
export function lerPreferenciaSalva(): Tema | null {
  try {
    const valor = window.localStorage.getItem(TEMA_STORAGE_KEY);
    return temaValido(valor) ? valor : null;
  } catch {
    return null;
  }
}

/** Salva a preferência escolhida. Silenciosamente ignora falhas (ex:
 * localStorage cheio ou bloqueado) — a escolha simplesmente não
 * persiste entre visitas, mas a troca de tema na sessão atual continua
 * funcionando normalmente. */
export function salvarPreferencia(tema: Tema): void {
  try {
    window.localStorage.setItem(TEMA_STORAGE_KEY, tema);
  } catch {
    // ver comentário acima
  }
}

/** Resolve a preferência para "claro" ou "escuro" de fato — "sistema"
 * vira o que o sistema operacional preferir no momento (via
 * `prefers-color-scheme`, passado como parâmetro para a função ficar
 * pura/testável em vez de chamar `matchMedia` ela mesma). */
export function temaEfetivo(
  preferencia: Tema,
  sistemaPrefereEscuro: boolean,
): "claro" | "escuro" {
  if (preferencia === "sistema") {
    return sistemaPrefereEscuro ? "escuro" : "claro";
  }
  return preferencia;
}

/** Script inline (string, não uma função) injetado via
 * `next/script` `strategy="beforeInteractive"` em app/layout.tsx —
 * aplica a classe `dark` em <html> ANTES da primeira pintura, evitando
 * um flash do tema errado (claro piscando antes de escurecer). Não
 * importa lib/tema.ts porque scripts beforeInteractive rodam antes de
 * qualquer módulo React/JS da aplicação existir — precisa ser
 * autocontido, sem imports. Mantido em sincronia manual com
 * TEMA_STORAGE_KEY/temaEfetivo acima (mesma lógica, duplicada de
 * propósito pelas razões explicadas). */
export const SCRIPT_INLINE_TEMA = `
(function () {
  try {
    var chave = ${JSON.stringify(TEMA_STORAGE_KEY)};
    var salvo = window.localStorage.getItem(chave);
    var escuro =
      salvo === "escuro" ||
      ((salvo === "sistema" || salvo === null) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (escuro) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;
