import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CROOKED RIB — Fashion. Tailoring. Your Rules.",
  description:
    "AI-Powered Social Fashion Marketplace connecting customers, women tailors, designers, and fabric suppliers across Uzbekistan.",
  keywords: [
    "Crooked Rib",
    "FashionTech",
    "Uzbekistan",
    "Women Tailors",
    "Bespoke Tailoring",
    "Fabric Marketplace",
    "AI Fashion Design",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream-light text-charcoal antialiased selection:bg-hotpink selection:text-white">
        <LanguageProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
