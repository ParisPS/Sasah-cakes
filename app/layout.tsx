import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

// Fonte funcional — Fase 9 (redesign de marca), substitui a Lora. Ver
// docs/redesign/direcao-artistica.md ("1.2 Fonte funcional"): uma
// grotesca com detalhes orgânicos, para tirar o site do "cottagecore
// all-serif" sem perder o caráter artesanal nos elementos de UI (corpo,
// nav, botões, badges, H4–H6). Pesos 400/500/600 cobrem toda a escala
// funcional definida na Etapa 2.
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
    <html lang="pt-BR" className={`${fraunces.variable} ${bricolage.variable}`}>
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
