"use client";

import { LanguageProvider } from "@/app/components/LanguageProvider";
import { SiteHeader } from "@/app/components/SiteHeader";
import { Hero } from "@/app/components/Hero";
import { Ticker } from "@/app/components/Ticker";
import { FactsStrip } from "@/app/components/FactsStrip";
import { About } from "@/app/components/About";
import { Programs } from "@/app/components/Programs";
import { Projects } from "@/app/components/Projects";
import { BridgeModel } from "@/app/components/BridgeModel";
import { PresidentQuote } from "@/app/components/PresidentQuote";
import { VolunteerCta } from "@/app/components/VolunteerCta";
import { Newsletter } from "@/app/components/Newsletter";
import { SiteFooter } from "@/app/components/SiteFooter";

export function Landing() {
  return (
    <LanguageProvider>
      <SiteHeader />
      <main>
        <Hero />
        <Ticker />
        <FactsStrip />
        <About />
        <Programs />
        <Projects />
        <BridgeModel />
        <PresidentQuote />
        <VolunteerCta />
        <Newsletter />
      </main>
      <SiteFooter />
    </LanguageProvider>
  );
}
