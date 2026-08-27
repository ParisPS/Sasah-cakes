"use client";

import { useState } from "react";
import Image from "next/image";

type PortfolioImageProps = {
  src: string;
  alt: string;
  sizes: string;
};

// Skeleton customizado (não next/image placeholder="blur") — as fotos do
// portfólio são referenciadas por caminho de string (public/portfolio/),
// então não têm blurDataURL gerado automaticamente no build. Um skeleton
// na paleta da marca (sage-100/cream, não cinza genérico) evita depender
// disso e reforça a identidade visual mesmo durante o carregamento. Ver
// docs/design/motion-principles.md.
export function PortfolioImage({ src, alt, sizes }: PortfolioImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden="true"
        className={`from-sage-100 to-cream-500 absolute inset-0 bg-linear-to-br transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          loaded
            ? "opacity-0"
            : "animate-pulse opacity-100 motion-reduce:animate-none"
        }`}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
