import type { Metadata } from "next";
import { LegalPage } from "@/app/components/pages/LegalPage";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "IHBA kişisel verilerin korunması ve işlenmesine ilişkin KVKK aydınlatma metni.",
};

export default function Page() {
  return <LegalPage page="kvkk" />;
}
