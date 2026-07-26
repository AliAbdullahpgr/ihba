"use client";

import { Hero } from "@/app/components/Hero";
import { FactsStrip } from "@/app/components/FactsStrip";
import { Projects } from "@/app/components/Projects";
import { BridgeModel } from "@/app/components/BridgeModel";
import { FocusMosaic } from "@/app/components/FocusMosaic";
import { About } from "@/app/components/About";
import { PresidentQuote } from "@/app/components/PresidentQuote";
import { VolunteerCta } from "@/app/components/VolunteerCta";
import { Ticker } from "@/app/components/Ticker";
import { Newsletter } from "@/app/components/Newsletter";

export function Landing() {
  return (
    /*
      Sequenced around the work rather than around the institution: what we are
      building, then how a bridge gets built, then the wider remit.
    */
    <>
      <Hero />
      <FactsStrip />
      <Projects />
      <BridgeModel />
      <FocusMosaic />
      <About />
      <PresidentQuote />
      <VolunteerCta />
      <Ticker />
      <Newsletter />
    </>
  );
}
