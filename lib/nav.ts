// Links de navegação — refletem docs/sitemap.md. Centralizados aqui para
// que Header e Footer não dupliquem a lista de rotas.

export type NavLink = {
  href: string;
  label: string;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/cardapio", label: "Cardápio" },
  { href: "/docinhos", label: "Docinhos" },
  { href: "/como-encomendar", label: "Como Encomendar" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
];
