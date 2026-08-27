import type { ReactNode } from "react";

// Badge de categoria — pill-shape, ver docs/design/style-guide.md
// ("Componentes recorrentes" → "Badge de categoria"). Usado para recheios,
// sabores de docinho e categorias de foto na galeria.
//
// Texto em sage-900 (não sage-700) desde a revisão da Fase 9 (Etapa 5):
// sage-700 sobre sage-100 mede 4.37:1 — abaixo do mínimo AA de 4.5:1
// para texto normal (achado da auditoria de contraste desta etapa,
// mesmo raciocínio da correção do CTA principal). sage-900 sobre
// sage-100 mede 7.13:1.
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill bg-sage-100 text-sage-900 inline-flex items-center px-3 py-1 text-sm font-semibold">
      {children}
    </span>
  );
}
