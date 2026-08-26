import Link from "next/link";
import { GallerySection } from "@/components/GallerySection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Button } from "@/components/Button";

const DESTAQUES = [
  {
    href: "/cardapio",
    title: "Cardápio de Bolos",
    description: "Bolos redondos e quadrados, recheios à sua escolha.",
  },
  {
    href: "/docinhos",
    title: "Docinhos",
    description: "Pacotes de 100 docinhos, com até 4 sabores diferentes.",
  },
  {
    href: "/como-encomendar",
    title: "Como Encomendar",
    description: "Contato, pagamento via Pix e retirada no local.",
  },
];

// Home — ver docs/design/wireframes.md ("Home") e
// docs/design/style-guide.md.
export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-cream-500 relative overflow-hidden px-4 py-24 text-center md:px-6 md:py-32">
        {/* Manchas de aquarela decorativas — ver design-tokens.md
            ("Cards" → decoração opcional). Puramente visual, sem
            interação/motion. */}
        <div
          aria-hidden="true"
          className="rounded-pill bg-sage-300/30 pointer-events-none absolute -top-24 -left-24 h-72 w-72 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="rounded-pill bg-sage-100/60 pointer-events-none absolute -right-20 -bottom-32 h-80 w-80 blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl">
          <h1 className="text-sage-900">
            Bolos e docinhos feitos à mão, com carinho
          </h1>
          <p className="text-ink-600 mt-6 text-lg">
            Encomendas para festas e ocasiões especiais — retirada no local,
            pagamento via Pix.
          </p>
          <Button variant="primary" href="/cardapio" className="mt-8">
            Ver Cardápio
          </Button>
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <RevealOnScroll className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {DESTAQUES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-cream-300 block rounded-lg p-6 shadow-sm transition-[box-shadow,transform] active:scale-[0.98] active:shadow-md motion-reduce:transition-none md:hover:shadow-md"
            >
              <h3 className="text-sage-900">{item.title}</h3>
              <p className="text-ink-600 mt-2">{item.description}</p>
              <span className="font-body text-sage-700 mt-4 inline-block">
                Ver mais →
              </span>
            </Link>
          ))}
        </RevealOnScroll>
      </section>

      {/* Preview de galeria */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <RevealOnScroll>
          <h2 className="text-sage-900">Nosso Trabalho</h2>
          <div className="mt-8">
            <GallerySection variant="preview" />
          </div>
          <Link
            href="/galeria"
            className="font-body text-sage-700 mt-6 inline-block underline underline-offset-4"
          >
            Ver galeria completa →
          </Link>
        </RevealOnScroll>
      </section>
    </main>
  );
}
