import Image from "next/image";
import { cardapio, CATEGORIA_PORTFOLIO_LABELS } from "@/lib/cardapio";
import { Badge } from "./Badge";

type GallerySectionProps = {
  /**
   * "preview" — usado na Home: scroll horizontal no mobile, grid 4
   * colunas no desktop.
   * "full" — usado na página Galeria: grid 1 coluna no mobile, 3 colunas
   * no desktop.
   * Ver docs/design/style-guide.md ("Componentes recorrentes" → "Seção
   * de galeria") e docs/design/wireframes.md.
   */
  variant?: "preview" | "full";
};

// Fotos reais de trabalhos entregues (Fase 4), servidas de
// public/portfolio/ e carregadas via next/image (lazy loading + formatos
// modernos automáticos). Proporção retrato (3/4) para acomodar as fotos
// originais (~231x325px, recortadas de um carrossel de Instagram) sem
// cortar demais o bolo.
export function GallerySection({ variant = "full" }: GallerySectionProps) {
  const itens = cardapio.portfolio.itens;

  return (
    <div
      className={
        variant === "preview"
          ? "flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible"
          : "grid grid-cols-1 gap-6 md:grid-cols-3"
      }
    >
      {itens.map((item) => (
        <div
          key={item.arquivo}
          className={
            variant === "preview"
              ? "bg-sage-100 relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-md md:w-auto"
              : "bg-sage-100 relative aspect-3/4 overflow-hidden rounded-md"
          }
        >
          <Image
            src={`/portfolio/${item.arquivo}`}
            alt={item.alt}
            fill
            sizes={
              variant === "preview"
                ? "(min-width: 768px) 25vw, 160px"
                : "(min-width: 768px) 33vw, 100vw"
            }
            className="object-cover"
          />
          <div className="absolute bottom-2 left-2">
            <Badge>{CATEGORIA_PORTFOLIO_LABELS[item.categoria]}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
