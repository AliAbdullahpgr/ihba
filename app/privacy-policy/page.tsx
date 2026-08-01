import type { Metadata } from "next";
import { LegalPage } from "@/app/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "IHBA internet sitesi gizlilik politikası ve kişisel bilgilerin kullanımına ilişkin açıklamalar.",
};

export default function Page() {
  return <LegalPage page="privacy" />;
}
