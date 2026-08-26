// Links de navegação — refletem docs/sitemap.md. Centralizados aqui para
// que Header e Footer não dupliquem a lista de rotas.

export type NavLink = {
  href: string;
  label: string;
};

// 5 → 3 itens na Fase 9 (redesign de marca): Docinhos vira seção do
// Cardápio (/cardapio#docinhos) e Contato é absorvido por Como
// Encomendar — ver docs/redesign/arquitetura.md "2.1".
export const NAV_LINKS: NavLink[] = [
  { href: "/cardapio", label: "Cardápio" },
  { href: "/como-encomendar", label: "Como Encomendar" },
  { href: "/galeria", label: "Galeria" },
];
