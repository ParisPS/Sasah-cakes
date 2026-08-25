import { cardapio } from "@/lib/cardapio";
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

// Fotos reais ainda não foram fornecidas (ver assets/portfolio/README.md)
// — cada item é renderizado como um placeholder sage-100 com a categoria
// em badge sobreposto, até que os arquivos reais substituam os nomes em
// content/cardapio.json (portfolio.itens).
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
              ? "relative aspect-square w-40 shrink-0 overflow-hidden rounded-md bg-sage-100 md:w-auto"
              : "relative aspect-square overflow-hidden rounded-md bg-sage-100"
          }
        >
          <div className="absolute bottom-2 left-2">
            <Badge>{item.categoria}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
