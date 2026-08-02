"use client";

import { HeroSlider } from "@/app/components/HeroSlider";
import { IntroSection } from "@/app/components/IntroSection";
import { LatestNews } from "@/app/components/LatestNews";
import { Projects } from "@/app/components/Projects";
import { AreasAccordion } from "@/app/components/AreasAccordion";
import { PresidentQuote } from "@/app/components/PresidentQuote";
import { CampaignCta } from "@/app/components/CampaignCta";
import { MissionAccordion } from "@/app/components/MissionAccordion";
import { FaqAccordion } from "@/app/components/FaqAccordion";

export function Landing() {
  /*
    Mixed structure: short summaries for projects, news and the campaign
    (each opening detail pages), and expandable sections for the areas of
    activity, the mission/vision/values, and the FAQ.

    Order follows the homepage spec: hero, intro, news, projects, areas,
    president, campaign, mission/values, FAQ.
  */
  return (
    <>
      <HeroSlider />
      <IntroSection />
      <LatestNews />
      <Projects />
      <AreasAccordion />
      <PresidentQuote />
      <CampaignCta />
      <MissionAccordion />
      <FaqAccordion />
    </>
  );
}