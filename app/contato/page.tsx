import type { Metadata } from "next";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";

export const metadata: Metadata = {
  title: "Contato · Sasah Cakes",
};

// Contato — ver docs/design/wireframes.md ("Contato"). Página
// intencionalmente simples: coluna única centralizada, sem grid, mesmo
// no desktop.
export default function ContatoPage() {
  const { contato, pagamento, entrega } = cardapio.comoEncomendar;

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center md:px-6">
      <h1 className="text-sage-900">Contato</h1>

      <div className="bg-cream-300 mt-10 rounded-lg p-8 shadow-sm">
        <p className="text-ink-900">{contato.nome}</p>
        <p className="text-ink-600">{contato.telefone}</p>
        <a
          href={linkWhatsApp(contato.telefone)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-pill bg-sage-500 font-body text-cream-300 active:bg-sage-700 md:hover:bg-sage-700 mt-6 inline-block px-7 py-3 shadow-sm transition-[box-shadow,transform] active:scale-[0.98] active:shadow-md motion-reduce:transition-none md:hover:shadow-md"
        >
          Chamar no WhatsApp
        </a>
      </div>

      <p className="caption mt-6">
        Pagamento via {pagamento}. {entrega}.
      </p>
    </main>
  );
}
