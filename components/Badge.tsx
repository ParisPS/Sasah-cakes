import type { ReactNode } from "react";

// Badge de categoria — pill-shape, ver docs/design/style-guide.md
// ("Componentes recorrentes" → "Badge de categoria"). Usado para recheios,
// sabores de docinho e categorias de foto na galeria.
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill bg-sage-100 px-3 py-1 text-sm font-semibold text-sage-700">
      {children}
    </span>
  );
}
