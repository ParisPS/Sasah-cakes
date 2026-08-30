import type { Metadata } from "next";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";
import { Button } from "@/components/Button";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { FormularioPedido } from "@/components/FormularioPedido";

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
//
// Fase 8 (formulário de pedido, ver docs/fase8-formulario-pedido.md):
// o formulário (FormularioPedido) passa a ser o CTA PRIMÁRIO da página
// — pensado para quem já sabe o que quer encomendar. O botão genérico
// "Falar no WhatsApp", que antes vivia dentro do card de Contato como
// CTA primário, virou CTA SECUNDÁRIO (variante `secondary`) para quem
// só quer tirar uma dúvida antes de decidir — por isso saiu do card de
// Contato (que ficaria com dois CTAs concorrentes) e foi reposicionado
// para perto do topo, junto da frase de abertura.
export default function ComoEncomendarPage() {
  const { contato, pagamento, entrega, antecedenciaMinima, sinal } =
    cardapio.comoEncomendar;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <h1 className="text-sage-900 dark:text-sage-100">Como Encomendar</h1>
      <p className="text-ink-600 mt-3">
        Quatro passos simples, do cardápio até a retirada do seu pedido.
      </p>

      <div className="mt-6">
        <Button
          variant="secondary"
          href={linkWhatsApp(contato.telefone)}
          external
        >
          Prefere só tirar uma dúvida? Fale direto no WhatsApp
        </Button>
      </div>

      <RevealOnScroll>
        <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          {PASSOS.map((passo) => (
            <li
              key={passo.numero}
              className="bg-cream-300 rounded-lg p-6 shadow-sm"
            >
              {/* font-normal: Titan One (Fase 10) só existe em peso 400 —
                  ver nota em app/globals.css. */}
              <span className="font-heading text-sage-700 dark:text-sage-300 text-2xl font-normal">
                {passo.numero}
              </span>
              <p className="text-ink-900 mt-2">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="bg-cream-500 mt-14 rounded-lg p-6 shadow-sm md:p-8">
          <h2 className="text-sage-900 dark:text-sage-100">Faça seu pedido</h2>
          <p className="text-ink-600 mt-2">
            Preencha os dados abaixo — vamos abrir o WhatsApp com sua encomenda
            já pronta para enviar.
          </p>
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm md:p-8">
            <FormularioPedido />
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-cream-300 rounded-lg p-8 text-center shadow-sm">
            <h2 className="text-sage-900 dark:text-sage-100">Contato</h2>
            <p className="text-ink-900 mt-3">{contato.nome}</p>
            <p className="text-ink-600">{contato.telefone}</p>
          </div>

          <div className="bg-cream-300 rounded-lg p-8 shadow-sm">
            <h2 className="text-sage-900 dark:text-sage-100">
              Pagamento e retirada
            </h2>
            <ul className="text-ink-900 mt-4 space-y-3">
              <li>
                <span className="text-sage-700 dark:text-sage-300 font-semibold">
                  Pagamento:
                </span>{" "}
                {pagamento}
              </li>
              <li>
                <span className="text-sage-700 dark:text-sage-300 font-semibold">
                  Sinal:
                </span>{" "}
                {sinal}
              </li>
              <li>
                <span className="text-sage-700 dark:text-sage-300 font-semibold">
                  Antecedência mínima:
                </span>{" "}
                {antecedenciaMinima}
              </li>
              <li>
                <span className="text-sage-700 dark:text-sage-300 font-semibold">
                  Entrega:
                </span>{" "}
                {entrega}
              </li>
            </ul>
          </div>
        </div>
      </RevealOnScroll>
    </main>
  );
}
