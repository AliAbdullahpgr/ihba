import type { Metadata } from "next";
import { VolunteerPage } from "@/app/components/pages/VolunteerPage";

export const metadata: Metadata = {
  title: "Gönüllülük",
  description:
    "IHBA'nın saha faaliyetleri, öğrenci ve eğitim çalışmaları, organizasyon, iletişim, içerik üretimi ve dönemsel yardım çalışmalarına katkı sunun.",
};

export default function Page() {
  return <VolunteerPage />;
}
