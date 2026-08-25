import { cardapio, linkWhatsApp } from "@/lib/cardapio";

// Footer — presente em todas as páginas (renderizado em app/layout.tsx).
export function Footer() {
  const { contato } = cardapio.comoEncomendar;

  return (
    <footer className="border-t border-cream-700 bg-cream-500">
      <div className="mx-auto max-w-5xl px-4 py-12 text-center md:px-6">
        <p className="font-heading text-lg font-semibold text-sage-700">
          Sasah Cakes
        </p>
        <p className="caption mt-2">
          {contato.nome} · {contato.telefone}
        </p>
        <a
          href={linkWhatsApp(contato.telefone)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-body text-sage-700 underline underline-offset-4"
        >
          Fale no WhatsApp
        </a>
        <p className="caption mt-6">
          © {new Date().getFullYear()} Sasah Cakes. Feito à mão, com
          carinho.
        </p>
      </div>
    </footer>
  );
}
