import type { Metadata } from "next";
import { LegalPage } from "@/app/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "IHBA internet sitesinde kullanılan tarayıcı depolama teknolojilerine ilişkin çerez politikası.",
};

export default function Page() {
  return <LegalPage page="cookies" />;
}
