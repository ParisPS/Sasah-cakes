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
 * Repouso: borda fina (`cream-700`) em vez de sombra — Fase 9 (redesign
 * de marca, ver docs/redesign/direcao-artistica.md "3.2"): sombra como
 * único recurso de definição lia "card de UI genérico"; a borda dá
 * contorno sem depender disso. Sombra (`shadow-md`) entra só como
 * reforço no active/hover, junto com leve escala ao toque — o card
 * "sobe" fisicamente ao ser tocado, em vez de já vir pesado em repouso.
 */
export function ProductCard({
  title,
  subtitle,
  price,
  children,
}: ProductCardProps) {
  return (
    <div className="bg-cream-300 border-cream-700 rounded-lg border p-6 shadow-none transition-[box-shadow,transform] duration-150 active:scale-[0.98] active:shadow-md motion-reduce:transition-none md:hover:shadow-md">
      <h4>{title}</h4>
      <p className="caption mt-1">{subtitle}</p>
      {/* Preço em destaque — mesma escala de H4 (ver design-tokens.md),
          mas sem tag <h4> duplicada por card para manter a hierarquia
          semântica do documento. */}
      <p className="font-heading text-sage-700 mt-3 text-[19px] leading-[1.25] font-semibold md:text-[22px]">
        {formatarPreco(price)}
      </p>
      {children}
    </div>
  );
}
