"use client";

import { LanguageProvider } from "@/app/components/LanguageProvider";
import { SiteHeader } from "@/app/components/SiteHeader";
import { Hero } from "@/app/components/Hero";
import { FocusMosaic } from "@/app/components/FocusMosaic";
import { FactsStrip } from "@/app/components/FactsStrip";
import { Ticker } from "@/app/components/Ticker";
import { About } from "@/app/components/About";
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
        {/* Hero and mosaic share one continuous band so the feature card can
            straddle them, then the stats close the band out. */}
        <Hero />
        <FocusMosaic />
        <FactsStrip />
        <Ticker />
        <About />
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
