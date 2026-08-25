import type { Metadata } from "next";
import { Fraunces, Lora } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-lora",
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
    <html lang="pt-BR" className={`${fraunces.variable} ${lora.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
