import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/app/components/LanguageProvider";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

/*
  Turkish is the site's default language — `lang="tr"` below, and the provider
  renders TR until a visitor chooses otherwise — so the titles and descriptions
  search engines and browser tabs see are Turkish too.
*/
export const metadata: Metadata = {
  title: {
    default: "IHBA — Uluslararası İnsanlık Köprüsü Derneği",
    template: "%s — IHBA",
  },
  description:
    "IHBA; insani yardımı eğitim, sürdürülebilir kalkınma ve güçlü kurumsal iş birlikleriyle birleştirerek bölgeler arasında kalıcı iyilik köprüleri kurar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        {/*
          Chrome and language state live here rather than per page, so switching
          language or navigating between routes never resets either.
        */}
        <LanguageProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
