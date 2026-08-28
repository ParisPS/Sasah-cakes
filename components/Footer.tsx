"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { cardapio, linkWhatsApp } from "@/lib/cardapio";

// Rota onde a própria página já mostra nome, telefone e um CTA primário
// de WhatsApp em destaque (ver docs/redesign/arquitetura.md "3.5") — o
// rodapé não repete esses dados aqui, para não duplicar o que a pessoa
// acabou de ler (achado da auditoria, item 1.4).
const ROTAS_SEM_WHATSAPP_NO_RODAPE = ["/como-encomendar"];

// Footer — presente em todas as páginas (renderizado em app/layout.tsx).
// "use client" só por causa do usePathname (decide se mostra o link de
// WhatsApp) — o conteúdo em si continua estático.
export function Footer() {
  const pathname = usePathname();
  const { contato } = cardapio.comoEncomendar;
  const mostrarWhatsApp = !ROTAS_SEM_WHATSAPP_NO_RODAPE.includes(pathname);

  return (
    <footer className="border-cream-700 bg-cream-500 border-t">
      <div className="mx-auto max-w-5xl px-4 py-12 text-center md:px-6">
        {/* Selo do mascote substitui o wordmark de texto — Fase 10 (ver
            docs/redesign/mascote-e-tipografia.md "2"), mesmo raciocínio
            do Header. O nome da marca continua existindo como texto de
            verdade na linha de copyright abaixo. */}
        <Image
          src="/brand/mascote-selo.png"
          alt="Sasah Cakes"
          width={624}
          height={630}
          className="mx-auto h-20 w-20"
        />
        {mostrarWhatsApp && (
          <>
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
          </>
        )}
        <p className="caption mt-6">
          © {new Date().getFullYear()} Sasah Cakes. Feito à mão, com carinho.
        </p>
      </div>
    </footer>
  );
}
