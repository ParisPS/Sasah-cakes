import { cardapio, linkWhatsApp } from "@/lib/cardapio";

// Botão flutuante de WhatsApp — ver docs/design/style-guide.md
// ("Componentes recorrentes" → "Botão flutuante de WhatsApp"). Presente em
// todas as páginas (renderizado uma vez em app/layout.tsx), fixo no canto
// inferior direito, sempre visível (sem scroll-to-hide).
export function WhatsAppButton() {
  const { telefone } = cardapio.comoEncomendar.contato;

  return (
    <a
      href={linkWhatsApp(telefone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chamar no WhatsApp"
      // Páginas como Como Encomendar e Contato também têm um botão "Chamar
      // no WhatsApp" no corpo do conteúdo, com o mesmo nome acessível —
      // data-testid distingue este botão flutuante nos testes E2E.
      data-testid="whatsapp-float"
      className="rounded-pill bg-sage-500 text-cream-300 md:hover:bg-sage-700 fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center shadow-lg transition-transform active:scale-95"
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.703 4.612 1.918 6.481L4 29l7.694-1.887A11.94 11.94 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3zm0 21.818c-1.929 0-3.762-.505-5.353-1.462l-.384-.228-4.563 1.119 1.144-4.448-.25-.396A9.77 9.77 0 0 1 5.182 15c0-5.964 4.855-10.818 10.819-10.818S26.818 9.036 26.818 15 21.965 24.818 16.001 24.818zm5.44-7.51c-.298-.149-1.76-.868-2.033-.967-.273-.099-.472-.149-.671.15-.198.297-.769.966-.943 1.164-.174.198-.347.223-.645.075-.297-.15-1.256-.463-2.393-1.475-.885-.789-1.482-1.763-1.656-2.061-.174-.298-.019-.459.13-.607.134-.133.298-.347.446-.521.149-.174.198-.298.298-.496.099-.198.05-.372-.025-.521-.075-.149-.671-1.616-.92-2.213-.242-.582-.488-.503-.671-.512l-.571-.01c-.198 0-.521.075-.794.372s-1.04 1.017-1.04 2.481 1.065 2.877 1.213 3.075c.149.198 2.096 3.2 5.077 4.489.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.76-.719 2.008-1.414.248-.694.248-1.289.174-1.414-.074-.124-.273-.198-.571-.347z" />
      </svg>
    </a>
  );
}
