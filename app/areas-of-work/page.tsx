import type { Metadata } from "next";
import { AreasPage } from "@/app/components/pages/AreasPage";

export const metadata: Metadata = {
  title: "Faaliyet Alanlarımız",
  description:
    "İnsani yardım, eğitim, sürdürülebilir kalkınma, çocuk, gençlik ve kadın çalışmaları, sağlık ve sosyal destek, kültür ve gönüllülük ile kurumsal iş birliği.",
};

export default function Page() {
  return <AreasPage />;
}
