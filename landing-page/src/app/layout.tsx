import type { Metadata } from "next";
import { Alfa_Slab_One, Nunito } from "next/font/google";
import "./globals.css";

const alfaSlab = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  weight: "400",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schoolify — Votre école, pilotée en un clic",
  description:
    "Schoolify est le logiciel de gestion scolaire qui réunit administration, suivi des élèves, transport et communication avec les parents dans une seule plateforme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${alfaSlab.variable} ${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
