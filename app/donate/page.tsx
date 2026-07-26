import type { Metadata } from "next";
import { DonatePage } from "@/app/components/pages/DonatePage";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support IHBA's humanitarian assistance, education, scholarship and sustainable development programmes.",
};

export default function Page() {
  return <DonatePage />;
}
