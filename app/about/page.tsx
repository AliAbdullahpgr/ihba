import type { Metadata } from "next";
import { AboutPage } from "@/app/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Uluslararası İnsanlık Köprüsü Derneği (IHBA), 19 Şubat 2025'te İstanbul'da kurulan, insan onurunu merkeze alan bir sivil toplum kuruluşudur.",
};

export default function Page() {
  return <AboutPage />;
}
