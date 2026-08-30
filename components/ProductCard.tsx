import type { ReactNode } from "react";
import { formatarPreco } from "@/lib/cardapio";

type ProductCardProps = {
  title: string;
  subtitle: string;
  price: number;
  children?: ReactNode;
};

/**
 * Card de produto — ver docs/design/style-guide.md ("Componentes
 * recorrentes" → "Card de produto"). Usado no Cardápio (tamanhos de bolo)
 * e em Docinhos (pacote).
 *
 * Repouso: borda fina (`cream-700`) + `shadow-sm` quase imperceptível —
 * Fase 9 (redesign de marca, ver docs/redesign/direcao-artistica.md
 * "3.2"): reduz a DEPENDÊNCIA de sombra como único recurso, mas não a
 * elimina de vez. A família `cream` inteira tem luminância muito
 * próxima entre si (cream-300 sobre branco/cream-500 mede ~1.1:1 de
 * contraste — a borda sozinha não segura o contorno do card em todo
 * fundo), então o `shadow-sm` residual continua fazendo o trabalho
 * pesado de separar o card do que está atrás dele; a borda reforça.
 * `shadow-md` entra como reforço maior no active/hover, junto com leve
 * escala ao toque — o card "sobe" fisicamente ao ser tocado.
 */
export function ProductCard({
  title,
  subtitle,
  price,
  children,
}: ProductCardProps) {
  return (
    <div className="bg-cream-300 border-cream-700 rounded-lg border p-6 shadow-sm transition-[box-shadow,transform] duration-150 active:scale-[0.98] active:shadow-md motion-reduce:transition-none md:hover:shadow-md">
      <h4>{title}</h4>
      <p className="caption mt-1">{subtitle}</p>
      {/* Preço em destaque — mesma escala de H4 (ver design-tokens.md),
          mas sem tag <h4> duplicada por card para manter a hierarquia
          semântica do documento. font-normal: Titan One só existe em
          peso 400 (Fase 10) — ver nota em app/globals.css. */}
      <p className="font-heading text-sage-700 dark:text-sage-300 mt-3 text-[19px] leading-tight font-normal md:text-[22px]">
        {formatarPreco(price)}
      </p>
      {children}
    </div>
  );
}
