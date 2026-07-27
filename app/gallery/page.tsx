import type { Metadata } from "next";
import { GalleryPage } from "@/app/components/pages/GalleryPage";
import { getPublicGalleryItems } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Saha Galerisi",
  description:
    "IHBA'nın Pakistan'daki insani yardım, temiz su ve saha çalışmalarından fotoğraflar.",
};

export default async function GalleryRoute() {
  const items = await getPublicGalleryItems();
  return <GalleryPage items={items} />;
}
