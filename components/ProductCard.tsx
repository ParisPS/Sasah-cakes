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
 * Estado funcional principal é active/tap (mobile-first, sem cursor):
 * shadow-sm em repouso → shadow-md + leve escala ao toque. Hover
 * (shadow-md) é um enhancement opcional, só em desktop (md:).
 */
export function ProductCard({
  title,
  subtitle,
  price,
  children,
}: ProductCardProps) {
  return (
    <div className="rounded-lg bg-cream-300 p-6 shadow-sm transition-[box-shadow,transform] duration-150 active:scale-[0.98] active:shadow-md md:hover:shadow-md">
      <h4>{title}</h4>
      <p className="caption mt-1">{subtitle}</p>
      {/* Preço em destaque — mesma escala de H4 (ver design-tokens.md),
          mas sem tag <h4> duplicada por card para manter a hierarquia
          semântica do documento. */}
      <p className="font-heading mt-3 text-[19px] leading-[1.25] font-semibold text-sage-700 md:text-[22px]">
        {formatarPreco(price)}
      </p>
      {children}
    </div>
  );
}
