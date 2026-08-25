import { cardapio, linkWhatsApp } from "@/lib/cardapio";

// Footer — presente em todas as páginas (renderizado em app/layout.tsx).
export function Footer() {
  const { contato } = cardapio.comoEncomendar;

  return (
    <footer className="border-cream-700 bg-cream-500 border-t">
      <div className="mx-auto max-w-5xl px-4 py-12 text-center md:px-6">
        <p className="font-heading text-sage-700 text-lg font-semibold">
          Sasah Cakes
        </p>
        <p className="caption mt-2">
          {contato.nome} · {contato.telefone}
        </p>
        <a
          href={linkWhatsApp(contato.telefone)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sage-700 mt-4 inline-block underline underline-offset-4"
        >
          Fale no WhatsApp
        </a>
        <p className="caption mt-6">
          © {new Date().getFullYear()} Sasah Cakes. Feito à mão, com carinho.
        </p>
      </div>
    </footer>
  );
}
