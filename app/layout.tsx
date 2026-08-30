import type { Metadata } from "next";
import { Titan_One, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SCRIPT_INLINE_TEMA } from "@/lib/tema";
import "./globals.css";

// Fonte display — Fase 10 (mascote e tipografia), substitui a Fraunces.
// Ver docs/redesign/mascote-e-tipografia.md: o mascote (fatia de bolo
// "rubber hose" num selo circular vintage) pede uma tipografia com mais
// "massa"/personalidade de confeitaria do que a elegância serifada da
// Fraunces — Titan One é uma display bold, arredondada, só maiúsculas,
// no mesmo espírito retrô do selo. Peso único (400, a única variação
// que a fonte oferece no Google Fonts).
const titanOne = Titan_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-titan-one",
  display: "swap",
});

// Fonte funcional — Fase 9 (redesign de marca), substitui a Lora. Ver
// docs/redesign/direcao-artistica.md ("1.2 Fonte funcional"): uma
// grotesca com detalhes orgânicos, para tirar o site do "cottagecore
// all-serif" sem perder o caráter artesanal nos elementos de UI (corpo,
// nav, botões, badges, H5–H6 — H4 passou a usar a fonte display na Fase
// 10, ver docs/redesign/mascote-e-tipografia.md). Pesos 400/500/600
// cobrem toda a escala funcional definida na Etapa 2.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sasah Cakes",
  description:
    "Bolos e docinhos artesanais sob encomenda, com retirada no local — Sasah Cakes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      // scroll-smooth: rolagem suave para navegação por âncora (ex: a
      // barra de categorias do Cardápio, Fase 9). O navegador já ignora
      // essa animação sozinho quando prefers-reduced-motion está ativo
      // (spec de scroll-behavior), sem precisar de motion-reduce: aqui.
      className={`${titanOne.variable} ${bricolage.variable} scroll-smooth`}
    >
      <body className="antialiased">
        {/* Dark mode (Fase 11) — aplica a classe `dark` em <html> antes
            da primeira pintura, evitando um flash do tema claro antes
            de escurecer. beforeInteractive: o Next.js garante que esse
            script roda antes da hidratação e antes do conteúdo da
            página ser pintado. Ver lib/tema.ts (SCRIPT_INLINE_TEMA). */}
        <Script id="tema-inline" strategy="beforeInteractive">
          {SCRIPT_INLINE_TEMA}
        </Script>
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
