import type { Metadata } from "next";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";

export const metadata: Metadata = {
  title: "Como Encomendar · Sasah Cakes",
};

const PASSOS = [
  { numero: 1, texto: "Escolha o bolo ou os docinhos no cardápio" },
  { numero: 2, texto: "Chame no WhatsApp para confirmar" },
  { numero: 3, texto: "Pague 50% de sinal via Pix" },
  { numero: 4, texto: "Retire no local, na data combinada" },
];

// Como Encomendar — ver docs/design/wireframes.md ("Como Encomendar").
export default function ComoEncomendarPage() {
  const { contato, pagamento, entrega, antecedenciaMinima, sinal } =
    cardapio.comoEncomendar;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900">Como Encomendar</h1>

      <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        {PASSOS.map((passo) => (
          <li
            key={passo.numero}
            className="rounded-lg bg-cream-300 p-6 shadow-sm"
          >
            <span className="font-heading text-2xl font-bold text-sage-700">
              {passo.numero}
            </span>
            <p className="mt-2 text-ink-900">{passo.texto}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-cream-300 p-8 text-center shadow-sm">
          <h2 className="text-sage-900">Contato</h2>
          <p className="mt-3 text-ink-900">{contato.nome}</p>
          <p className="text-ink-600">{contato.telefone}</p>
          <a
            href={linkWhatsApp(contato.telefone)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-pill bg-sage-500 px-7 py-3 font-body text-cream-300 shadow-sm transition-[box-shadow,transform] active:scale-[0.98] active:bg-sage-700 active:shadow-md md:hover:bg-sage-700 md:hover:shadow-md"
          >
            Chamar no WhatsApp
          </a>
        </div>

        <div className="rounded-lg bg-cream-300 p-8 shadow-sm">
          <h2 className="text-sage-900">Pagamento e retirada</h2>
          <ul className="mt-4 space-y-3 text-ink-900">
            <li>
              <span className="font-semibold text-sage-700">
                Pagamento:
              </span>{" "}
              {pagamento}
            </li>
            <li>
              <span className="font-semibold text-sage-700">Sinal:</span>{" "}
              {sinal}
            </li>
            <li>
              <span className="font-semibold text-sage-700">
                Antecedência mínima:
              </span>{" "}
              {antecedenciaMinima}
            </li>
            <li>
              <span className="font-semibold text-sage-700">Entrega:</span>{" "}
              {entrega}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
