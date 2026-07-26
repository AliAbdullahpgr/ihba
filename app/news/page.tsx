import type { Metadata } from "next";
import { NewsPage } from "@/app/components/pages/NewsPage";

export const metadata: Metadata = {
  title: "Haberler",
  description:
    "IHBA'nın çalıştığı bölgelerden saha raporları, proje güncellemeleri ve duyurular.",
};

export default function Page() {
  return <NewsPage />;
}
