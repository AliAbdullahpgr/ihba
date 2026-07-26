import type { Metadata } from "next";
import { AreasPage } from "@/app/components/pages/AreasPage";

export const metadata: Metadata = {
  title: "Our Areas of Work",
  description:
    "Humanitarian assistance, education, sustainable development, children, youth and women, health and social support, culture and volunteering, and institutional cooperation.",
};

export default function Page() {
  return <AreasPage />;
}
