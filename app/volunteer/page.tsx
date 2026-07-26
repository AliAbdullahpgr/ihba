import type { Metadata } from "next";
import { VolunteerPage } from "@/app/components/pages/VolunteerPage";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Contribute to IHBA's field activities, student and education programmes, events, communications, content production and seasonal humanitarian programmes.",
};

export default function Page() {
  return <VolunteerPage />;
}
