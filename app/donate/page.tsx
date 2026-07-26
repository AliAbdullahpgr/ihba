import type { Metadata } from "next";
import { DonatePage } from "@/app/components/pages/DonatePage";

export const metadata: Metadata = {
  title: "Bağış",
  description:
    "Desteğiniz IHBA'nın insani yardım, eğitim, burs ve sürdürülebilir kalkınma programlarını finanse eder.",
};

export default function Page() {
  return <DonatePage />;
}
