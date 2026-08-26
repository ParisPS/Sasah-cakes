import { cardapio, CATEGORIA_PORTFOLIO_LABELS } from "@/lib/cardapio";
import type { ItemPortfolio } from "@/lib/cardapio";
import { Badge } from "./Badge";
import { PortfolioImage } from "./PortfolioImage";

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
  /** Itens a exibir — por padrão, o portfólio completo. A Home passa uma
   * amostra curada (ver lib/cardapio.ts, amostraCuradaPortfolio); a
   * Galeria pode passar um subconjunto filtrado por categoria. */
  itens?: ItemPortfolio[];
  /** A Galeria (Fase 9) substitui o badge repetido por foto por um
   * filtro de categoria no topo — ver docs/redesign/arquitetura.md
   * "3.3". Default true para manter o comportamento da Home. */
  showBadge?: boolean;
  /** Nomes de arquivo que ocupam 2 colunas no grid "full" (desktop) —
   * cria o "grid editorial" da Galeria (Fase 9) sem variar o crop da
   * foto em si, que continua fixo em 3:4 (decisão da Etapa 2, mantida
   * aqui: variar o TAMANHO de exibição, não a proporção do recorte). Sem
   * efeito no variant "preview". */
  arquivosDestacados?: string[];
};

// Fotos reais de trabalhos entregues (Fase 4), servidas de
// public/portfolio/ e carregadas via next/image (lazy loading nativo —
// nenhum item aqui usa `priority` — + formatos modernos automáticos).
// PortfolioImage (Fase 7) cobre o carregamento com um skeleton na paleta
// da marca. Proporção retrato (3/4) para acomodar as fotos originais
// (~231x325px, recortadas de um carrossel de Instagram) sem cortar
// demais o bolo — crop fixo mantido na Fase 9 (redesign de marca), ver
// docs/redesign/direcao-artistica.md "3.4".
export function GallerySection({
  variant = "full",
  itens = cardapio.portfolio.itens,
  showBadge = true,
  arquivosDestacados = [],
}: GallerySectionProps) {
  return (
    <div
      className={
        variant === "preview"
          ? "flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible"
          : "grid grid-cols-1 gap-6 md:grid-flow-dense md:grid-cols-3"
      }
    >
      {itens.map((item) => (
        <div
          key={item.arquivo}
          className={
            variant === "preview"
              ? "w-40 shrink-0 md:w-auto"
              : arquivosDestacados.includes(item.arquivo)
                ? "md:col-span-2"
                : undefined
          }
        >
          {/* Moldura tipo passe-partout (Fase 9): a mat de cream-300 ao
              redor da foto muda a leitura de "recorte de baixa
              resolução" para "peça apresentada com intenção" — ver
              docs/redesign/direcao-artistica.md "3.4". */}
          <div className="bg-cream-300 rounded-md p-2">
            <div className="bg-sage-100 relative aspect-3/4 overflow-hidden rounded-sm">
              <PortfolioImage
                src={`/portfolio/${item.arquivo}`}
                alt={item.alt}
                sizes={
                  variant === "preview"
                    ? "(min-width: 768px) 25vw, 160px"
                    : "(min-width: 768px) 33vw, 100vw"
                }
              />
              {showBadge && (
                <div className="absolute bottom-2 left-2">
                  <Badge>{CATEGORIA_PORTFOLIO_LABELS[item.categoria]}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
