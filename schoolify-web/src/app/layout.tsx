import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";


export const metadata: Metadata = {
  title: "Schoolify — Learn the future",
  description: "La plateforme E-dTech pour apprendre les métiers du Web3 et de l'IA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
