import type { Metadata } from "next";
import { cardapio } from "@/lib/cardapio";
import { GaleriaFiltravel } from "@/components/GaleriaFiltravel";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Galeria · Sasah Cakes",
};

// Duas fotos com mais impacto visual (temáticas/coloridas) ganham
// destaque no grid editorial quando "Todos" está selecionado — ver
// components/GaleriaFiltravel.tsx e docs/redesign/arquitetura.md "3.3".
// Escolha puramente estética (variedade visual do grid), não afirma
// nada sobre as fotos em si.
const FOTOS_EM_DESTAQUE = [
  "bolo-redondo-tema-doramas.jpg",
  "bolo-quadrado-flamengo.jpg",
];

// Galeria — ver docs/design/wireframes.md ("Galeria") e
// docs/redesign/arquitetura.md ("3.3 Galeria"). Mostra as 12 fotos
// completas com filtro por categoria — o que a distingue da amostra
// curada de 4 fotos da Home (app/page.tsx).
export default function GaleriaPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900">Nosso Trabalho</h1>
      <p className="text-ink-600 mt-3">{cardapio.portfolio.status}</p>

      <RevealOnScroll className="mt-10">
        <GaleriaFiltravel
          itens={cardapio.portfolio.itens}
          arquivosDestacados={FOTOS_EM_DESTAQUE}
        />
      </RevealOnScroll>
    </main>
  );
}
