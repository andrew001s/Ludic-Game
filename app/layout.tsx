import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import { AppShellHints } from "./AppShellHints";
import { AchievementProvider } from "@/components/game/Achievements/AchievementProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXUS Ω: Guardianes de la Conservación",
  description:
    "NEXUS Ω: Guardianes de la Conservación es un videojuego educativo 2D de aventura y pixel art sobre naturaleza, ciencia y restauración ecológica.",
  keywords: [
    "NEXUS Ω",
    "Guardianes de la Conservación",
    "videojuego educativo",
    "juego 2D",
    "pixel art",
    "naturaleza",
    "ecología",
    "conservación",
    "aventura",
  ],
  applicationName: "NEXUS Ω: Guardianes de la Conservación",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "NEXUS Ω: Guardianes de la Conservación",
    description:
      "Explora una aventura 2D en pixel art centrada en la conservación, la ciencia y la restauración de la naturaleza.",
    type: "website",
    siteName: "NEXUS Ω: Guardianes de la Conservación",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "NEXUS Ω: Guardianes de la Conservación",
    description:
      "Un videojuego educativo 2D sobre naturaleza, ciencia y restauración ecológica.",
  },
  appleWebApp: {
    capable: true,
    title: "NEXUS Ω",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#050805",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050805] text-[#e2e8f0]">
        <AchievementProvider>
          <AppShellHints />
          {children}
          <ServiceWorkerRegister />
        </AchievementProvider>
      </body>
    </html>
  );
}
