import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do Turbopack neste repositório: evita que ele suba a
  // árvore de diretórios em busca de outro lockfile (ex: um
  // package-lock.json não relacionado na home do usuário).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
