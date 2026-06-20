import type { Metadata } from "next";
import { Space_Grotesk, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import Background from "@/components/layout/Background";
import SiteInteractions from "@/components/layout/SiteInteractions";
import Navbar from "@/components/layout/Navbar";
import SocialRail from "@/components/layout/SocialRail";
import Footer from "@/components/layout/Footer";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk" });
const body = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-sora" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.tagline,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Background />
        <SiteInteractions />
        <Navbar />
        <SocialRail />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
