import type { ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary";

type ButtonOwnProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = ButtonOwnProps & {
  href: string;
  /** true para destino fora do site (ex: wa.me) — vira <a target="_blank">
   * em vez de next/link. */
  external?: boolean;
  onClick?: () => void;
  type?: never;
  disabled?: never;
  "data-testid"?: string;
  "aria-label"?: string;
};

type ButtonAsButton = ButtonOwnProps & {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  /** Só faz sentido na variante <button> — um link desabilitado não tem
   * equivalente semântico nativo em HTML (ver Fase 8, formulário de
   * pedido: "Enviar Pedido" fica desabilitado até os campos obrigatórios
   * estarem preenchidos). */
  disabled?: boolean;
  "data-testid"?: string;
  "aria-label"?: string;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const BASE_CLASSES =
  "rounded-pill font-body inline-block px-7 py-3 text-center font-semibold tracking-[0.01em] shadow-sm transition-[box-shadow,transform] active:scale-[0.98] active:shadow-md motion-reduce:transition-none md:hover:shadow-md disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:active:scale-100";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Ação principal da página (ex: WhatsApp/encomendar) — ver
  // docs/redesign/direcao-artistica.md ("3.1 Botão"). Fundo sage-700 (não
  // sage-500) desde a correção de contraste pós-Fase 9: cream-300 sobre
  // sage-500 media 3.47:1 (abaixo do mínimo AA de 4.5:1 para texto);
  // sobre sage-700 mede 5.40:1. Hover/active sobem para sage-900, um
  // degrau a mais no mesmo tom, mantendo a progressão "escurece ao
  // interagir". Ver docs/design/design-tokens.md ("Botões").
  primary: "bg-sage-700 text-on-accent active:bg-sage-900 md:hover:bg-sage-900",
  // Ação de navegação/exploração (ex: "ver mais fotos", "ver cardápio
  // completo") — nunca usada antes da Fase 9, apesar de já especificada
  // desde a Fase 2 (docs/design/design-tokens.md "Botões"). Sem sombra
  // nem fundo, para não competir visualmente com o primário. Texto sobe
  // de sage-700 para sage-900 no hover/active (achado da Etapa 5): o
  // fundo que aparece nesse momento, sage-100, mede só 4.37:1 contra
  // sage-700 — abaixo do mínimo AA de 4.5:1 — e 7.13:1 contra sage-900.
  //
  // Dark mode (Fase 11): sage-500/700/900/100 são fixos nos dois temas
  // (ver docs/design/design-tokens.md "Dark mode") — só o texto sage-700
  // em REPOUSO (sem fundo, direto sobre a página) precisa de
  // dark:text-sage-300 pra continuar legível quando a página escurece.
  // active:/hover: já ficam sobre bg-sage-100 (também fixo) — o par
  // sage-900-sobre-sage-100 não muda de tom entre temas, então
  // dark:active:/dark:md:hover: só reafirmam sage-900 (evita qualquer
  // ambiguidade de ordem de cascata com o dark:text-sage-300 da linha
  // de repouso, que não deveria vencer aqui).
  secondary:
    "border border-sage-500 text-sage-700 dark:text-sage-300 shadow-none active:bg-sage-100 active:text-sage-900 dark:active:text-sage-900 md:hover:bg-sage-100 md:hover:text-sage-900 dark:md:hover:text-sage-900 md:hover:shadow-none",
};

/**
 * CTA único e reutilizável — extraído na Fase 9 (redesign de marca) da
 * mesma string de classes que estava copiada em 6 lugares/5 arquivos
 * (achado da auditoria, ver docs/redesign/auditoria.md "4"). Renderiza
 * como next/link (navegação interna), <a target="_blank"> (destino
 * externo, ex: WhatsApp) ou <button> (ação local, ex: "tentar
 * novamente"), decidido pelas props em vez de três componentes
 * separados — mantém uma única definição visual para as três formas de
 * uso.
 */
export function Button({
  variant = "primary",
  children,
  className = "",
  href,
  external,
  onClick,
  type,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={classes}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} onClick={onClick} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
