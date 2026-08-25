"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
};

// Fade-in + slide-up sutil (12px) ao entrar na viewport durante o
// scroll — ver docs/design/motion-principles.md ("Referência rápida").
// IntersectionObserver nativo, não Framer Motion (justificativa no doc).
//
// Começa VISÍVEL por padrão: se JavaScript estiver desabilitado, ou o
// IntersectionObserver não existir, o conteúdo nunca fica preso em
// opacity-0. Só fica temporariamente invisível se o efeito confirmar,
// depois de montar, que o elemento ainda não está na viewport — aí sim
// anima a entrada quando o usuário rolar até ele.
export function RevealOnScroll({
  children,
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    setVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
