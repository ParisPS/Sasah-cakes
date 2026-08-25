import type { Metadata } from "next";
import { cardapio } from "@/lib/cardapio";
import { GallerySection } from "@/components/GallerySection";

export const metadata: Metadata = {
  title: "Galeria · Sasah Cakes",
};

// Galeria — ver docs/design/wireframes.md ("Galeria").
export default function GaleriaPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900">Nosso Trabalho</h1>
      <p className="text-ink-600 mt-3">{cardapio.portfolio.status}</p>

      <div className="mt-10">
        <GallerySection variant="full" />
      </div>
    </main>
  );
}
