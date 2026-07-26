import type { Metadata } from "next";
import { AboutPage } from "@/app/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "International Humanity Bridge (IHBA) is a civil society organisation that places human dignity at the centre of its work, established in Istanbul on 19 February 2025.",
};

export default function Page() {
  return <AboutPage />;
}
