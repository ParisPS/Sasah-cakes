import type { Metadata } from "next";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";
import { Button } from "@/components/Button";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Como Encomendar · Sasah Cakes",
  description:
    "Como encomendar bolos e docinhos da Sasah Cakes: passo a passo, pagamento via Pix, sinal e retirada no local.",
};

const PASSOS = [
  { numero: 1, texto: "Escolha o bolo ou os docinhos no cardápio" },
  { numero: 2, texto: "Chame no WhatsApp para confirmar" },
  { numero: 3, texto: "Pague 50% de sinal via Pix" },
  { numero: 4, texto: "Retire no local, na data combinada" },
];

// Como Encomendar — ver docs/design/wireframes.md ("Como Encomendar") e
// docs/redesign/arquitetura.md ("3.4 Como Encomendar", inclui a seção de
// contato que antes vivia em /contato — Fase 9, item "1.2"). Frase de
// abertura + RevealOnScroll + alternância de fundo (branco → cream-500)
// aplicadas aqui na varredura final da Fase 9, fechando o "degradê de
// capricho" da auditoria também nesta página.
export default function ComoEncomendarPage() {
  const { contato, pagamento, entrega, antecedenciaMinima, sinal } =
    cardapio.comoEncomendar;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900">Como Encomendar</h1>
      <p className="text-ink-600 mt-3">
        Quatro passos simples, do cardápio até a retirada do seu pedido.
      </p>

      <RevealOnScroll>
        <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          {PASSOS.map((passo) => (
            <li
              key={passo.numero}
              className="bg-cream-300 rounded-lg p-6 shadow-sm"
            >
              <span className="font-heading text-sage-700 text-2xl font-bold">
                {passo.numero}
              </span>
              <p className="text-ink-900 mt-2">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="bg-cream-500 mt-14 grid grid-cols-1 gap-6 rounded-lg p-6 md:grid-cols-2 md:p-8">
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <h2 className="text-sage-900">Contato</h2>
            <p className="text-ink-900 mt-3">{contato.nome}</p>
            <p className="text-ink-600">{contato.telefone}</p>
            <Button
              variant="primary"
              href={linkWhatsApp(contato.telefone)}
              external
              className="mt-6"
            >
              Chamar no WhatsApp
            </Button>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="text-sage-900">Pagamento e retirada</h2>
            <ul className="text-ink-900 mt-4 space-y-3">
              <li>
                <span className="text-sage-700 font-semibold">Pagamento:</span>{" "}
                {pagamento}
              </li>
              <li>
                <span className="text-sage-700 font-semibold">Sinal:</span>{" "}
                {sinal}
              </li>
              <li>
                <span className="text-sage-700 font-semibold">
                  Antecedência mínima:
                </span>{" "}
                {antecedenciaMinima}
              </li>
              <li>
                <span className="text-sage-700 font-semibold">Entrega:</span>{" "}
                {entrega}
              </li>
            </ul>
          </div>
        </div>
      </RevealOnScroll>
    </main>
  );
}
