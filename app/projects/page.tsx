import type { Metadata } from "next";
import { ProjectsIndexPage } from "@/app/components/pages/ProjectsIndexPage";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The Mazar-i-Sharif Education Centre, the Pakistan International Student Education and Support Programme, and IHBA's Ramadan and Qurban humanitarian programmes.",
};

export default function Page() {
  return <ProjectsIndexPage />;
}
