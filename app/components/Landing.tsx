"use client";

import { HeroSlider } from "@/app/components/HeroSlider";
import { IntroSection } from "@/app/components/IntroSection";
import { LatestNews } from "@/app/components/LatestNews";
import { Projects } from "@/app/components/Projects";
import { PresidentQuote } from "@/app/components/PresidentQuote";
import { CampaignCta } from "@/app/components/CampaignCta";

export function Landing() {
  /*
    Short summaries for news, projects and the campaign, each opening a detail
    page: hero, intro, news, projects, president, campaign.

    Three institutional sections have left this page. Mission/vision/values and
    the FAQ moved to the About page — About already carried mission, vision and
    values in full, laid open in two columns rather than folded into an
    accordion, so the homepage copy was the same text a second time, and the
    FAQ answers questions about the organisation rather than about anything the
    homepage offers. The activity-areas accordion went too: /areas-of-work
    covers the same seven fields at length, and the homepage now hands visitors
    to it rather than restating it.

    Keep this list in step with the admin homepage layout editor, which lists
    the same sections in the same order for staff to edit.
  */
  return (
    <>
      <HeroSlider />
      <IntroSection />
      <LatestNews />
      <Projects />
      <PresidentQuote />
      <CampaignCta />
    </>
  );
}