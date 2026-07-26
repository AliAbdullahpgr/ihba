import type { Metadata } from "next";
import { ProjectsIndexPage } from "@/app/components/pages/ProjectsIndexPage";

export const metadata: Metadata = {
  title: "Projeler",
  description:
    "Mezar-ı Şerif Eğitim Merkezi, Pakistan Uluslararası Öğrenci Eğitim ve Destek Programı ile IHBA'nın Ramazan ve Kurban dönemi insani yardım faaliyetleri.",
};

export default function Page() {
  return <ProjectsIndexPage />;
}
