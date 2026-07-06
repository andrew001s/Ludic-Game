import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guardianes: El Legado del Bosque",
  description:
    "Un videojuego educativo 2D. Explora un laboratorio abandonado invadido por la naturaleza y descubre los secretos del bosque.",
  keywords: ["videojuego", "educativo", "2D", "pixel art", "bosque", "naturaleza"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050805] text-[#e2e8f0]">
        {children}
      </body>
    </html>
  );
}
