"use client";

import { Hero } from "@/app/components/Hero";
import { FactsStrip } from "@/app/components/FactsStrip";
import { Projects } from "@/app/components/Projects";
import { BridgeModel } from "@/app/components/BridgeModel";
import { FocusMosaic } from "@/app/components/FocusMosaic";
import { About } from "@/app/components/About";
import { PresidentQuote } from "@/app/components/PresidentQuote";
import { VolunteerCta } from "@/app/components/VolunteerCta";

export function Landing() {
  return (
    /*
      Sequenced around the work rather than around the institution: what we are
      building, then the wider remit, then who is doing it.

      The page runs on white, one navy band, one warm band, white. The warm band
      is contiguous (FocusMosaic → About) rather than alternating section by
      section — every ground change is a seam, and seams
      are what made this read as busier than it is. The marquee is gone.
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
    </>
  );
}
