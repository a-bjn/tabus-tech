import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tabus Tech — Instalații electrice, automatizări și CCTV",
  description:
    "Proiectare, execuție și mentenanță pentru instalații electrice de joasă și medie tensiune, tablouri, automatizări industriale și sisteme CCTV. Rezidențial și industrial.",
  openGraph: {
    title: "Tabus Tech — Instalații electrice, automatizări și CCTV",
    description:
      "De la proiect la punere în funcțiune și mentenanță: instalații electrice, tablouri, automatizări industriale și securitate video.",
    locale: "ro_RO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${display.variable} ${code.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
