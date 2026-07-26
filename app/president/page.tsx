import type { Metadata } from "next";
import { PresidentPage } from "@/app/components/pages/PresidentPage";

export const metadata: Metadata = {
  title: "Başkanın Mesajı",
  description:
    "Yönetim Kurulu Başkanı Abdullah Serenli: İnsanlık, coğrafi sınırların ve kültürel farklılıkların ötesinde hepimizin ortak sorumluluğudur.",
};

export default function Page() {
  return <PresidentPage />;
}
