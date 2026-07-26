import type { Metadata } from "next";
import { ContactPage } from "@/app/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact IHBA about donations, volunteering, partnerships or media enquiries. Head office in Sultanbeyli, Istanbul, Türkiye.",
};

export default function Page() {
  return <ContactPage />;
}
