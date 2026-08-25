import type { ReactNode } from "react";

// Badge de categoria — pill-shape, ver docs/design/style-guide.md
// ("Componentes recorrentes" → "Badge de categoria"). Usado para recheios,
// sabores de docinho e categorias de foto na galeria.
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill bg-sage-100 text-sage-700 inline-flex items-center px-3 py-1 text-sm font-semibold">
      {children}
    </span>
  );
}
